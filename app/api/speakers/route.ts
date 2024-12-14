import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_VOICE_API_BASE_URL}speakers`);
    
    // レスポンスにCORSヘッダーを追加
    const jsonResponse = NextResponse.json(response.data);
    jsonResponse.headers.set('Access-Control-Allow-Origin', '*');
    jsonResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    jsonResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return jsonResponse;
  } catch (error: any) {
    console.error('Error fetching speakers:', error.message);
    
    const errorResponse = NextResponse.json({ error: 'Failed to fetch speakers' }, { status: 500 });
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return errorResponse;
  }
}

// OPTIONSメソッドに対するCORSサポート
export async function OPTIONS() {
  const response = NextResponse.json(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}
