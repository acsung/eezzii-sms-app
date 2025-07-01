import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow md:hidden">
        <button
          onClick={toggleSidebar}
          className="text-gray-700 focus:outline-none"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-lg font-semibold">EEZZZII</span>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-black bg-opacity-50`} onClick={toggleSidebar}></div>
      <div className={`fixed z-50 top-0 left-0 h-full w-64 bg-white shadow transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <nav className="flex flex-col h-full p-4 space-y-4">
          <Link href="/" className="text-blue-600 hover:underline" onClick={() => setSidebarOpen(false)}>SMS Blaster</Link>
          <Link href="/inbox" className="text-blue-600 hover:underline" onClick={() => setSidebarOpen(false)}>Inbox</Link>
          <Link href="/contacts" className="text-blue-600 hover:underline" onClick={() => setSidebarOpen(false)}>Contacts</Link>
          <Link href="/templates" className="text-blue-600 hover:underline" onClick={() => setSidebarOpen(false)}>Templates</Link>
          <Link href="/scheduled" className="text-blue-600 hover:underline" onClick={() => setSidebarOpen(false)}>Scheduled</Link>
          <Link href="/settings" className="text-blue-600 hover:underline" onClick={() => setSidebarOpen(false)}>Settings</Link>
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-4 md:ml-64">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
