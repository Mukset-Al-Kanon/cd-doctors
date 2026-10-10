import { NextResponse } from 'next/server';

// In-memory LRU cache for translations
const translationCache = new Map<string, string>();
const MAX_CACHE_SIZE = 1000;

function isBengaliText(text: string): boolean {
  const banglaChars = (text.match(/[\u0980-\u09FF]/g) || []).length;
  const totalChars = text.replace(/\s+/g, '').length;
  return totalChars > 0 && banglaChars / totalChars > 0.4;
}

// Tier 1: Gemini AI Translation for context, slang & natural colloquial Bengali
async function translateWithGemini(text: string, targetLang = 'Bengali'): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `You are an expert translator specializing in informal social media comments, healthcare communication, and internet slang.
Translate the following comment into natural, fluent colloquial ${targetLang} (বাংলা).
Rules:
- Translate slang, abbreviations (e.g. "yt", "bc", "tbh", "ngl"), and idioms into their natural equivalent meaning in everyday Bengali.
- Keep medical terms clear and respectful.
- Output ONLY the direct translated sentence with no extra explanations, no quotes, and no metadata.

Text:
"${text}"`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 250,
          },
        }),
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return candidate ? candidate.replace(/^["']|["']$/g, '').trim() : null;
  } catch (err) {
    console.error('Gemini translation error:', err);
    return null;
  }
}

// Tier 2: Free Google Translate Client fallback
async function translateWithGoogleClient(text: string, target = 'bn'): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0].map((item: any) => item[0]).join('').trim();
      return translated || null;
    }
    return null;
  } catch (err) {
    console.error('Google client translation error:', err);
    return null;
  }
}

async function handleTranslation(text: string, target = 'bn') {
  const trimmed = text.trim();
  if (!trimmed) {
    return { success: false, error: 'Text is required', status: 400 };
  }

  // Check if already Bengali
  if (target === 'bn' && isBengaliText(trimmed)) {
    return {
      success: true,
      translation: trimmed,
      isAlreadyTarget: true,
    };
  }

  // Check cache
  const cacheKey = `${target}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return {
      success: true,
      translation: translationCache.get(cacheKey)!,
      cached: true,
    };
  }

  // 1. Try Gemini AI translation first
  let translated: string | null = await translateWithGemini(trimmed, 'Bengali');

  // 2. Fallback to Google Translate Client
  if (!translated) {
    translated = await translateWithGoogleClient(trimmed, target);
  }

  if (!translated) {
    return { success: false, error: 'Translation failed', status: 500 };
  }

  // Store in cache
  if (translationCache.size >= MAX_CACHE_SIZE) {
    const firstKey = translationCache.keys().next().value;
    if (firstKey) translationCache.delete(firstKey);
  }
  translationCache.set(cacheKey, translated);

  return {
    success: true,
    translation: translated,
    original: trimmed,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text') || '';
    const target = searchParams.get('target') || 'bn';

    const result = await handleTranslation(text, target);
    if (!result.success) {
      return NextResponse.json(result, { status: result.status || 500 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Translation GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      const raw = await request.text();
      try {
        body = JSON.parse(raw);
      } catch {
        body = {};
      }
    }

    const text = body.text || '';
    const target = body.target || 'bn';

    const result = await handleTranslation(text, target);
    if (!result.success) {
      return NextResponse.json(result, { status: result.status || 500 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Translation POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
