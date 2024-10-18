import './ui/global.css';
import { inter, notojp , kosugi} from '../app/ui/fonts';

export const metadata = {
  title: 'cloudfun',
  description: 'CloudFun',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <head>
        </head>
        <body className={`${kosugi.className} antialiased`}>
          {children}
        </body>
      </html>
  );
}
