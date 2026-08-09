import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ChevronDown, User, LogOut, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { chatApi } from '../services/chat'
import NotificationDropdown from './NotificationDropdown'
import ProfileDropdown from './ProfileDropdown'

export default function TopNavbar({ onToggleSidebar }) {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const notificationRef = useRef(null)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="rounded-full p-2 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-[#6B7280]" />
          </button>
          <Link to="/" className="text-2xl font-bold text-[#FF7A00]">
            OneCampus
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <NotificationDropdownWrapper onOpenChat={(conversation) => {
            window.location.href = `/chat?conversation=${conversation.id}`
          }} />

          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}

function NotificationDropdownWrapper({ onOpenChat }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)

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
        className="relative rounded-full p-2 hover:bg-gray-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-[#6B7280]" />
        <NotificationBadge refreshKey={refreshKey} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl z-50">
          <NotificationContent onConversationClick={(conv) => {
            setOpen(false)
            setRefreshKey((k) => k + 1)
            onOpenChat(conv)
          }} />
        </div>
      )}
    </div>
  )
}

function NotificationBadge({ refreshKey }) {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    let cancelled = false
    setLoading(true)

    const fetchCount = async () => {
      try {
        const data = await chatApi.getUnreadCount()
        if (!cancelled) setCount(data?.count || 0)
      } catch {
        if (!cancelled) setCount(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCount()
    const interval = setInterval(fetchCount, 3000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [user, refreshKey])

  if (loading || count === 0) return null

  return (
    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF7A00] text-[10px] font-bold text-white">
      {count > 9 ? '9+' : count}
    </span>
  )
}

function NotificationContent({ onConversationClick }) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    chatApi.getConversations()
      .then((data) => {
        setConversations(data || [])
      })
      .catch((err) => {
        console.error('Failed to load notifications', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const unreadConversations = conversations.filter((c) => (c.unread || 0) > 0)

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
        <h3 className="font-semibold text-[#1F2937]">Notifications</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-sm text-[#6B7280]">Loading...</div>
        ) : unreadConversations.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#6B7280]">
            <Bell className="mx-auto h-8 w-8 text-gray-300 mb-2" />
            <p>No new notifications</p>
          </div>
        ) : (
          unreadConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={async () => {
                await chatApi.markAsRead(conv.id)
                onConversationClick(conv)
              }}
              className="flex w-full items-start gap-3 border-b border-[#E5E7EB] p-3 text-left hover:bg-gray-50 transition"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF7A00]/10 text-sm font-bold text-[#FF7A00]">
                {conv.otherUserName?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1F2937] truncate">{conv.otherUserName}</span>
                  <span className="text-xs text-[#6B7280] shrink-0 ml-2">{conv.time}</span>
                </div>
                <p className="text-xs text-[#6B7280] truncate">{conv.lastMessage || 'New message'}</p>
              </div>
              {(conv.unread || 0) > 0 && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF7A00] text-[10px] font-bold text-white">
                  {conv.unread}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </>
  )
}
