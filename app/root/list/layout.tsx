'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
 
export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="w-full px-8">
      <h2 className="pt-10 pb-5 px-8 md:px-20  text-gray-400">Task List</h2>
      {children}
    </div>
  );
}
