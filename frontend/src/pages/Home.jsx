import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowUpRight, ShoppingBag, Search, Sparkles, Bell } from 'lucide-react'
import { PRODUCTS, CATEGORIES, STATS, TESTIMONIALS, FAQS } from '../data/mockData'

const features = [
  {
    tag: 'Marketplace',
    tagColor: 'primary',
    title: 'Sell what you\'re done with',
    desc: 'List your old textbooks, cycles, calculators, hostel gear. Buyers in your own university, no shipping, no strangers from across the country.',
    icon: ShoppingBag,
    to: '/marketplace',
  },
  {
    tag: 'Lost & Found',
    tagColor: 'secondary',
    title: 'Lost it on campus? Look here first',
    desc: 'Report what you lost or found. Items stay marked as open until they\'re actually back with their owner.',
    icon: Search,
    to: '/lost-found',
  },
  {
    tag: 'AI Chat',
    tagColor: 'primary',
    title: 'Ask AI, skip the search',
    desc: 'Get instant answers about listings, lost items, or how OneCampus works — powered by AI, right inside the app.',
    icon: Sparkles,
    to: '/chat',
  },
  {
    tag: 'Notifications',
    tagColor: 'secondary',
    title: 'Know the moment it matters',
    desc: 'Someone messaged you about your listing, or found your lost ID — you\'ll know instantly, right inside the app.',
    icon: Bell,
    to: '/chat',
  },
]

const howItWorks = [
  { step: '01', title: 'Pick your campus', desc: 'Sign in and tell us which university you\'re at. Everything is scoped to your campus only.' },
  { step: '02', title: 'List, lose, or look', desc: 'Post something to sell, report something lost or found, or just browse what\'s already up.' },
  { step: '03', title: 'Message directly', desc: 'Found a buyer or the owner of a lost item? Chat with them right inside the app.' },
  { step: '04', title: 'Get notified, not buried', desc: 'A reply, a match, a found item — it reaches you the moment it happens.' },
]

export default function Home() {
  const { user } = useAuth()

  if (user) return <Dashboard user={user} />

  return (
    <div>
      <Hero />
      <Features />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <FAQ />
    </div>
  )
}

function Dashboard({ user }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <section className="rounded-3xl bg-[#1F2937] px-8 py-10 text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#FFB36B]">{user.campusName || user.college || 'Campus community'}</p>
        <h1 className="mt-2 text-4xl font-bold">Welcome back, {user.name || 'student'}.</h1>
        <p className="mt-3 max-w-2xl text-[#D1D5DB]">Your campus activity, conversations, and opportunities in one focused dashboard.</p>
      </section>
      <section className="mt-8 grid gap-5 md:grid-cols-4">
        <DashboardCard to="/events" title="Campus events" text="Create an event or manage your registrations." action="Open events" />
        <DashboardCard to="/marketplace" title="Marketplace" text="Browse useful items shared by students on your campus." action="Browse listings" />
        <DashboardCard to="/lost-found" title="Lost & Found" text="Report lost items or help others find theirs." action="Browse lost & found" />
        <DashboardCard to="/chat" title="Messages" text="Continue conversations with buyers, sellers, and event attendees." action="Open messages" />
      </section>
    </div>
  )
}

function DashboardCard({ to, title, text, action }) {
  return <Link to={to} className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><h2 className="text-xl font-bold text-[#1F2937]">{title}</h2><p className="mt-2 min-h-12 text-sm text-[#6B7280]">{text}</p><span className="mt-5 inline-block text-sm font-semibold text-[#FF7A00]">{action} →</span></Link>
}

function DashboardEventAction({ user }) {
  return (
    <section className="border-b border-[#F2D7BF] bg-[#FFF0E0]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#FF7A00]">Your campus dashboard</p>
          <h2 className="mt-1 text-2xl font-bold text-[#1F2937]">Welcome back, {user.name || 'student'}.</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Create an event or see what is happening on your campus.</p>
        </div>
        <Link to="/events" className="inline-flex items-center justify-center rounded-full bg-[#FF7A00] px-5 py-3 text-sm font-semibold text-white hover:bg-[#e86f00]">
          Manage campus events
        </Link>
      </div>
    </section>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF0E0] to-[#FFFBF5]">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-12">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold leading-tight text-[#1F2937] md:text-7xl">
            Everything happening on campus, in one place.
          </h1>
          <p className="mt-6 text-lg text-[#6B7280] md:text-xl">
            Buy and sell with students around you. Find lost items before they're gone. Chat instantly with buyers and sellers — all inside OneCampus.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/signup" className="rounded-full bg-[#FF7A00] px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-[#e86f00]">
              Get Started
            </Link>
            <a href="#how-it-works" className="rounded-full border border-[#E5E7EB] bg-white px-8 py-3 text-base font-semibold text-[#1F2937] hover:bg-gray-50">
              See How It Works
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-[#1F2937] md:text-4xl">Everything Your Campus Needs</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, i) => (
          <Link
            key={feature.tag}
            to={feature.to}
            className="group rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF7A00]">
                {feature.tag}
              </span>
              <feature.icon className="h-6 w-6 text-[#FF7A00]" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[#1F2937]">{feature.title}</h3>
            <p className="mt-2 text-sm text-[#6B7280]">{feature.desc}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1F2937] opacity-0 transition group-hover:opacity-100">
              Explore <ArrowUpRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Stats() {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        const start = performance.now()
        const duration = 1400
        const animate = (now) => {
          const progress = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(12400 * eased))
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
      },
      { threshold: 0.35 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-[#1F2937]">
              {display.toLocaleString('en-IN')}
              {stat.suffix}
            </div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-[#6B7280]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12 max-w-2xl">
        <h2 className="text-3xl font-bold text-[#1F2937] md:text-4xl">Four steps. One sign-in.</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {howItWorks.map((item) => (
          <div key={item.step} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <span className="text-sm font-mono text-[#6B7280]">{item.step}</span>
            <h3 className="mt-2 text-lg font-semibold text-[#1F2937]">{item.title}</h3>
            <p className="mt-2 text-sm text-[#6B7280]">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-10 text-center text-3xl font-bold text-[#1F2937] md:text-4xl">Loved by students</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <div key={t.name} className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-[#1F2937]">"{t.quote}"</p>
            <div className="mt-4 flex items-center gap-3">
              <img src={t.photo} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <div className="text-sm font-semibold text-[#1F2937]">{t.name}</div>
                <div className="text-xs text-[#6B7280]">{t.college}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="mb-8 text-center text-3xl font-bold text-[#1F2937]">Questions students ask</h2>
      <div className="space-y-4">
        {FAQS.map(([q, a]) => (
          <details key={q} className="group rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <summary className="cursor-pointer list-none font-semibold text-[#1F2937]">{q}</summary>
            <p className="mt-2 text-sm text-[#6B7280]">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

