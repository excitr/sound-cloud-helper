import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { type ReactElement } from 'react';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sound cloud helper',
  description: 'Increase your followers in sound cloud.',
  icons: {
    icon: '/souldCloudlogo.ico', // path relative to the `public` folder
    shortcut: '/souldCloudlogo.ico',
    apple: '/souldCloudlogo.png', // for Apple touch icons
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ColorSchemeScript />
        <Toaster position="top-center" />
        <MantineProvider defaultColorScheme="auto">{children}</MantineProvider>
      </body>
    </html>
  );
}
