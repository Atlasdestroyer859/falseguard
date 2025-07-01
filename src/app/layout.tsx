
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar'; 
import ClientSideInitializer from '@/components/client-side-initializer';
import { ThemeProvider } from '@/components/theme-provider';
import CookieConsentBanner from '@/components/cookie-consent-banner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FalseGuard',
  description: 'AI-powered fake news detection and analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientSideInitializer>
            <SidebarProvider>
              <div className="flex flex-col min-h-screen w-full">
                {children}
              </div>
              <Toaster />
              <CookieConsentBanner />
            </SidebarProvider>
          </ClientSideInitializer>
        </ThemeProvider>
      </body>
    </html>
  );
}
