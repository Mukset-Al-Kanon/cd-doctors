import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const VERIFY_TOKEN = 'cddoctors_fb_secret_2026';

// 1. Meta Webhook Verification (GET request from Meta)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Meta Facebook Webhook Verified Successfully!');
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return new Response('Forbidden: Verification token mismatch', { status: 403 });
}

// 2. Incoming Facebook Messenger Messages (POST request from Meta)
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (body?.object === 'page') {
      for (const entry of body.entry || []) {
        for (const event of entry.messaging || []) {
          const senderId = event.sender?.id;
          const userMessage = event.message?.text;

          // Ignore echo messages or messages without text
          if (!senderId || !userMessage || event.message?.is_echo) continue;

          console.log(`📩 Received Facebook Messenger message from ${senderId}: "${userMessage}"`);

          // Forward to n8n AI Agent Webhook
          const n8nWebhookUrl =
            process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
            'https://persevere-tripping-plywood.ngrok-free.dev/webhook/website';

          let botReply = '';

          try {
            const n8nRes = await fetch(n8nWebhookUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
              },
              body: JSON.stringify({
                message: userMessage,
                sessionId: `fb-${senderId}`,
              }),
            });

            if (n8nRes.ok) {
              const data = await n8nRes.json().catch(() => null);
              botReply =
                data?.output ||
                data?.reply ||
                data?.message ||
                (typeof data === 'string' ? data : '');
            }
          } catch (n8nErr) {
            console.error('Error querying n8n from FB webhook:', n8nErr);
          }

          // Fallback if n8n empty
          if (!botReply) {
            botReply = 'আসসালামু আলাইকুম। CD Doctors-এ আপনাকে স্বাগতম। আপনি কোন বিষয়ে ডাক্তারের তথ্য খুঁজছেন তা উল্লেখ করুন।';
          }

          // Send message back to patient on Facebook Messenger via Graph API
          const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
          if (pageAccessToken) {
            await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${pageAccessToken}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient: { id: senderId },
                message: { text: botReply },
              }),
            });
            console.log(`📤 Reply sent to FB Messenger user ${senderId}`);
          }
        }
      }

      return new Response('EVENT_RECEIVED', { status: 200 });
    }

    return new Response('Not Found', { status: 404 });
  } catch (error: any) {
    console.error('Error handling Facebook webhook POST:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
