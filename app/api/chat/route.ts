import { NextResponse } from 'next/server';

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

    console.log('Tundere API Request:', { relation, input });

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
    console.log('Tundere API Response:', responseData);

    const { mothersound } = responseData;

    if (!mothersound || typeof mothersound !== 'string') {
      console.error('Invalid mothersound in Tundere API response:', responseData);
      return NextResponse.json(
        { error: 'Tundere API did not return valid mothersound' },
        { status: 500 }
      );
    }

    const sound = convertToSound(mothersound);

    return NextResponse.json({
      aiResponse: responseData.answer,
      motherSound: sound,
    });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

