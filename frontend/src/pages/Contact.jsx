import { useState } from 'react'
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('Message sent! We will get back to you soon.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937]">Contact Us</h1>
        <p className="mt-2 text-[#6B7280]">Have questions? We'd love to hear from you.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="mt-1 h-5 w-5 text-[#FF7A00]" />
            <div>
              <h3 className="font-semibold text-[#1F2937]">Email</h3>
              <p className="text-sm text-[#6B7280]">support@OneCampus.edu</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="mt-1 h-5 w-5 text-[#FF7A00]" />
            <div>
              <h3 className="font-semibold text-[#1F2937]">Phone</h3>
              <p className="text-sm text-[#6B7280]">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="mt-1 h-5 w-5 text-[#FF7A00]" />
            <div>
              <h3 className="font-semibold text-[#1F2937]">Address</h3>
              <p className="text-sm text-[#6B7280]">OneCampus HQ, Student Center, University Campus</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2937]">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937]">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937]">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937]">Message</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
              />
            </div>
            {status && <p className="text-sm text-green-600">{status}</p>}
            <button type="submit" className="w-full rounded-full bg-[#FF7A00] py-3 font-semibold text-white hover:bg-[#e86f00]">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

