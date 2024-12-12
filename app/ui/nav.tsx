'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Home', href: '/',},
  { name: 'Post', href: '/post',}
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <div className={`top-navbar flex items-center justify-center md:justify-between p-5 md:px-12`}>
        <div className="flex md:justify-between space-x-2 sm:space-x-4 lg:space-x-6">
          {links.map((link) => {
            return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx("font-extrabold text-sm sm:text-base lg:text-xl",
                    {
                      'text-indigo-600 hover:text-indigo-700': pathname === link.href,
                    },
                  )}
                >
                  <p className="underline-animation">{link.name}</p>
                </Link>
            );
          })}
        </div>
    </div>
);
}
