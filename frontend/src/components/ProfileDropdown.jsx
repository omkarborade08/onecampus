import { useState, useRef, useEffect } from 'react'
import { ChevronDown, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full hover:bg-gray-100 px-2 py-1 transition"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7A00] text-sm font-bold text-white">
          {user.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="hidden text-sm font-medium text-[#1F2937] md:block">{user.name}</span>
        <ChevronDown className="h-4 w-4 text-[#6B7280]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl z-50">
          <div className="border-b border-[#E5E7EB] px-4 py-3">
            <p className="text-sm font-semibold text-[#1F2937] truncate">{user.name}</p>
            <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
            <p className="text-xs text-[#6B7280] truncate">{user.college}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                setOpen(false)
                navigate('/profile')
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#1F2937] hover:bg-gray-50"
            >
              <User className="h-4 w-4 text-[#6B7280]" />
              View Profile
            </button>
            <button
              onClick={() => {
                setOpen(false)
                logout()
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}