import './ui/global.css';
import { inter, notojp , kosugi} from '../app/ui/fonts';
import Nav from '../app/ui/nav';
import Link from 'next/link';

export const metadata = {
  title: 'flush',
  description: 'Flush',
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
          <div className='w-screen'>
            <header>
              <div className={`top-navbar flex items-center justify-center md:justify-between p-5 md:px-12`}>
                  <div className="flex md:justify-between space-x-2 sm:space-x-4 lg:space-x-6">
                    <Nav/>
                  </div>
              </div>
            </header>
            <main className="flex flex-col items-center pt-40 sm:pt-80">
                {children}
            </main>
            <footer className='p-10'>
              <div className="flex flex-col items-center font-bold">
                <p className="text-[15px] md:text-[25px]">Produced by</p>
                <p className="text-[20px] md:text-[35px]">CrystalGeyser</p>
                <p className="pt-10 text-[12px] md:text-[18px]">&copy; 2024 Flush</p>
              </div>
            </footer>
          </div>
        </body>
      </html>
  );
}
