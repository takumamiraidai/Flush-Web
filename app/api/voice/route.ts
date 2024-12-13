// src/app/api/synthesize/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const VOICE_API_BASE_URL = 'http://10.124.57.95:50021';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accentPhrases, speedScale, pitchScale, intonationScale, volumeScale, prePhonemeLength, postPhonemeLength, outputSamplingRate, outputStereo, kana } = body;

    // APIへのリクエスト
    const response = await fetch(`${VOICE_API_BASE_URL}/synthesis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accentPhrases,
        speedScale,
        pitchScale,
        intonationScale,
        volumeScale,
        prePhonemeLength,
        postPhonemeLength,
        outputSamplingRate,
        outputStereo,
        kana,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
