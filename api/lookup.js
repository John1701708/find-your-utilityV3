// api/lookup.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { zip } = req.body || {};
    if (!zip || !/^\d{5}$/.test(zip)) {
      return res.status(400).json({ ok: false, error: 'Invalid ZIP' });
    }

    // Call Zippopotam.us (no key required)
    const url = `https://api.zippopotam.us/us/${zip}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: 'ZIP not found' });
    }

    const data = await response.json();
    const place = data.places?.[0];

    if (!place) {
      return res.json({ ok: false, error: 'No results found for this ZIP.' });
    }

    // Build a mock utility name based on state (not fake API, just label)
    const state = place['state abbreviation'];
    const city = place['place name'];
    const utility = `${state} Power & Gas Company`;

    return res.json({
      ok: true,
      utility,
      meta: `${city}, ${state}`,
    });
  } catch (err) {
    console.error('lookup error', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
