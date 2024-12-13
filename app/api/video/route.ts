// pages/api/generateVideo.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { inputStr } = req.body;
      
      // 外部 API にリクエスト
      const response = await fetch('https://rage-tell-leather-walker.trycloudflare.com/merge_videos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_str: inputStr }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      // レスポンスを返す
      const videoUrl = await response.json();
      res.status(200).json({ videoUrl: videoUrl });
    } catch (error) {
      res.status(500).json({ error: 'Video generation failed' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
