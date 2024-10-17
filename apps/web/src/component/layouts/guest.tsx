import React, { type ReactNode } from 'react';
import Header from '../include/header';
import Footer from '../include/footer';

interface PageProps {
  children: ReactNode;
  footer?: boolean;
}

export default function Guest({ children, footer }: PageProps): ReactNode {
  return (
    <main>
      <Header />
      {children}
      {footer ? <Footer /> : null}
    </main>
  );
}
