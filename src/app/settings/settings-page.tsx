'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getStorage, setStorage, STORAGE_KEYS } from '@/lib/storage';
import { calcHourlyWage, formatWon } from '@/lib/wage';
import { track } from '@/lib/analytics';

export function SettingsPage() {
  const router = useRouter();
  const [currentSalary, setCurrentSalary] = useState<number | null>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    const isDone = getStorage<boolean>(STORAGE_KEYS.ONBOARDING_DONE);
    if (!isDone) {
      router.replace('/onboarding');
      return;
    }
    const salary = getStorage<number>(STORAGE_KEYS.SALARY);
    setCurrentSalary(salary);
    if (salary) setValue(String(salary));
  }, [router]);

  const numericValue = Number(value);
  const isValid = value !== '' && numericValue > 0 && numericValue <= 100000;
  const isChanged = numericValue !== currentSalary;
  const previewWage = isValid ? calcHourlyWage(numericValue) : null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
    setValue(onlyNumbers);
  }

  function handleSave(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isValid || !isChanged) return;

    const newWage = calcHourlyWage(numericValue);
    setStorage(STORAGE_KEYS.SALARY, numericValue);
    setStorage(STORAGE_KEYS.HOURLY_WAGE, newWage);
    setCurrentSalary(numericValue);

    track('settings_salary_updated', {
      salary_manwon: numericValue,
      hourly_wage: newWage,
    });

    toast('시급이 업데이트됐어요', {
      description: `${formatWon(newWage)} / 시간`,
      duration: 2500,
    });
  }

  if (currentSalary === null) return null;

  return (
    <main className="flex flex-col flex-1 min-h-screen px-6 bg-background">
      <div className="w-full max-w-sm mx-auto flex flex-col gap-8 pt-14 pb-10">

        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            aria-label="뒤로 가기"
          >
            ← 뒤로
          </button>
          <h1 className="text-lg font-bold">설정</h1>
        </div>

        {/* 연봉 수정 폼 */}
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="salary" className="text-sm font-medium">
              연봉 수정
            </label>
            <div className="relative">
              <Input
                id="salary"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="3500"
                value={value}
                onChange={handleChange}
                className="pr-14 h-12 text-base"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                만 원
              </span>
            </div>

            {/* 미리보기 */}
            <div className="min-h-[20px]">
              {value !== '' && !isValid && (
                <p className="text-xs text-destructive">
                  올바른 연봉을 입력해주세요 (1 ~ 100,000만 원)
                </p>
              )}
              {isValid && isChanged && previewWage && (
                <p className="text-xs text-muted-foreground">
                  변경 후 시급:{' '}
                  <span className="font-medium text-foreground">
                    {formatWon(previewWage)}
                  </span>
                </p>
              )}
              {isValid && !isChanged && (
                <p className="text-xs text-muted-foreground">
                  현재 연봉과 같아요
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isValid || !isChanged}
            className="w-full h-12 text-base font-semibold"
          >
            저장하기
          </Button>
        </form>

      </div>
    </main>
  );
}
