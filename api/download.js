export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ error: 'A valid video link is required.' });
  }

  const RAPIDAPI_HOST = 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com';
  const RAPIDAPI_ENDPOINT = '/rich_response/index';
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

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

    return res.status(200).json({
      videoUrl: data.video_url || data.download_url || data.data?.play || null,
      title: data.title || data.data?.title || '',
      thumbnail: data.thumbnail || data.data?.cover || '',
      raw: data,
    });

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong reaching the provider.' });
  }
}
