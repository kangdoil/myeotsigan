'use client';

import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '';
let initialized = false;

export function initAnalytics() {
  if (initialized || !MIXPANEL_TOKEN) return;
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage',
  });
  initialized = true;
}

type EventName =
  | 'onboarding_salary_input'
  | 'onboarding_completed'
  | 'home_viewed'
  | 'translate_cta_clicked'
  | 'translate_completed'
  | 'decision_buy'
  | 'decision_skip'
  | 'translate_reset'
  | 'settings_salary_updated';

export function track(event: EventName, props?: Record<string, unknown>) {
  if (!initialized) return;
  mixpanel.track(event, props);
}
