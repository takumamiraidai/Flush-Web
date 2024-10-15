'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Home', href: '/root'},
  { name: 'List', href: '/root/list',},
  { name: 'Post', href: '/root/post',},
  { name: 'Profile', href: '/root/profile',},
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
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
    </>
  );
}