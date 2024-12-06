'use client'
import TopNav from './TopNav';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react'

function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/root';
  const [isSticky, setIsSticky] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY >300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      setIsSticky(currentScrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <TopNav threshold={1000}/>
    </div>
  );
}
export default Nav;