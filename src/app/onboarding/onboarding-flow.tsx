'use client';

import { useRouter } from 'next/navigation';
import { SalaryInputStep } from './salary-input-step';
import { calcHourlyWage } from '@/lib/wage';
import { setStorage, STORAGE_KEYS } from '@/lib/storage';
import { track } from '@/lib/analytics';

export function OnboardingFlow() {
  const router = useRouter();

  function handleSalarySubmit(value: string) {
    const salary = Number(value);
    const hourlyWage = calcHourlyWage(salary);

    setStorage(STORAGE_KEYS.SALARY, salary);
    setStorage(STORAGE_KEYS.HOURLY_WAGE, hourlyWage);
    setStorage(STORAGE_KEYS.ONBOARDING_DONE, true);

    track('onboarding_salary_input', { salary_manwon: salary });
    track('onboarding_completed', { salary_manwon: salary, hourly_wage: hourlyWage });

    router.push('/');
  }

  return <SalaryInputStep onSubmit={handleSalarySubmit} />;
}
