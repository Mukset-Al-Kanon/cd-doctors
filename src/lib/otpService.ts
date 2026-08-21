import { db } from '@/lib/db';

interface OtpEntry {
  phone: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

// In-memory high-speed OTP Store (Resilient & Instant across requests)
const memoryOtpStore = new Map<string, OtpEntry>();

export function normalizeBdPhoneNumber(rawPhone: string): string | null {
  if (!rawPhone) return null;
  
  // Remove all non-digit characters except leading +
  let cleaned = rawPhone.replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+880')) {
    cleaned = '0' + cleaned.slice(4);
  } else if (cleaned.startsWith('880')) {
    cleaned = '0' + cleaned.slice(3);
  }

  // Validate 11-digit Bangladeshi mobile numbers: 013, 014, 015, 016, 017, 018, 019
  const bdPhoneRegex = /^01[3-9]\d{8}$/;
  if (bdPhoneRegex.test(cleaned)) {
    return cleaned;
  }

  return null;
}

export async function generateAndSendOtp(phone: string): Promise<{ success: boolean; message: string; devOtp?: string }> {
  const normalizedPhone = normalizeBdPhoneNumber(phone);
  if (!normalizedPhone) {
    return {
      success: false,
      message: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)।',
    };
  }

  // Check rate limit: Allow max 1 OTP request every 45 seconds
  const existingInMemory = memoryOtpStore.get(normalizedPhone);
  if (existingInMemory && (Date.now() - existingInMemory.createdAt.getTime()) < 45 * 1000) {
    return {
      success: false,
      message: 'অনুগ্রহ করে নতুন ওটিপি অনুরোধ করার পূর্বে ৪৫ সেকেন্ড অপেক্ষা করুন।',
    };
  }

  // Generate 4-digit numeric code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity
  const createdAt = new Date();

  // Store in memory
  memoryOtpStore.set(normalizedPhone, {
    phone: normalizedPhone,
    code,
    expiresAt,
    verified: false,
    createdAt,
  });

  // Also persist to DB if model is available
  try {
    if ((db as any).otpVerification) {
      await (db as any).otpVerification.create({
        data: {
          phone: normalizedPhone,
          code,
          expiresAt,
          verified: false,
        },
      });
    }
  } catch (dbErr) {
    // Graceful fallback to memory store
  }

  // Send Real SMS via SMS.NET.BD (Alpha SMS Gateway)
  const isMockSms = process.env.MOCK_SMS_GATEWAY === 'true' || process.env.NODE_ENV === 'test';
  const smsApiKey = process.env.SMS_API_KEY;
  const smsSenderId = process.env.SMS_SENDER_ID || '';
  const smsText = `CD Doctors: আপনার ওটিপি ভেরিফিকেশন কোড হলো ${code}। মেয়াদ ৫ মিনিট।`;

  if (!isMockSms && smsApiKey && smsApiKey.trim().length > 0) {
    try {
      const recipientNumber = normalizedPhone.startsWith('880') ? normalizedPhone : '88' + normalizedPhone;

      // 1. Primary: SMS.NET.BD (Alpha SMS) API
      const params = new URLSearchParams();
      params.append('api_key', smsApiKey.trim());
      params.append('msg', smsText);
      params.append('to', recipientNumber);
      if (smsSenderId) {
        params.append('sender_id', smsSenderId);
      }

      const smsRes = await fetch('https://api.sms.net.bd/sendsms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const smsJson = await smsRes.json().catch(() => null);
      console.log(`📱 Alpha SMS (sms.net.bd) Dispatch Response [${recipientNumber}]:`, smsJson);

      if (smsJson && smsJson.error === 0) {
        console.log(`✅ SMS successfully delivered to ${recipientNumber}! Request ID: ${smsJson.data?.request_id}`);
      } else {
        console.warn(`⚠️ SMS Gateway warning:`, smsJson?.msg || 'Non-zero error');
      }
    } catch (smsErr) {
      console.error('⚠️ Error sending SMS via sms.net.bd gateway:', smsErr);
    }
  } else {
    console.log(`\n======================================================`);
    console.log(`🔔 [CD DOCTORS OTP DEV MODE]`);
    console.log(`📞 Phone: ${normalizedPhone}`);
    console.log(`🔑 OTP Code: ${code}`);
    console.log(`⏳ Valid Until: ${expiresAt.toLocaleTimeString()}`);
    console.log(`======================================================\n`);
  }

  return {
    success: true,
    message: 'আপনার মোবাইল নম্বরে ৪ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে।',
    devOtp: process.env.NODE_ENV !== 'production' ? code : undefined,
  };
}

export async function verifyOtpCode(phone: string, code: string): Promise<{ success: boolean; message: string }> {
  const normalizedPhone = normalizeBdPhoneNumber(phone);
  if (!normalizedPhone) {
    return { success: false, message: 'সঠিক মোবাইল নম্বর প্রদান করুন।' };
  }

  const cleanCode = (code || '').trim();
  if (!cleanCode || cleanCode.length !== 4) {
    return { success: false, message: 'অনুগ্রহ করে ৪ ডিজিটের সঠিক ওটিপি কোডটি লিখুন।' };
  }

  const memoryRecord = memoryOtpStore.get(normalizedPhone);

  if (memoryRecord) {
    if (memoryRecord.code !== cleanCode) {
      return { success: false, message: 'ভুল ওটিপি কোড প্রদান করা হয়েছে। অনুগ্রহ করে পুনরায় চেক করুন।' };
    }
    if (new Date() > memoryRecord.expiresAt) {
      return { success: false, message: 'এই ওটিপি কোডটির মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন কোড পাঠান।' };
    }

    memoryRecord.verified = true;
    return {
      success: true,
      message: 'মোবাইল নম্বর সফলভাবে যাচাই করা হয়েছে!',
    };
  }

  // Fallback DB check if memory not present
  try {
    if ((db as any).otpVerification) {
      const otpRecord = await (db as any).otpVerification.findFirst({
        where: {
          phone: normalizedPhone,
          code: cleanCode,
          verified: false,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (otpRecord && new Date() <= otpRecord.expiresAt) {
        await (db as any).otpVerification.update({
          where: { id: otpRecord.id },
          data: { verified: true },
        });
        return {
          success: true,
          message: 'মোবাইল নম্বর সফলভাবে যাচাই করা হয়েছে!',
        };
      }
    }
  } catch (dbErr) {
    // Ignore
  }

  return { success: false, message: 'ভুল ওটিপি কোড প্রদান করা হয়েছে। অনুগ্রহ করে পুনরায় চেক করুন।' };
}

export async function isPhoneVerified(phone: string): Promise<boolean> {
  const normalizedPhone = normalizeBdPhoneNumber(phone);
  if (!normalizedPhone) return false;

  const mem = memoryOtpStore.get(normalizedPhone);
  if (mem && mem.verified && (Date.now() - mem.createdAt.getTime()) < 15 * 60 * 1000) {
    return true;
  }

  try {
    if ((db as any).otpVerification) {
      const verifiedRecord = await (db as any).otpVerification.findFirst({
        where: {
          phone: normalizedPhone,
          verified: true,
          createdAt: {
            gte: new Date(Date.now() - 15 * 60 * 1000),
          },
        },
      });
      return !!verifiedRecord;
    }
  } catch (dbErr) {
    // Ignore
  }

  return false;
}
