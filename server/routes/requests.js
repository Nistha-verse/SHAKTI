import express from 'express';
import { randomInt } from 'node:crypto';
import { requireSupabase } from '../services/supabase.js';

const router = express.Router();

function generatePickupCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

router.post('/requests', async (req, res, next) => {
  try {
    const { name, phone, product, pickupLocation } = req.body ?? {};

    if (product == null || typeof product !== 'string' || !product.trim()) {
      return res.status(400).json({ error: 'product is required' });
    }
    if (
      pickupLocation == null ||
      typeof pickupLocation !== 'string' ||
      !pickupLocation.trim()
    ) {
      return res.status(400).json({ error: 'pickupLocation is required' });
    }

    const pickupCode = generatePickupCode();
    const supabase = requireSupabase();

    const { error } = await supabase.from('requests').insert({
      name: name != null && String(name).trim() ? String(name).trim() : null,
      phone: phone != null && String(phone).trim() ? String(phone).trim() : null,
      product: String(product).trim(),
      pickup_location: String(pickupLocation).trim(),
      pickup_code: pickupCode,
      status: 'pending',
    });

    if (error) throw error;

    return res.status(201).json({ success: true, pickupCode });
  } catch (err) {
    next(err);
  }
});

export default router;
