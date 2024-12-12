import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const runtime = 'edge';

interface TundereResponse {
  answer: string;
  new_relation: string;
  tun: number;
  dere: number;
  mothersound: string;
}

function convertToSound(input: string): string {
  const conversionMap: Record<string, string> = {
    'あ': 'a',
    'い': 'i',
    'う': 'u',
    'え': 'e',
    'お': 'o',
  };

  return input
    .split('')
    .map((char) => conversionMap[char] || 'n')
    .join('');
}

// 母音をペアに分割する関数
function splitIntoPairs(input: string): string[] {
    const pairs: string[] = [];
    for (let i = 0; i < input.length - 1; i++) {
      pairs.push(input.slice(i, i + 2)); // 2文字ずつスライス
    }
    return pairs;
  }

export async function POST(req: Request) {
    try {
      const { relation, input } = await req.json();
  
      if (!input) {
        throw new Error('Missing required parameters: relation or input');
      }
  
      const tundereResponse = await fetch(
        `${process.env.TUNDERE_API_BASE_URL}?relation=${encodeURIComponent(
          relation
        )}&input=${encodeURIComponent(input)}`,
        {
          method: 'GET',
          headers: {
            Authorization: process.env.AUTH_TOKEN || '',
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!tundereResponse.ok) {
        const errorText = await tundereResponse.text();
        console.error('Tundere API Error:', errorText);
        return NextResponse.json(
          { error: 'Failed to fetch response from Tundere API' },
          { status: 500 }
        );
      }
  
      const responseData: TundereResponse = await tundereResponse.json();
      const { mothersound } = responseData;
  
      if (!mothersound) {
        throw new Error('Tundere API did not return valid mothersound');
      }
  
      // 対応する動画ファイルの収集
        const videoFiles: string[] = [];
        const convertedSound = convertToSound(mothersound);

        // 2文字ペアを生成
        const soundPairs = splitIntoPairs(convertedSound);

        for (const pair of soundPairs) {
        const videoFile = `${pair}.mp4`;
        const videoFilePath = path.join(process.cwd(), 'public', 'videos', videoFile);

        // ファイルの存在確認
        if (!fs.existsSync(videoFilePath)) {
            throw new Error(`Video file not found: ${videoFile}`);
        }

        // 動画ファイルのパスを追加
        videoFiles.push(`/videos/${videoFile}`);
        }

  
      return NextResponse.json({ aiResponse: responseData.answer, vowelData: convertedSound, videoFiles });
    } catch (error: any) {
      console.error('Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
