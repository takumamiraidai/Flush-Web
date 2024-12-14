import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { text, speaker, style } = await req.json();

    if (!text || !speaker || style === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters: text, speaker, or style' },
        { status: 400 }
      );
    }

    // 音声クエリの作成
    const queryResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_VOICE_API_BASE_URL}audio_query`,
      null,
      {
        params: { text, speaker: style },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // 音声合成
    const synthesisResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_VOICE_API_BASE_URL}synthesis`,
      queryResponse.data,
      {
        params: { speaker: style, enable_interrogative_upspeak: true },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'audio/wav',
        },
        responseType: 'arraybuffer',
      }
    );

    // バイナリデータのレスポンス作成
    const audioBlob = Buffer.from(synthesisResponse.data);
    return new Response(audioBlob, {
      headers: {
        'Content-Type': 'audio/wav',
        'Access-Control-Allow-Origin': '*', // ここでCORSを許可
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  } catch (error: any) {
    console.error('Error during synthesis:', error.message);
    const response = NextResponse.json(
      { error: 'Failed to synthesize audio' },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*'); // エラーレスポンスにもCORS設定を追加
    return response;
  }
}

// OPTIONSリクエストへの対応（CORSのプリフライトリクエストを許可）
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
