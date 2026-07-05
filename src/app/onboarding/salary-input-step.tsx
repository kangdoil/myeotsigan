'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SalaryInputStepProps {
  onSubmit: (value: string) => void;
}

export function SalaryInputStep({ onSubmit }: SalaryInputStepProps) {
  const [value, setValue] = useState('');

  const numericValue = Number(value);
  const isValid = value !== '' && numericValue > 0 && numericValue <= 100000;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
    setValue(onlyNumbers);
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(value);
  }

  return (
    <main className="flex flex-col flex-1 items-center justify-center min-h-screen px-6 bg-background">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">몇시간?</p>
          <h1 className="text-2xl font-bold tracking-tight leading-snug">
            연봉을 알려주시면<br />시급을 계산해드려요
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            세전 연봉 기준으로 입력해주세요. 나중에 수정할 수 있어요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="salary" className="text-sm font-medium">
              연봉
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
                className="pr-14 text-lg h-12"
                autoFocus
                aria-label="세전 연봉 입력 (단위: 만 원)"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                만 원
              </span>
            </div>

            <div className="min-h-[20px]">
              {value !== '' && !isValid && (
                <p className="text-xs text-destructive">
                  올바른 연봉을 입력해주세요 (1 ~ 100,000만 원)
                </p>
              )}
              {isValid && (
                <p className="text-xs text-muted-foreground">
                  {numericValue.toLocaleString('ko-KR')}만 원
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            className="w-full h-12 text-base font-semibold"
          >
            시작하기
          </Button>
        </form>
      </div>
    </main>
  );
}
