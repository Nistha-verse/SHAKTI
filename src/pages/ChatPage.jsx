import { useMemo, useState } from 'react';
import PageShell from '../components/PageShell.jsx';
import { useLanguage } from '../providers/LanguageProvider.jsx';

const CHAT_KEY = 'shakti.chat.messages';

function createMessage(role, text) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
    createdAt: new Date().toISOString(),
  };
}

function loadStoredMessages(welcomeText) {
  try {
    const stored = JSON.parse(localStorage.getItem(CHAT_KEY) || '[]');
    if (Array.isArray(stored) && stored.length > 0) {
      return stored;
    }
  } catch {
    console.log('Saved chat could not be read.');
  }
  return [createMessage('sakhi', welcomeText)];
}

export default function ChatPage() {
  const { t } = useLanguage();
  const replies = t('chat.replies');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => loadStoredMessages(t('chat.welcome')));

  const nextReply = useMemo(() => {
    const list = Array.isArray(replies) ? replies : [];
    return list[Math.floor(Math.random() * list.length)] || t('chat.welcome');
  }, [replies, t]);

  function persist(nextMessages) {
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(nextMessages));
    } catch {
      console.log('Chat messages could not be saved.');
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    const nextMessages = [createMessage('user', text), createMessage('sakhi', nextReply)];
    setMessages((current) => {
      const merged = [...current, ...nextMessages];
      persist(merged);
      return merged;
    });
    setInput('');
    console.log('Shakti chat message:', text);
  }

  function clearChat() {
    const reset = [createMessage('sakhi', t('chat.welcome'))];
    setMessages(reset);
    persist(reset);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">{t('chat.title')}</h1>
          <p className="mt-3 text-base leading-7 text-shaktiText/72">{t('chat.subtitle')}</p>
        </div>

        <section className="rounded-lg border border-shaktiText/10 bg-white/80 p-4 shadow-soft sm:p-5">
          <div className="flex max-h-[58vh] min-h-[22rem] flex-col gap-3 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div key={message.id} className="flex justify-start">
                <div
                  className={[
                    'max-w-[min(100%,42rem)] rounded-2xl px-4 py-3 text-base leading-7 shadow-sm',
                    message.role === 'user'
                      ? 'bg-shaktiRose text-white'
                      : 'bg-shaktiCyan text-shaktiText',
                  ].join(' ')}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t('chat.placeholder')}
              className="min-h-12 flex-1 rounded-2xl border border-shaktiText/15 bg-shaktiCream px-4 text-shaktiText outline-none transition placeholder:text-shaktiText/45 focus:border-shaktiRose focus:ring-2 focus:ring-shaktiRose/20"
            />
            <button
              type="submit"
              className="min-h-12 rounded-2xl bg-shaktiRose px-6 font-bold text-white transition hover:bg-rose-600"
            >
              {t('actions.send')}
            </button>
          </form>

          <button
            type="button"
            onClick={clearChat}
            className="mt-4 text-xs font-semibold text-shaktiText/55 underline-offset-4 hover:text-shaktiRose hover:underline"
          >
            {t('chat.clear')}
          </button>
        </section>
      </div>
    </PageShell>
  );
}
