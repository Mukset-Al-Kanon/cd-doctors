import { NextResponse } from 'next/server';
import { processAiMessage } from '@/lib/aiService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory sliding window rate limiter (Max 60 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 60;
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

    // 1. Forward directly to active n8n AI Agent Webhook (with 35s timeout)
    const n8nWebhookUrl =
      process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
      'https://persevere-tripping-plywood.ngrok-free.dev/webhook/website';

    if (n8nWebhookUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 35000); // 35 sec timeout for AI Tool + LLM generation

        const n8nRes = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({
            message,
            sessionId: conversationId || 'website-user-session',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (n8nRes.ok) {
          const rawText = await n8nRes.text();
          let botReply = '';

          try {
            const data = JSON.parse(rawText);
            if (typeof data === 'string') {
              botReply = data;
            } else if (data) {
              botReply =
                data.output ||
                data.reply ||
                data.message ||
                data.text ||
                data.response ||
                (Array.isArray(data) && (data[0]?.output || data[0]?.reply || data[0]?.message || data[0]?.text)) ||
                '';
            }
          } catch {
            // If raw text returned
            botReply = rawText.trim();
          }

          if (botReply && botReply.length > 2) {
            return NextResponse.json({
              success: true,
              message: botReply,
              output: botReply,
              conversationId: conversationId || `conv-${Date.now()}`,
              suggestedSpecialty: null,
              hospitals: [],
              doctors: [],
              bloodDonors: [],
              emergencyServices: [],
            });
          }
        }
      } catch (n8nError) {
        console.warn('n8n Webhook call failed, falling back to internal AI:', n8nError);
      }
    }

    // 2. Fallback to built-in AI processor if n8n is unreachable
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
