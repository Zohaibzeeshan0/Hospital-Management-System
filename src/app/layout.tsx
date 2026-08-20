import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediPulse — Modern Hospital Management System',
  description: 'Enterprise full-stack Hospital Management System featuring Admin, Doctor, and Patient portals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
