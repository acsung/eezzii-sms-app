// components/Sidebar.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: 'SMS Blaster', path: '/sms-blaster' },
    { name: 'Inbox', path: '/inbox' },
    { name: 'Contacts', path: '/contacts' },
    { name: 'Templates', path: '/templates' },
    { name: 'Scheduled', path: '/scheduled' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <>
      {/* Floating toggle button */}
      <button
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-100 p-4 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:top-auto md:left-auto md:block ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="space-y-2">
          {navItems.map(({ name, path }) => (
            <Link href={path} key={name} legacyBehavior>
              <a
                className={`block p-2 rounded hover:bg-blue-200 transition ${
                  router.pathname === path ? 'bg-blue-300 font-semibold' : ''
                }`}
              >
                {name}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
