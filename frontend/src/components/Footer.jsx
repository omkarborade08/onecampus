import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="text-2xl font-bold text-[#FF7A00]">
              OneCampus
            </Link>
            <p className="mt-3 text-sm text-[#6B7280]">
              Your all-in-one campus community platform for marketplace, lost & found, and real-time chat.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1F2937]">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#6B7280]">
              <li><Link to="/marketplace" className="hover:text-[#FF7A00]">Marketplace</Link></li>
              <li><Link to="/lost-found" className="hover:text-[#FF7A00]">Lost & Found</Link></li>
              <li><Link to="/chat" className="hover:text-[#FF7A00]">Chat</Link></li>
              <li><Link to="/events" className="hover:text-[#FF7A00]">Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1F2937]">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#6B7280]">
              <li><Link to="/about" className="hover:text-[#FF7A00]">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#FF7A00]">Contact</Link></li>
              <li><span className="cursor-pointer hover:text-[#FF7A00]">Privacy Policy</span></li>
              <li><span className="cursor-pointer hover:text-[#FF7A00]">Terms of Service</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1F2937]">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#6B7280]">
              <li>support@OneCampus.edu</li>
              <li>+91 98765 43210</li>
              <li className="flex items-center gap-1">
                Made with <span className="text-[#FF7A00]">♥</span> for students
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-[#E5E7EB] pt-6 text-center text-xs text-[#6B7280]">
          © 2026 OneCampus. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

