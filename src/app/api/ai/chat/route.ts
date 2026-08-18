import { NextResponse } from 'next/server';
import { processAiMessage } from '@/lib/aiService';

// In-memory sliding window rate limiter (Max 50 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 50;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count++;
  if (record.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: 'সাময়িক অনুরোধের সংখ্যা অতিরিক্ত বেশি। অনুগ্রহ করে ১ মিনিট পর আবার চেষ্টা করুন।',
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          success: false,
          message: 'একটি বৈধ তথ্য প্রদান করুন (Invalid request body).',
        },
        { status: 400 }
      );
    }

    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    const conversationId = typeof body.conversationId === 'string' ? body.conversationId : undefined;

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: 'অনুরোধে কোনো বার্তা পাওয়া যায়নি (Empty message).',
        },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: 'বার্তাটি অতিরিক্ত দীর্ঘ। অনুগ্রহ করে ১০০০ অক্ষরের মধ্যে বার্তাটি প্রদান করুন।',
        },
        { status: 400 }
      );
    }

    const result = await processAiMessage({
      message,
      history,
      conversationId,
    });

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('API Error in /api/ai/chat:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'দুঃখিত, সাময়িক যান্ত্রিক ত্রুটির কারণে বার্তাটি প্রক্রিয়া করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
      },
      { status: 500 }
    );
  }
}
