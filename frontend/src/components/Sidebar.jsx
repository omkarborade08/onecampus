import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Search,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/lost-found', label: 'Lost & Found', icon: Search },
  { to: '/chat', label: 'Messages', icon: MessageSquare },
]

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-white border-r border-[#E5E7EB] transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 py-5">
          {!collapsed && (
            <Link to="/" className="text-2xl font-bold text-[#FF7A00]">
              OneCampus
            </Link>
          )}
          <button
            onClick={onToggleCollapse}
            className="rounded-full p-2 hover:bg-gray-100"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-[#6B7280]" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-[#6B7280]" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-[#FF7A00]/10 text-[#FF7A00]'
                    : 'text-[#6B7280] hover:bg-gray-100 hover:text-[#1F2937]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[#E5E7EB] px-3 py-4">
          {!collapsed && user && (
            <div className="mb-3 px-3 py-2">
              <p className="text-sm font-semibold text-[#1F2937] truncate">{user.name}</p>
              <p className="text-xs text-[#6B7280] truncate">{user.college}</p>
            </div>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}

