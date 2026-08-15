import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, Image as ImageIcon, X, Phone, Video, MoreVertical, Search } from 'lucide-react'
import { chatApi } from '../services/chat'
import { getAuthToken } from '../services/api'
import { useAuth } from '../context/AuthContext'

const WS_BASE = import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL.replace(/^https?/, 'wss')
  : (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host

function encodeStompFrame(command, headers, body = '') {
  const lines = [command, ...Object.keys(headers).map((k) => `${k}:${headers[k]}`)]
  if (body) lines.push('', body)
  return lines.join('\n') + '\u0000'
}

function decodeStompFrame(data) {
  const nullIndex = data.indexOf('\u0000')
  if (nullIndex === -1) return null
  const payload = data.slice(0, nullIndex)
  const parts = payload.split('\n')
  const command = parts[0]
  const headers = {}
  let body = ''
  let i = 1
  for (; i < parts.length; i++) {
    const line = parts[i]
    if (!line) break
    const idx = line.indexOf(':')
    if (idx > -1) headers[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
  if (i < parts.length - 1) body = parts.slice(i + 1).join('\n')
  return { command, headers, body }
}

export default function Chat() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const initialConversationId = searchParams.get('conversation')

  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [wsConnected, setWsConnected] = useState(false)
  const [callNotice, setCallNotice] = useState('')
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const wsRef = useRef(null)
  const pollTimerRef = useRef(null)
  const lastMessageIdRef = useRef(null)
  const subscriptionIdRef = useRef(0)
  const activeChatRef = useRef(null)

  useEffect(() => {
    activeChatRef.current = activeChat
  }, [activeChat])

  const sendPresence = async (status) => {
    if (!user?.id) return
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(encodeStompFrame('SEND', {
        destination: '/app/presence',
      }, JSON.stringify({ userId: user.id, status })))
    } else {
      try {
        await chatApi.updatePresence(user.id, status)
      } catch (err) {
        console.error('Failed to update presence via REST', err)
      }
    }
  }

  const connectWebSocket = () => {
    const token = getAuthToken()
    if (!token) return

    const ws = new WebSocket(`${WS_BASE}/ws`)

    ws.onopen = () => {
      console.log('WebSocket open')
      setWsConnected(true)
      ws.send(encodeStompFrame('CONNECT', {
        'accept-version': '1.2',
        'heart-beat': '0,0',
        Authorization: `Bearer ${token}`,
      }))
    }

    ws.onmessage = (event) => {
      const frame = decodeStompFrame(event.data)
      if (!frame) return
      if (frame.command === 'CONNECTED') {
        console.log('STOMP connected')
        sendPresence('ONLINE')
        if (activeChatRef.current) {
          subscribeToChat(ws, activeChatRef.current.id)
        }
      }
    }

    ws.onerror = (err) => {
      console.error('WebSocket error', err)
      setWsConnected(false)
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
      sendPresence('OFFLINE')
      setWsConnected(false)
    }

    wsRef.current = ws
  }

  const subscribeToChat = (ws, conversationId) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    const subId = `sub-${++subscriptionIdRef.current}`
    ws.send(encodeStompFrame('SUBSCRIBE', {
      id: subId,
      destination: `/topic/conversation/${conversationId}/messages`,
    }))
  }

  useEffect(() => {
    connectWebSocket()
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      setWsConnected(false)
    }
  }, [])

  useEffect(() => {
    if (!user?.id) return
    sendPresence('ONLINE')
    const interval = setInterval(() => sendPresence('ONLINE'), 30000)
    return () => clearInterval(interval)
  }, [user?.id])

  useEffect(() => {
    let cancelled = false
    setLoadingConversations(true)
    setError(null)

    chatApi
      .getConversations()
      .then((data) => {
        if (!cancelled) {
          const mapped = (data || []).map((conv) => ({
            id: conv.id,
            name: conv.otherUserName || conv.name,
            initials: conv.initials || (conv.otherUserName?.[0]?.toUpperCase() || '?'),
            last: conv.lastMessage || '',
            time: conv.time || '',
            online: conv.otherUserOnline || false,
            unread: conv.unread || 0,
            otherUserId: conv.otherUserId,
            otherUserCollege: conv.otherUserCollege,
            otherUserOnline: conv.otherUserOnline || false,
          }))
          setConversations(mapped)

          if (initialConversationId) {
            const found = mapped.find((c) => c.id === initialConversationId)
            if (found) {
              setActiveChat(found)
              chatApi.markAsRead(found.id)
            } else if (mapped.length > 0) {
              setActiveChat(mapped[0])
              chatApi.markAsRead(mapped[0].id)
            }
          } else if (mapped.length > 0) {
            setActiveChat(mapped[0])
            chatApi.markAsRead(mapped[0].id)
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoadingConversations(false)
      })

    return () => {
      cancelled = true
    }
  }, [initialConversationId])

  useEffect(() => {
    let cancelled = false
    if (!activeChat) return

    setLoadingMessages(true)
    setMessages([])

    chatApi
      .getMessages(activeChat.id)
      .then((data) => {
        if (!cancelled) {
          const mapped = (data || []).map((msg) => ({
            id: msg.id,
            conversationId: msg.conversationId,
            text: msg.text || '',
            imageUrl: msg.imageUrl || null,
            type: msg.type || 'TEXT',
            mine: msg.mine || false,
            time: msg.time || '',
            senderName: msg.senderName || 'Unknown',
          }))
          setMessages(mapped)
          if (mapped.length > 0) {
            lastMessageIdRef.current = mapped[mapped.length - 1].id
          }
          scrollToBottom()
        }
      })
      .catch((err) => {
        if (!cancelled) console.error(err)
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false)
      })

    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      subscribeToChat(ws, activeChat.id)
    }

    return () => {
      cancelled = true
    }
  }, [activeChat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const ws = wsRef.current
    if (!ws || !activeChat) return

    const handler = (event) => {
      const frame = decodeStompFrame(event.data)
      if (!frame || frame.command !== 'MESSAGE') return
      try {
        const msg = JSON.parse(frame.body)
        if (msg.conversationId === activeChat.id) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev
            return [...prev, {
              id: msg.id,
              conversationId: msg.conversationId || activeChat.id,
              text: msg.text || '',
              imageUrl: msg.imageUrl || null,
              type: msg.type || 'TEXT',
              mine: false,
              time: msg.time || '',
              senderName: msg.senderName || 'Unknown',
            }]
          })
        }
      } catch (err) {
        console.error('Failed to parse STOMP message', err)
      }
    }

    ws.addEventListener('message', handler)
    return () => ws.removeEventListener('message', handler)
  }, [activeChat])

  useEffect(() => {
    const token = getAuthToken()
    if (!token || !activeChat) return

    pollTimerRef.current = setInterval(async () => {
      try {
        const data = await chatApi.getMessages(activeChat.id)
        const mapped = (data || []).map((msg) => ({
          id: msg.id,
          conversationId: msg.conversationId,
          text: msg.text || '',
          imageUrl: msg.imageUrl || null,
          type: msg.type || 'TEXT',
          mine: msg.mine || false,
          time: msg.time || '',
          senderName: msg.senderName || 'Unknown',
        }))
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id))
          const newMessages = mapped.filter((m) => !existingIds.has(m.id))
          if (newMessages.length === 0) return prev
          return [...prev, ...newMessages]
        })
        if (mapped.length > 0) {
          lastMessageIdRef.current = mapped[mapped.length - 1].id
        }
      } catch (err) {
        console.error('Polling failed', err)
      }
    }, 3000)

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current)
        pollTimerRef.current = null
      }
    }
  }, [activeChat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if ((!message.trim() && !imageFile) || !activeChat) return

    setSending(true)

    try {
      let imageUrl = null
      if (imageFile) {
        const uploadResult = await chatApi.uploadImage(imageFile)
        imageUrl = uploadResult.imageUrl
      }

      const tempId = `local-${Date.now()}`
      const tempText = message.trim() || (imageFile ? 'Image' : '')
      const tempTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const optimisticMessage = {
        id: tempId,
        conversationId: activeChat.id,
        text: tempText,
        imageUrl: imageUrl,
        type: imageFile ? 'IMAGE' : 'TEXT',
        mine: true,
        time: tempTime,
        senderName: 'You',
      }

      setMessages((prev) => [...prev, optimisticMessage])
      setMessage('')
      setImagePreview(null)
      setImageFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      const sent = await chatApi.sendMessage({
        conversationId: activeChat.id,
        text: tempText,
        imageUrl: imageUrl,
        type: imageFile ? 'IMAGE' : 'TEXT',
      })

      setMessages((prev) => {
        const filtered = prev.filter((m) => !(m.id === tempId || (m.text === tempText && m.time === tempTime && m.mine)))
        const exists = filtered.some((m) => m.id === sent.id)
        if (exists) return filtered
        return [...filtered, {
          id: sent.id || tempId,
          conversationId: activeChat.id,
          text: tempText,
          imageUrl: imageUrl,
          type: imageFile ? 'IMAGE' : 'TEXT',
          mine: true,
          time: sent.time || tempTime,
          senderName: 'You',
        }]
      })
    } catch (err) {
      console.error('Failed to send message', err)
    } finally {
      setSending(false)
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1 * 1024 * 1024) {
      alert('Image size must be less than 1MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const showCallNotice = (callType) => {
    setCallNotice(`${callType} calls are not available yet. We are working on this feature.`)
    window.setTimeout(() => setCallNotice(''), 3500)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold text-[#1F2937]">Messages</h1>
      <div className="flex h-[600px] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="w-80 border-r border-[#E5E7EB] bg-gray-50">
          <div className="border-b border-[#E5E7EB] p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full rounded-full border border-[#E5E7EB] bg-white py-2 pl-10 pr-4 text-sm focus:border-[#FF7A00] focus:outline-none"
              />
            </div>
          </div>
          <div className="overflow-y-auto">
            {loadingConversations && <p className="p-4 text-sm text-[#6B7280]">Loading...</p>}
            {error && <p className="p-4 text-sm text-red-500">Error: {error}</p>}
            {!loadingConversations && !error && conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv)}
                className={`flex w-full items-center gap-3 border-b border-[#E5E7EB] p-4 text-left transition hover:bg-white ${
                  activeChat?.id === conv.id ? 'bg-white' : ''
                }`}
              >
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF7A00]/10 text-sm font-bold text-[#FF7A00]">
                    {conv.initials}
                  </div>
                  {conv.otherUserOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#1F2937] truncate">{conv.name}</span>
                    <span className="text-xs text-[#6B7280]">{conv.time}</span>
                  </div>
                  <p className="truncate text-sm text-[#6B7280]">{conv.last}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF7A00] text-xs font-bold text-white">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {activeChat ? (
            <>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF7A00]/10 text-sm font-bold text-[#FF7A00]">
                    {activeChat.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1F2937]">{activeChat.name}</div>                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => showCallNotice('Audio')}
                    aria-label="Start an audio call"
                    title="Audio calls coming soon"
                    className="rounded-full p-2 hover:bg-gray-100"
                  >
                    <Phone className="h-5 w-5 text-[#6B7280]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => showCallNotice('Video')}
                    aria-label="Start a video call"
                    title="Video calls coming soon"
                    className="rounded-full p-2 hover:bg-gray-100"
                  >
                    <Video className="h-5 w-5 text-[#6B7280]" />
                  </button>
                </div>
              </div>

              {callNotice && (
                <div role="status" className="border-b border-[#FFB36B] bg-[#FFF7ED] px-6 py-2 text-center text-sm text-[#9A3412]">
                  {callNotice}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8f9fa]">
                {loadingMessages && <p className="text-center text-[#6B7280]">Loading messages...</p>}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.mine
                          ? 'bg-[#FF7A00] text-white rounded-br-sm'
                          : 'bg-white text-[#1F2937] border border-[#E5E7EB] rounded-bl-sm'
                      }`}
                    >
                      {msg.type === 'IMAGE' && msg.imageUrl && (
                        <div className="mb-2">
                          <img
                            src={msg.imageUrl}
                            alt="Shared image"
                            className="max-w-full rounded-xl max-h-64 object-cover"
                            onClick={() => window.open(msg.imageUrl, '_blank')}
                          />
                        </div>
                      )}
                      {msg.text && msg.text !== 'Image' && <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>}
                      <span className={`text-xs mt-1 block ${msg.mine ? 'text-white/70' : 'text-[#6B7280]'}`}>{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-[#E5E7EB] p-4 bg-white">
                {imagePreview && (
                  <div className="mb-3 flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-gray-50 p-3">
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1F2937]">Image ready to send</p>
                      <p className="text-xs text-[#6B7280]">{(imageFile?.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button onClick={removeImage} className="rounded-full p-1 hover:bg-gray-200">
                      <X className="h-4 w-4 text-[#6B7280]" />
                    </button>
                  </div>
                )}
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full p-2 hover:bg-gray-100"
                    title="Send image (max 1MB)"
                  >
                    <ImageIcon className="h-5 w-5 text-[#6B7280]" />
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm focus:border-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20"
                  />
                  <button
                    type="submit"
                    disabled={sending || (!message.trim() && !imageFile)}
                    className="rounded-full bg-[#FF7A00] p-2 text-white hover:bg-[#e86f00] disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-[#6B7280]">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
