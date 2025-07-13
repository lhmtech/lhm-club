import fetch from 'node-fetch';
import { YoutubeTranscript } from 'youtube-transcript';
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ error: 'Missing link' });
  }

  // 1. 提取视频ID
  const match = link.match(/(?:v=|youtu\\.be\\/)([\\w-]+)/);
  const videoId = match ? match[1] : null;
  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube link' });
  }

  try {
    // 2. 获取字幕
    const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId);
    const transcript = transcriptArr.map(item => item.text).join(' ');

    // 3. 调用 Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const prompt = `请用 markdown 形式总结以下 YouTube 视频内容：\n\n${transcript}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: prompt }] }
        ]
      })
    });
    const geminiData = await geminiRes.json();
    const markdown = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '无摘要';

    // 4. 返回 markdown
    res.status(200).json({ markdown });
  } catch (err) {
    res.status(500).json({ error: '处理失败', detail: err.message });
  }
}