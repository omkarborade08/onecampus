import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingCart } from 'lucide-react'
import { CATEGORIES } from '../data/mockData'
import { marketplaceApi } from '../services/marketplace'

export default function Marketplace() {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    marketplaceApi
      .getAll(selectedCategory)
      .then((data) => {
        if (!cancelled) {
          const mapped = (data || []).map((item) => ({
            id: item.id,
            title: item.title,
            price: Number(item.price),
            category: item.category,
            condition: item.condition,
            seller: item.sellerName || 'Unknown',
            college: item.college || '',
            postedAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
            emoji: '',
            image: item.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image',
            description: item.description || '',
            featured: false,
          }))
          setProducts(mapped)
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
  }, [selectedCategory])

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
      marketplaceApi
        .search(search)
        .then((data) => {
          if (!cancelled) {
            const mapped = (data || []).map((item) => ({
              id: item.id,
              title: item.title,
              price: Number(item.price),
              category: item.category,
              condition: item.condition,
              seller: item.sellerName || 'Unknown',
              college: item.college || '',
              postedAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
              emoji: '',
              image: item.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image',
              description: item.description || '',
              featured: false,
            }))
            setProducts(mapped)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937]">Marketplace</h1>
        <p className="mt-2 text-[#6B7280]">Buy and sell with students from your campus.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-12 pr-4 text-sm focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
          />
        </div>
        <Link
          to="/marketplace/sell"
          className="flex items-center justify-center gap-2 rounded-full bg-[#FF7A00] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e86f00]"
        >
          <ShoppingCart className="h-4 w-4" /> Sell Item
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-[#FF7A00] text-white'
                : 'border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#FF7A00] hover:text-[#FF7A00]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-[#6B7280]">Loading listings...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/marketplace/${product.id}`}
              className="group rounded-3xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#FF7A00]">{product.category}</span>
                  <span className="text-xs text-[#6B7280]">{product.postedAt}</span>
                </div>
                <h3 className="mt-1 font-semibold text-[#1F2937] line-clamp-1">{product.title}</h3>
                <p className="mt-1 text-lg font-bold text-[#1F2937]">₹{product.price}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-xs font-bold text-[#FF7A00]">
                    {product.seller?.[0] || '?'}
                  </div>
                  <span className="text-xs text-[#6B7280]">{product.seller} · {product.college}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="mt-12 text-center text-[#6B7280]">
          <p className="text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
