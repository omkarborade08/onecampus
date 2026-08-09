import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#FF7A00]">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <h1 className="text-4xl font-bold text-[#1F2937]">About OneCampus</h1>
      <p className="mt-4 text-lg text-[#6B7280]">
        OneCampus is a full-stack campus community platform designed to make student life easier. We bring together marketplace listings, lost & found reports, real-time messaging, and campus events in one seamless experience.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#1F2937]">Our Mission</h3>
          <p className="mt-2 text-[#6B7280]">
            To create a trusted, campus-scoped platform where students can buy, sell, find lost items, and connect with peers — all without leaving their university ecosystem.
          </p>
        </div>
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#1F2937]">Technology</h3>
          <p className="mt-2 text-[#6B7280]">
            Built with Spring Boot (Modular Monolith) on the backend and React on the frontend. Secured with JWT authentication and deployed on Render and Vercel.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#1F2937]">Meet the Team</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Prathmesh Palkurtiwar', role: 'Founder & Full-Stack Engineer', photo: 'https://randomuser.me/api/portraits/men/75.jpg' },
            { name: 'Rishi Mushra', role: 'Backend & Infrastructure', photo: 'https://randomuser.me/api/portraits/men/36.jpg' },
            { name: 'Ketan Bochre', role: 'Frontend & Design Systems', photo: 'https://randomuser.me/api/portraits/men/22.jpg' },
            { name: 'Aditya Shuhane', role: 'Product & Community', photo: 'https://randomuser.me/api/portraits/men/51.jpg' },
            { name: 'Omkar Borade', role: 'Realtime Chat Engineer', photo: 'https://randomuser.me/api/portraits/men/65.jpg' },
          ].map((member) => (
            <div key={member.name} className="rounded-3xl border border-[#E5E7EB] bg-white p-6 text-center shadow-sm">
              <img src={member.photo} alt={member.name} className="mx-auto h-20 w-20 rounded-full object-cover" />
              <h3 className="mt-4 font-semibold text-[#1F2937]">{member.name}</h3>
              <p className="text-sm text-[#FF7A00]">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

