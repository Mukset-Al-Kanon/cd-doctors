import dns from 'dns';

// Popular verified mail provider domains (Instant pass without DNS lookup)
const TRUSTED_PROVIDER_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'ymail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'protonmail.com',
  'proton.me',
  'zoho.com',
  'aol.com',
  'mail.com',
  'gmx.com',
  'yandex.com',
]);

// Common domain typos with suggestions
const COMMON_TYPOS: Record<string, string> = {
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gamil.co': 'gmail.com',
  'gmail.co': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yaho.co': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
};

// Known disposable / temporary fake email service domains
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  'tempmail.com',
  'temp-mail.org',
  'temp-mail.io',
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'sharklasers.com',
  'grr.la',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'trashmail.com',
  'trashmail.net',
  'dispostable.com',
  'getnada.com',
  'abcvg.com',
  'burnermail.io',
  'crazymailing.com',
  'fakeinbox.com',
  'generator.email',
  'inboxkitten.com',
  'maildrop.cc',
  'mailcatch.com',
  'mohmal.com',
  'mytemp.email',
  'nada.ltd',
  'throwawaymail.com',
  'emailondeck.com',
  'fakemailgenerator.com',
  'fakemail.net',
  'mailnesia.com',
  'tempail.com',
  'tempinbox.com',
  'mytempmail.com',
  'minuteinbox.com',
  'disposablemail.com',
  'burnermail.com',
  'mailpoof.com',
  'dropmail.me',
  'moakt.com',
]);

// Strict RFC-compliant email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export interface EmailValidationResult {
  isValid: boolean;
  normalizedEmail: string;
  error?: string;
  suggestion?: string;
}

/**
 * Validates whether an email address is syntactically valid, not disposable/fake,
 * has no obvious typos, and has active MX DNS mail servers.
 */
export async function validateEmailAddress(rawEmail: string): Promise<EmailValidationResult> {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return { isValid: false, normalizedEmail: '', error: 'ইমেইল অ্যাড্রেস প্রদান করুন।' };
  }

  const email = rawEmail.trim().toLowerCase();

  // 1. Basic length checks
  if (email.length < 5 || email.length > 254) {
    return { isValid: false, normalizedEmail: email, error: 'ইমেইল অ্যাড্রেসের দৈর্ঘ্য সঠিক নয়।' };
  }

  // 2. Syntax format check
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, normalizedEmail: email, error: 'ইমেইল অ্যাড্রেসটির ফরম্যাট সঠিক নয় (যেমন: example@gmail.com)।' };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return { isValid: false, normalizedEmail: email, error: 'সঠিক ইমেইল অ্যাড্রেস লিখুন।' };
  }

  const [username, domain] = parts;

  if (!username || username.length > 64) {
    return { isValid: false, normalizedEmail: email, error: 'ইমেইলের ইউজারনেম সঠিক নয়।' };
  }

  // 3. Check for common domain typos
  if (COMMON_TYPOS[domain]) {
    const suggestedDomain = COMMON_TYPOS[domain];
    const suggestion = `${username}@${suggestedDomain}`;
    return {
      isValid: false,
      normalizedEmail: email,
      suggestion,
      error: `বানান ভুল হতে পারে। আপনি কি "${suggestion}" বুঝিয়েছেন?`,
    };
  }

  // 4. Block disposable / temporary fake email services
  if (DISPOSABLE_DOMAINS.has(domain) || domain.includes('tempmail') || domain.includes('disposable') || domain.includes('10minute')) {
    return {
      isValid: false,
      normalizedEmail: email,
      error: 'অস্থায়ী বা ফেক (Disposable/Temp) ইমেইল দিয়ে অ্যাকাউন্ট তৈরি করা যাবে না। অনুগ্রহ করে আসল জিমেইল বা ইমেইল ব্যবহার করুন।',
    };
  }

  // 5. TLD validation (must be at least 2 characters)
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) {
    return { isValid: false, normalizedEmail: email, error: 'ইমেইলের ডোমেইন এক্সটেনশন সঠিক নয়।' };
  }

  // 6. Fast pass for trusted well-known providers
  if (TRUSTED_PROVIDER_DOMAINS.has(domain)) {
    return { isValid: true, normalizedEmail: email };
  }

  // 7. Real-time DNS MX Record Lookup for custom domains
  try {
    const mxRecords = await new Promise<dns.MxRecord[]>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('DNS Timeout')), 2500);
      dns.resolveMx(domain, (err, addresses) => {
        clearTimeout(timer);
        if (err) return reject(err);
        resolve(addresses || []);
      });
    });

    if (!mxRecords || mxRecords.length === 0) {
      return {
        isValid: false,
        normalizedEmail: email,
        error: `"${domain}" ডোমেইনে কোনো বৈধ মেইল সার্ভার (MX Record) পাওয়া যায়নি। একটি সক্রিয় আসল ইমেইল ব্যবহার করুন।`,
      };
    }

    return { isValid: true, normalizedEmail: email };
  } catch (err: any) {
    // If domain has no MX record or doesn't exist
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA' || err.code === 'SERVFAIL') {
      return {
        isValid: false,
        normalizedEmail: email,
        error: `"${domain}" ডোমেনটি ইন্টারনেটে পাওয়া যায়নি বা এর কোনো সক্রিয় ইমেইল সেবা নেই।`,
      };
    }

    // On network/timeout, pass conservatively if syntax is valid
    return { isValid: true, normalizedEmail: email };
  }
}
