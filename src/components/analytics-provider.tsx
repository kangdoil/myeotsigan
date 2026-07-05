'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';

// 앱 최초 마운트 시 Mixpanel 초기화
export function AnalyticsProvider() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return null;
}
