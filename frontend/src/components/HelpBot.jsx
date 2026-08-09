import { useState } from 'react'
import { Bot, Send, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { chatbotApi } from '../services/chatbot'

const starterMessage = {
  from: 'bot',
  text: `Hello! How can I help you with OneCampus today? I can assist you with:

- Signing up and logging in
- Profile settings and image uploads
- Campus navigation
- Marketplace listings and selling items
- Lost-and-found reports
- Events and registration
- Direct messaging and notifications
- Contacting support

What would you like help with?`,
}

const markdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
}

export default function HelpBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([starterMessage])
  const [sending, setSending] = useState(false)

  const sendMessage = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((current) => [...current, { from: 'user', text }, { from: 'bot', text: 'OneCampus Help is checking that for you...', loading: true }])
    setSending(true)
    try {
      const response = await chatbotApi.send(text)
      const reply = response.reply || response.message || 'I could not understand that response.'
      setMessages((current) => current.map((message) => message.loading ? { from: 'bot', text: reply } : message))
    } catch (error) {
      const errorMessage = error.message || 'The AI help service is unavailable.'
      setMessages((current) => current.map((message) => message.loading ? { from: 'bot', text: errorMessage } : message))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && <div className="mb-3 flex h-[30rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-2xl"><div className="flex items-center justify-between bg-[#1F2937] px-4 py-3 text-white"><div className="flex items-center gap-2"><Bot className="h-5 w-5 text-[#FFB36B]" /><span className="font-semibold">OneCampus Help</span></div><button type="button" onClick={() => setOpen(false)} aria-label="Close help chat"><X className="h-5 w-5" /></button></div><div className="flex-1 space-y-3 overflow-y-auto bg-[#FFFBF5] p-4">{messages.map((message, index) => <div key={`${message.from}-${index}`} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.from === 'user' ? 'ml-auto whitespace-pre-line bg-[#FF7A00] text-white' : 'bg-white text-[#1F2937] shadow-sm'} ${message.loading ? 'animate-pulse' : ''}`}>{message.from === 'bot' ? <ReactMarkdown components={markdownComponents}>{message.text}</ReactMarkdown> : message.text}</div>)}</div><form onSubmit={sendMessage} className="flex gap-2 border-t border-[#E5E7EB] p-3"><input value={input} onChange={(event) => setInput(event.target.value)} disabled={sending} placeholder="Ask for help..." className="min-w-0 flex-1 rounded-full border border-[#E5E7EB] px-4 py-2 text-sm focus:border-[#FF7A00] focus:outline-none" /><button type="submit" disabled={sending} aria-label="Send help message" className="rounded-full bg-[#FF7A00] p-2 text-white disabled:opacity-60"><Send className="h-4 w-4" /></button></form></div>}
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Open AI help chat" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF7A00] text-white shadow-lg transition hover:scale-105"><Bot className="h-6 w-6" /></button>
    </div>
  )
}