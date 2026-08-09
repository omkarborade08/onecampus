import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const protectedLinks = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/events', label: 'Events' },
  { to: '/lost-found', label: 'Lost & Found' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const navLinks = user ? [...publicLinks, ...protectedLinks] : publicLinks

  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF5]/80 backdrop-blur-md border-b border-[#E5E7EB]/50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-[#FF7A00]">
          OneCampus
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-[#FF7A00]'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm font-medium text-[#1F2937]">{user.name || user.email}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-[#E5E7EB] bg-white px-5 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1F2937]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-5 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1F2937]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-[#FF7A00] px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#e86f00]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-full p-2 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[#E5E7EB] bg-[#FFFBF5] px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                    location.pathname === link.to
                      ? 'bg-[#FF7A00]/10 text-[#FF7A00]'
                      : 'text-[#6B7280] hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex gap-2">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                  className="flex-1 rounded-full border border-[#E5E7EB] px-4 py-2 text-center text-sm font-medium"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-full border border-[#E5E7EB] px-4 py-2 text-center text-sm font-medium">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 rounded-full bg-[#FF7A00] px-4 py-2 text-center text-sm font-semibold text-white">
                    Sign Up
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

