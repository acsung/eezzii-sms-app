import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Toggle Button */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ position: 'fixed', top: 20, left: 20, zIndex: 10 }}>
        📋 Menu
      </button>

      {/* Sidebar Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 250,
          height: '100%',
          background: '#f4f4f4',
          padding: 20,
          boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
          zIndex: 9
        }}>
          <h3>📁 Navigation</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <button 
                onClick={() => router.push('/')} 
                style={{ background: 'none', border: 'none', padding: 10 }}>
                📤 SMS Blaster
              </button>
            </li>
            <li>
              <button 
                onClick={() => router.push('/inbox')} 
                style={{ background: 'none', border: 'none', padding: 10 }}>
                📨 Inbox
              </button>
            </li>
            <li>
              <button 
                onClick={() => router.push('/templates')} 
                style={{ background: 'none', border: 'none', padding: 10 }}>
                📋 Templates
              </button>
            </li>
            <li>
              <button 
                onClick={() => router.push('/scheduled')} 
                style={{ background: 'none', border: 'none', padding: 10 }}>
                🕒 Scheduled
              </button>
            </li>
            <li>
              <button 
                onClick={() => router.push('/settings')} 
                style={{ background: 'none', border: 'none', padding: 10 }}>
                ⚙️ Settings
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Page Content */}
      <div style={{ marginLeft: menuOpen ? 270 : 20, padding: 20 }}>
        {children}
      </div>
    </div>
  )
}
