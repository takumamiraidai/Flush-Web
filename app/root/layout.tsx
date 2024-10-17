'use client'
import Nav from '@/app/ui/nav';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ParticleBack from '@/app/ui/ParticleBack';
 
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
        <footer className='p-10 sm:p-20 footer'>
          <div className="flex flex-col items-center font-bold">
            <p className="pb-10 text-[25px] md:text-[45px]">CloudFun</p>
            <Link href={`/dashboard/buisiness`}><p className="py-2 underline-animation">特商法に基づく表記</p></Link>
            <Link href={`/dashboard/rule`}><p className="py-2 underline-animation">ご利用規約</p></Link>
            <Link href={`/dashboard/privacy`}><p className="py-2 underline-animation">プライバシーポリシー</p></Link>
            <p className="pt-10 text-">&copy; 2024 CloudFun</p>
          </div>
        </footer>
      </div>
  );
}