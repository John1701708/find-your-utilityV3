// api/lookup.js
export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { zip } = req.body || {};
    if (!zip || !/^\d{5}$/.test(zip))
      return res.status(400).json({ ok: false, error: 'Invalid ZIP' });

    const url = `https://api.zippopotam.us/us/${zip}`;
    const r = await fetch(url);
    if (!r.ok) {
      return res.status(r.status).json({ ok: false, error: 'No data for this ZIP' });
    }

    const data = await r.json();
    const place = data.places?.[0];
    const city = place?.['place name'] || 'Unknown city';
    const state = place?.state || 'Unknown state';

    const utility = `${city}, ${state}`;
    return res.json({ ok: true, utility, meta: 'Data via Zippopotam.us' });
  } catch (err) {
    console.error('lookup error', err);
    return res.status(500).json({ ok: false, error: 'lookup_failed' });
  }
}
