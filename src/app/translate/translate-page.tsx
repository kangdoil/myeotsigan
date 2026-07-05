'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getStorage, setStorage, STORAGE_KEYS } from '@/lib/storage';
import { calcWorkMinutes, formatWorkTime, formatWon } from '@/lib/wage';
import { track } from '@/lib/analytics';

export function TranslatePage() {
  const router = useRouter();
  const [hourlyWage, setHourlyWage] = useState<number>(0);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [workMinutes, setWorkMinutes] = useState<number | null>(null);

  useEffect(() => {
    const isDone = getStorage<boolean>(STORAGE_KEYS.ONBOARDING_DONE);
    if (!isDone) {
      router.replace('/onboarding');
      return;
    }
    const wage = getStorage<number>(STORAGE_KEYS.HOURLY_WAGE) ?? 0;
    setHourlyWage(wage);
  }, [router]);

  // 가격 입력 시 실시간 환산 (디바운싱 300ms)
  useEffect(() => {
    const priceNum = Number(price);
    if (!price || priceNum <= 0) {
      setWorkMinutes(null);
      return;
    }
    const timer = setTimeout(() => {
      setWorkMinutes(calcWorkMinutes(priceNum, hourlyWage));
    }, 300);
    return () => clearTimeout(timer);
  }, [price, hourlyWage]);

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
      setPrice(onlyNumbers);
    },
    []
  );

  function handleReset() {
    setProductName('');
    setPrice('');
    setWorkMinutes(null);
    track('translate_reset');
  }

  function handleBuy() {
    if (workMinutes === null) return;
    const timeStr = formatWorkTime(workMinutes);

    // 살래요 누적 분 저장
    const prev = getStorage<number>(STORAGE_KEYS.TOTAL_BUY_MINUTES) ?? 0;
    setStorage(STORAGE_KEYS.TOTAL_BUY_MINUTES, prev + workMinutes);

    track('decision_buy', {
      product_name: productName,
      price_won: Number(price),
      work_minutes: workMinutes,
    });
    toast(`${timeStr}을 더 일해야 해요`, {
      description: productName ? `"${productName}" 구매를 결정했어요` : undefined,
      duration: 3000,
    });
    router.push('/');
  }

  function handleSkip() {
    if (workMinutes === null) return;
    const timeStr = formatWorkTime(workMinutes);
    track('decision_skip', {
      product_name: productName,
      price_won: Number(price),
      work_minutes: workMinutes,
    });
    toast(`${timeStr}을 지켜냈어요`, {
      description: productName ? `"${productName}" 구매를 참았어요` : undefined,
      duration: 3000,
    });
    router.push('/');
  }

  const priceNum = Number(price);
  const hasResult = workMinutes !== null && priceNum > 0;

  return (
    <main className="flex flex-col flex-1 min-h-screen px-6 bg-background">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-6 pt-14 pb-10">

        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            aria-label="뒤로 가기"
          >
            ← 뒤로
          </button>
          <h1 className="text-lg font-bold">소비 번역기</h1>
        </div>

        {/* 입력 영역 */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="product-name" className="text-sm font-medium">
              상품명
            </label>
            <Input
              id="product-name"
              type="text"
              placeholder="에어팟 프로"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="h-12 text-base"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="text-sm font-medium">
              가격
            </label>
            <div className="relative">
              <Input
                id="price"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="329000"
                value={price}
                onChange={handlePriceChange}
                className="pr-10 h-12 text-base"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                원
              </span>
            </div>
            {price !== '' && priceNum > 0 && (
              <p className="text-xs text-muted-foreground">
                {priceNum.toLocaleString('ko-KR')}원
              </p>
            )}
          </div>
        </div>

        {/* 환산 결과 */}
        <div
          className={`rounded-2xl border px-6 py-6 flex flex-col items-center gap-2 transition-all duration-300 ${
            hasResult ? 'bg-card opacity-100' : 'bg-muted/40 opacity-60'
          }`}
        >
          {hasResult ? (
            <>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                노동 시간 환산
              </p>
              <p className="text-4xl font-bold tracking-tight text-center">
                {formatWorkTime(workMinutes!)}
              </p>
              <p className="text-sm text-muted-foreground text-center">
                {productName ? `"${productName}"을(를)` : '이 상품을'} 사려면<br />
                <span className="font-medium text-foreground">
                  {formatWon(hourlyWage)}
                </span>
                으로 {formatWorkTime(workMinutes!)}을 일해야 해요
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              가격을 입력하면 환산 결과가 나와요
            </p>
          )}
        </div>

        {/* 결정 버튼 */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex gap-3">
            <Button
              onClick={handleBuy}
              disabled={!hasResult}
              className="flex-1 h-12 text-base font-semibold"
            >
              살래요
            </Button>
            <Button
              onClick={handleSkip}
              disabled={!hasResult}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
            >
              안 살래요
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={handleReset}
            className="w-full h-10 text-sm text-muted-foreground"
          >
            다시 번역하기
          </Button>
        </div>

      </div>
    </main>
  );
}
