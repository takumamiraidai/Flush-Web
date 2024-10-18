'use client'
import Nav from '@/app/ui/nav';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ParticleBack from '@/app/ui/particleBack';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/route';
  return (
      <div className='w-screen'>
        <header>
          <Nav/>
        </header>
        <main className="flex pb-40">
            <ParticleBack/>
            {children}
        </main>
        <footer className='footer pt-20 px-4 sm:pt-40 sm:px-4'>
          <div className="flex items-center justify-center">
            <p className="text-[25px] md:text-[45px] px-20">CloudFUN</p>
            <div className="flex flex-col items-top font-bold">
              <Link href={`/root/buisiness`}><p className="py-2 underline-animation">特商法に基づく表記</p></Link>
              <Link href={`/root/rule`}><p className="py-2 underline-animation">ご利用規約</p></Link>
              <Link href={`/root/privacy`}><p className="py-2 underline-animation">プライバシーポリシー</p></Link>
            </div>
          </div>
          <p className="pt-10 text flex justify-end">&copy; 2024 CLOUDFUN</p>
        </footer>
      </div>
  );
}