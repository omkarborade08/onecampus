import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, AlertTriangle, CheckCircle } from 'lucide-react'
import { lostFoundApi } from '../services/lostFound'

export default function LostFound() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    lostFoundApi
      .getAll(filter)
      .then((data) => {
        if (!cancelled) {
          const mapped = (data || []).map((item) => ({
            ...item,
            image: item.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image',
          }))
          setItems(mapped)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [filter])

  useEffect(() => {
    let cancelled = false
    if (!search.trim()) {
      return () => {
        cancelled = true
      }
    }

    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)
      lostFoundApi
        .search(search)
        .then((data) => {
          if (!cancelled) {
            const mapped = (data || []).map((item) => ({
              ...item,
              image: item.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image',
            }))
            setItems(mapped)
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err.message)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 300)

    return () => {
      clearTimeout(timer)
      cancelled = true
    }
  }, [search])

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Lost & Found</h1>
          <p className="mt-1 text-[#6B7280]">Report lost items or help others find theirs.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/lost-found/report-lost" className="rounded-full bg-[#FF7A00] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e86f00]">
            Report Lost
          </Link>
          <Link to="/lost-found/report-found" className="rounded-full border border-[#FF7A00] px-5 py-2 text-sm font-semibold text-[#FF7A00] hover:bg-[#FF7A00]/10">
            Report Found
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-12 pr-4 text-sm focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
          />
        </div>
        <div className="flex rounded-full border border-[#E5E7EB] bg-white p-1">
          {['all', 'lost', 'found'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                filter === f ? 'bg-[#FF7A00] text-white' : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-center text-[#6B7280]">Loading items...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/lost-found/${item.id}`}
              className="rounded-3xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-lg block"
            >
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                    item.type === 'LOST' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {item.type === 'LOST' ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                    {item.type === 'LOST' ? 'Lost' : 'Found'}
                  </span>
                  <span className="text-xs text-[#6B7280]">{item.category}</span>
                </div>
                <h3 className="mt-2 font-semibold text-[#1F2937]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#6B7280] line-clamp-2">{item.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-[#6B7280]">
                  <span>{item.location}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="mt-12 text-center text-[#6B7280]">
          <p className="text-lg">No items found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
