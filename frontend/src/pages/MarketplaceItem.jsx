import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { marketplaceApi } from '../services/marketplace'
import { chatApi } from '../services/chat'
import { useAuth } from '../context/AuthContext'

export default function MarketplaceItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chatLoading, setChatLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    marketplaceApi
      .getById(id)
      .then((data) => {
        if (!cancelled) {
          setProduct({
            ...data,
            price: Number(data.price),
            image: data.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image',
            seller: data.sellerName || 'Unknown',
            sellerId: data.sellerId,
            college: data.college || '',
          })
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
  }, [id])

  const handleContactSeller = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!product?.sellerId) {
      alert('Seller information not available')
      return
    }

    setChatLoading(true)
    try {
      const conversation = await chatApi.getOrCreateConversation(product.sellerId)
      
      if (!conversation?.id) {
        throw new Error('Conversation ID not received from server')
      }

      await chatApi.sendMessage({
        conversationId: conversation.id,
        text: `Hi, I'm interested in your listing: ${product.title}`,
        type: 'TEXT',
      })
      
      navigate(`/chat?conversation=${conversation.id}`)
    } catch (err) {
      console.error('Failed to start chat:', err)
      alert('Failed to start chat: ' + (err.message || 'Unknown error'))
    } finally {
      setChatLoading(false)
    }
  }

  if (loading) return <div className="mx-auto max-w-7xl px-6 py-20 text-center text-[#6B7280]">Loading...</div>
  if (error) return <div className="mx-auto max-w-7xl px-6 py-20 text-center text-red-500">Error: {error}</div>
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#1F2937]">Product not found</h1>
        <Link to="/marketplace" className="mt-4 inline-block text-[#FF7A00] hover:underline">
          Back to Marketplace
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link to="/marketplace" className="mb-6 inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#FF7A00]">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-3xl bg-gray-100">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
        </div>
        <div>
          <span className="text-sm font-medium text-[#FF7A00]">{product.category}</span>
          <h1 className="mt-2 text-3xl font-bold text-[#1F2937]">{product.title}</h1>
          <p className="mt-4 text-3xl font-bold text-[#FF7A00]">₹{product.price}</p>
          <p className="mt-4 text-[#6B7280]">{product.description}</p>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <div className="h-12 w-12 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-lg font-bold text-[#FF7A00]">
              {product.seller?.[0] || '?'}
            </div>
            <div>
              <div className="font-semibold text-[#1F2937]">{product.seller}</div>
              <div className="text-sm text-[#6B7280]">{product.college}</div>
            </div>
          </div>
          {product.sellerId !== user?.id && (
            <button
              onClick={handleContactSeller}
              disabled={chatLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#FF7A00] py-3 font-semibold text-white hover:bg-[#e86f00] disabled:opacity-60"
            >
              <MessageSquare className="h-5 w-5" />
              {chatLoading ? 'Opening chat...' : 'Contact Seller'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
