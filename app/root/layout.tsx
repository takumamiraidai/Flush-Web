'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Nav from '../ui/nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/route';
  return (
      <div>
        <header>
          <Nav/>
        </header>
        <main>
            {children}
        </main>
        <footer className='footer pt-20'>
          <div className='bg-gray-100'>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-top font-bold">
                <Link href={`/root/contact`}><p className="py-2 underline-animation">問い合わせ</p></Link>
              </div>
            </div>
            <p className="px-6 text flex justify-end">&copy; 2025 Nomura</p>
          </div>
        </footer>
      </div>
  );
}