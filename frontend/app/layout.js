import Providers from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: 'BuildPath — Business Setup Platform',
  description:
    'BuildPath guides entrepreneurs step-by-step through business compliance, operations, and readiness with an interactive gamified roadmap.',
  keywords: ['business setup', 'compliance', 'roadmap', 'entrepreneur', 'cabinet manufacturing'],
  openGraph: {
    title: 'BuildPath — Business Setup Platform',
    description: 'Your interactive roadmap from idea to launch.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-dark-950 font-display text-slate-200 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
