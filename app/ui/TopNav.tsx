'use client';
import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import { useState, useEffect } from 'react'
import { lusitana, notojp, train} from '@/app/ui/fonts';
import LoginButton from './LoginButton';

type Props = {
  threshold: number;
}

const TopNav: React.FC<Props> = ({ threshold }) => {

  const [isSticky, setIsSticky] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      setIsSticky(currentScrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return (
      <div className={`top-navbar ${isScrolled ? 'scrolled' : ''} w-screen flex items-center justify-center md:justify-between p-5 md:px-12`} style={{ position: isSticky ? 'fixed' : 'relative', top: 0, width: 'screen', zIndex: 1000 }}>
          <Link className="hidden md:block flex" href="/root">
            <div className={`${train.className} font-extrabold text-black`}>
              <p className="text-[30px]">CloudFun2</p>
            </div>
          </Link>
          <div className="flex items-center md:justify-between space-x-2 sm:space-x-4 lg:space-x-6">
            <NavLinks />
            <LoginButton/>
          </div>
      </div>
  );
};
export default TopNav;