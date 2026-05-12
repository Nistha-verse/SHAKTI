import express from 'express';
import { requireSupabase } from '../services/supabase.js';

const router = express.Router();

const ALLOWED_TYPES = new Set(['pads', 'clinic', 'camp']);

router.get('/locations', async (req, res, next) => {
  try {
    const supabase = requireSupabase();
    const typeParam =
      typeof req.query.type === 'string' ? req.query.type.trim().toLowerCase() : '';

    let q = supabase
      .from('locations')
      .select('id, name, address, lat, lng, type, timings, verified')
      .order('id', { ascending: true });

    if (typeParam) {
      if (!ALLOWED_TYPES.has(typeParam)) {
        return res.status(400).json({
          error: 'Invalid type. Use pads, clinic, or camp.',
        });
      }
      q = q.eq('type', typeParam);
    }

    const { data, error } = await q;
    if (error) throw error;

    return res.json(data ?? []);
  } catch (err) {
    next(err);
  }
});

export default router;
