import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react'
import { lostFoundApi } from '../services/lostFound'
import { chatApi } from '../services/chat'
import { useAuth } from '../context/AuthContext'

export default function LostFoundItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chatLoading, setChatLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    lostFoundApi
      .getById(id)
      .then((data) => {
        if (!cancelled) {
          setItem({
            ...data,
            image: data.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image',
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

  const handleContactReporter = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!item?.reportedById) {
      alert('Reporter information not available')
      return
    }

    setChatLoading(true)
    try {
      const conversation = await chatApi.getOrCreateConversation(item.reportedById)

      if (!conversation?.id) {
        throw new Error('Conversation ID not received from server')
      }

      const initialMessage = item.type === 'LOST'
        ? `Hi, I think I found your lost item: ${item.title}`
        : `Hi, I'm interested in the found item: ${item.title}`

      await chatApi.sendMessage({
        conversationId: conversation.id,
        text: initialMessage,
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
  if (!item) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#1F2937]">Item not found</h1>
        <Link to="/lost-found" className="mt-4 inline-block text-[#FF7A00] hover:underline">
          Back to Lost & Found
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link to="/lost-found" className="mb-6 inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#FF7A00]">
        <ArrowLeft className="h-4 w-4" /> Back to Lost & Found
      </Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-3xl bg-gray-100">
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        </div>
        <div>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
            item.type === 'LOST' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}>
            {item.type === 'LOST' ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
            {item.type === 'LOST' ? 'Lost' : 'Found'}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-[#1F2937]">{item.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-[#6B7280]">
            <span className="font-medium text-[#1F2937]">{item.category}</span>
            <span>•</span>
            <span>{item.location}</span>
            <span>•</span>
            <span>{item.date}</span>
          </div>
          <p className="mt-4 text-[#6B7280]">{item.description}</p>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <div className="h-12 w-12 rounded-full bg-[#FF7A00]/10 flex items-center justify-center text-lg font-bold text-[#FF7A00]">
              {item.reportedByName?.[0] || '?'}
            </div>
            <div>
              <div className="font-semibold text-[#1F2937]">{item.reportedByName || 'Unknown'}</div>
              <div className="text-sm text-[#6B7280]">Contact: {item.contact}</div>
            </div>
          </div>
          {item.reportedById !== user?.id && (
            <button
              onClick={handleContactReporter}
              disabled={chatLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#FF7A00] py-3 font-semibold text-white hover:bg-[#e86f00] disabled:opacity-60"
            >
              <MessageSquare className="h-5 w-5" />
              {chatLoading ? 'Opening chat...' : item.type === 'LOST' ? 'Contact Reporter' : 'Contact Finder'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
