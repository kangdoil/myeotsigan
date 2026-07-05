import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { AnalyticsProvider } from '@/components/analytics-provider';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '몇시간? — 소비를 노동 시간으로 번역해드려요',
  description:
    '갖고 싶은 물건의 가격을 내 시급으로 환산해 소비의 기회비용을 직관적으로 확인하세요.',
  openGraph: {
    title: '몇시간?',
    description: '소비를 노동 시간으로 번역해드려요',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AnalyticsProvider />
        {children}
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
