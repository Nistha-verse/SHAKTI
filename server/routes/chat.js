import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireSupabase } from '../services/supabase.js';
import { generateSakhiReply } from '../services/gemini.js';

const router = express.Router();

const ALLOWED_LANG = new Set(['en', 'hi', 'ta', 'te', 'bn', 'mr']);

function normalizeLanguage(lang) {
  if (lang == null) return 'en';
  const s = String(lang).trim().toLowerCase();
  if (ALLOWED_LANG.has(s)) return s;
  return 'en';
}

router.post('/chat', async (req, res, next) => {
  try {
    const { message, language, sessionId: bodySessionId } = req.body ?? {};
    const sessionId =
      typeof bodySessionId === 'string' && bodySessionId.trim()
        ? bodySessionId.trim()
        : uuidv4();

    if (message == null || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message is required and must be a non-empty string' });
    }

    const lang = normalizeLanguage(language);
    const supabase = requireSupabase();

    const now = new Date().toISOString();

    const { error: sessionErr } = await supabase.from('sessions').upsert(
      {
        id: sessionId,
        language: lang,
        updated_at: now,
      },
      { onConflict: 'id' }
    );
    if (sessionErr) throw sessionErr;

    const { data: rawMessages, error: msgErr } = await supabase
      .from('messages')
      .select('id, session_id, role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (msgErr) throw msgErr;

    const historyMessages = [...(rawMessages ?? [])].reverse();

    const replyText = await generateSakhiReply({
      language: lang,
      historyMessages,
      userMessage: message.trim(),
    });

    const { error: insertUserErr } = await supabase.from('messages').insert({
      session_id: sessionId,
      role: 'user',
      content: message.trim(),
    });
    if (insertUserErr) throw insertUserErr;

    const { error: insertAsstErr } = await supabase.from('messages').insert({
      session_id: sessionId,
      role: 'assistant',
      content: replyText,
    });
    if (insertAsstErr) throw insertAsstErr;

    const { error: touchSessionErr } = await supabase
      .from('sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);
    if (touchSessionErr) throw touchSessionErr;

    return res.json({ response: replyText });
  } catch (err) {
    next(err);
  }
});

export default router;
