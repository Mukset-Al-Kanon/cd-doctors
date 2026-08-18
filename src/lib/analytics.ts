/**
 * CD Doctors AI Lightweight Analytics Event Abstraction
 * Logs anonymous usage events without recording private health queries or personal donor data.
 */

export type AnalyticsEventType =
  | 'CHAT_OPENED'
  | 'CHAT_CLOSED'
  | 'MESSAGE_SENT'
  | 'HOSPITAL_SEARCH'
  | 'DOCTOR_SEARCH'
  | 'BLOOD_SEARCH'
  | 'EMERGENCY_SEARCH'
  | 'PLATFORM_QUERY'
  | 'NO_RESULT'
  | 'ERROR';

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

export function logAnalyticsEvent(type: AnalyticsEventType, metadata?: Record<string, string | number | boolean>): void {
  const event: AnalyticsEvent = {
    type,
    timestamp: new Date().toISOString(),
    metadata,
  };

  // Safe client/server console log during development (Can be hooked to custom privacy-compliant collector later)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event] ${event.type}`, event.metadata || '');
  }
}
