'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStorage, STORAGE_KEYS } from '@/lib/storage';
import { formatWorkTime } from '@/lib/wage';
import { track } from '@/lib/analytics';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();
  const [totalMinutes, setTotalMinutes] = useState<number | null>(null);

  useEffect(() => {
    const isDone = getStorage<boolean>(STORAGE_KEYS.ONBOARDING_DONE);
    if (!isDone) {
      router.replace('/onboarding');
      return;
    }
    const minutes = getStorage<number>(STORAGE_KEYS.TOTAL_BUY_MINUTES) ?? 0;
    setTotalMinutes(minutes);
    track('home_viewed');
  }, [router]);

  function handleTranslateCta() {
    track('translate_cta_clicked');
  }

  if (totalMinutes === null) return null;

  const timeLabel = totalMinutes === 0
    ? '0시간 0분'
    : formatWorkTime(totalMinutes);

  return (
    <main className="flex flex-col min-h-screen px-6 bg-background">
      <div className="w-full max-w-sm mx-auto flex flex-col min-h-screen pt-16 pb-10">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-xl font-bold">몇시간?</h1>
          <Link
            href="/settings"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            설정
          </Link>
        </div>

        {/* 상단: 누적 추가 노동 시간 */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-sm text-muted-foreground">
            지금까지 더 일해야 하는 시간
          </p>
          <p className="text-5xl font-bold tracking-tight leading-tight">
            {timeLabel}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            더 일해야 돼요
          </p>
        </div>

        {/* 하단: CTA 버튼 */}
        <div className="flex flex-col gap-3 mt-auto">
          <Link href="/translate" onClick={handleTranslateCta}>
            <Button className="w-full h-14 text-base font-semibold">
              소비 번역하기
            </Button>
          </Link>
        </div>

      </div>
    </main>
  );
}
