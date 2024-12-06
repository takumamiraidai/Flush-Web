'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: '献立表', href: '/root'},
  { name: '材料', href: '/root/ingredient',},
  { name: '料理', href: '/root/dish',},
  { name: '発注書', href: '/root/list',},
  { name: '仕入れ変更', href: '/root/profile',},
  { name: '出力', href: '/root/post',},
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
                  'text-sky-300 hover:text-sky-400': pathname === link.href,
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