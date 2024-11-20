import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { type ReactElement } from 'react';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@/context/user-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sound cloud helper',
  description: 'Increase your followers in sound cloud.',
  icons: {
    icon: '/souldCloudlogo.ico',
    shortcut: '/souldCloudlogo.ico',
    apple: '/souldCloudlogo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-center" />
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
