import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { name: "SMS Blaster", href: "/" },
  { name: "Inbox", href: "/inbox" },
  { name: "Contacts", href: "/contacts" },
  { name: "Templates", href: "/templates" },
  { name: "Scheduled", href: "/scheduled" },
  { name: "Settings", href: "/settings" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-100 p-4 border-r fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-56" : "-translate-x-full w-0"} md:translate-x-0 md:relative md:w-56`}
      >
        <div className="hidden md:block font-bold text-xl mb-4">EEZZII</div>
        <div className="md:hidden flex justify-between items-center mb-4">
          <div className="font-bold text-xl">EEZZII</div>
          <button onClick={() => setIsOpen(false)} className="text-2xl font-bold">×</button>
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} legacyBehavior>
              <a
                className={`cursor-pointer px-3 py-2 rounded hover:bg-green-200 transition-colors duration-200 text-sm md:text-base block
                ${router.pathname === item.href ? "bg-green-300 font-semibold" : ""}`}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </nav>
      </div>

      {/* Top bar */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center p-2 bg-gray-100 md:hidden">
          <button
            className="text-2xl font-bold px-3 py-2 rounded bg-gray-300"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>
          <div className="ml-4 font-bold text-lg">EEZZII</div>
        </div>
        <main className="p-4 overflow-y-auto flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
