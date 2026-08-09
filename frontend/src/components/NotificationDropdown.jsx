import { Bell, X } from 'lucide-react'
import { chatApi } from '../services/chat'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'

export default function NotificationDropdown({ onOpenChat }) {
  const [open, setOpen] = useState(false)
  const [conversations, setConversations] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!open) return
    loadNotifications()
  }, [open])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const [convos, unread] = await Promise.all([
        chatApi.getConversations(),
        chatApi.getUnreadCount().catch(() => ({ count: 0 })),
      ])
      setConversations(convos || [])
      setUnreadCount(unread?.count || 0)
    } catch (err) {
      console.error('Failed to load notifications', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConversationClick = (conversation) => {
    setOpen(false)
    if (onOpenChat) {
      onOpenChat(conversation)
    }
  }

  if (!user) return null

  const unreadConversations = conversations.filter((c) => (c.unread || 0) > 0)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full p-2 hover:bg-gray-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-[#6B7280]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF7A00] text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl z-50">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
            <h3 className="font-semibold text-[#1F2937]">Notifications</h3>
            <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-4 w-4 text-[#6B7280]" />
            </button>
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
                  onClick={() => handleConversationClick(conv)}
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
        </div>
      )}
    </div>
  )
}
