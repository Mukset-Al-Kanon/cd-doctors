import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function cleanTextForSpeech(input: string): string {
  return input
    .replace(/^মো[ঃ:]\s*/i, 'মোহাম্মদ ')
    .replace(/^মো\.\s*/i, 'মোহাম্মদ ')
    .replace(/^মোঃ\s*/i, 'মোহাম্মদ ')
    .replace(/\s+মো[ঃ:]\s*/i, ' মোহাম্মদ ')
    .replace(/\s+মো\.\s*/i, ' মোহাম্মদ ')
    .replace(/\s+মোঃ\s*/i, ' মোহাম্মদ ')
    .replace(/^মুহা[ঃ:]\s*/i, 'মুহাম্মদ ')
    .replace(/^মুহা\.\s*/i, 'মুহাম্মদ ')
    .replace(/^মুহাম্মদ\s*/i, 'মুহাম্মদ ')
    .replace(/^ডা[ঃ:]\s*/i, 'ডাক্তার ')
    .replace(/^ডা\.\s*/i, 'ডাক্তার ')
    .trim();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawText = searchParams.get('text') || '';
  
  if (!rawText.trim()) {
    return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
  }

  const cleanText = cleanTextForSpeech(rawText.trim());

  // Generate high-fidelity Bengali audio stream
  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/',
      },
    });

    if (response.ok) {
      const audioData = await response.arrayBuffer();
      return new NextResponse(audioData, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
  } catch (err) {
    console.error('TTS Audio Error:', err);
  }

  return NextResponse.json({ error: 'Failed to generate voice audio' }, { status: 500 });
}
