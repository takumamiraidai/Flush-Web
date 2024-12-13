import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { inputStr } = await req.json();

    // External API request
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

    // Return response from the external API
    const videoUrl = await response.json();
    return NextResponse.json({ videoUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Video generation failed' }, { status: 500 });
  }
}
