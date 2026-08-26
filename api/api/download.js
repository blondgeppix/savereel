// api/download.js
// Serverless function (works on Vercel as-is). Keeps your RapidAPI key
// hidden from the browser — the frontend calls THIS endpoint, never RapidAPI directly.

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'A valid video link is required.' });
  }

  // --- CONFIGURE THESE THREE VALUES AFTER YOU SUBSCRIBE ON RAPIDAPI ---
  // You'll find them in the "Code Snippets" tab of the API you picked,
  // under the JavaScript / fetch example.
  const RAPIDAPI_HOST = 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com';
  const RAPIDAPI_ENDPOINT = '/rich_response/index';
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;  // set this in your hosting provider's environment variables, never hardcode it here
  // ---------------------------------------------------------------------

  if (!RAPIDAPI_KEY) {
    return res.status(500).json({ error: 'Server is missing RAPIDAPI_KEY configuration.' });
  }

  try {
    const apiUrl = `https://${RAPIDAPI_HOST}${RAPIDAPI_ENDPOINT}?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'The download provider returned an error.' });
    }

    const data = await response.json();

    // NOTE: every RapidAPI provider names its fields differently.
    // Log `data` once during testing and adjust the fields below to match
    // whichever provider you subscribed to.
    return res.status(200).json({
      videoUrl: data.video_url || data.download_url || data.data?.play || null,
      title: data.title || data.data?.title || '',
      thumbnail: data.thumbnail || data.data?.cover || '',
      raw: data, // remove this once you've confirmed the correct field names
    });

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong reaching the provider.' });
  }
}
