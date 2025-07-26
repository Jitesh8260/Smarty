'use client'

import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar' // Import Sidebar component

interface Message {
  role: string
  content: string
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
}

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession>({
    id: uuidv4(),
    title: 'New Chat',
    messages: []
  })
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load from localStorage (only latest 5 sessions)
  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]')
    if (storedSessions.length > 0) {
      // Limit to 5 sessions
      const limitedSessions = storedSessions.slice(-5)
      setSessions(limitedSessions)
      setCurrentSession(limitedSessions[limitedSessions.length - 1]) // Load last session
    }
  }, [])

  // Save to localStorage (only latest 5 sessions)
  useEffect(() => {
    if (currentSession.messages.length > 0) {
      const updated = [...sessions.filter(s => s.id !== currentSession.id), currentSession]
      
      // Limit to 5 sessions before saving to localStorage
      const limitedSessions = updated.slice(-5)

      setSessions(limitedSessions)
      localStorage.setItem('chatSessions', JSON.stringify(limitedSessions))
    }
  }, [currentSession.messages])

  const sendMessage = async () => {
    if (!input.trim()) {
      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, { role: 'assistant', content: 'Please type a message to continue.' }]
      }))
      return
    }
  
    const userMessage = { role: 'user', content: input }
    
    // Immediately update state with user message (only once)
    setCurrentSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }))
  
    setInput('')
    setIsLoading(true)
  
    try {
      // Send the updated messages (with the user's message included) to the backend
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...currentSession.messages, userMessage] }) // Send the full message history
      })
  
      if (!res.ok) throw new Error('Failed to get a response from the bot')
  
      const data = await res.json()
      const assistantReply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't understand that."

  
      // Add only the assistant's reply here
      setCurrentSession(prev => ({
        ...prev,
        title: prev.title === 'New Chat' && input ? input.slice(0, 20) : prev.title,
        messages: [...prev.messages, { role: 'assistant', content: assistantReply }]
      }))
    } catch (error) {
      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, { role: 'assistant', content: 'Oops! Something went wrong. Try again later.' }]
      }))
    } finally {
      setIsLoading(false)
    }
  }
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession.messages])

  const handleNewChat = () => {
    if (currentSession.messages.length > 0) {
      const updated = [...sessions.filter(s => s.id !== currentSession.id), currentSession]
      // Limit to 5 sessions before saving
      const limitedSessions = updated.slice(-5)
      setSessions(limitedSessions)
      localStorage.setItem('chatSessions', JSON.stringify(limitedSessions))
    }

    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: []
    }

    setCurrentSession(newSession)
  }

  const handleClearChat = () => {
    // Remove current session from list
    const updatedSessions = sessions.filter(s => s.id !== currentSession.id)
  
    // Update state and localStorage
    setSessions(updatedSessions)
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions))
  
    // Create a new empty session
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: []
    }
  
    setCurrentSession(newSession)
  }
  

  const handleChatClick = (selectedSession: ChatSession) => {
    setCurrentSession(selectedSession)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-slate-900 dark:to-gray-800 flex items-center justify-center px-6 md:px-12 py-8">
      <Navbar 
        onClearChat={handleClearChat}
        onNewChat={handleNewChat}
        chatHistory={currentSession.messages}
        allSessions={sessions.slice(-5)}
        onChatClick={handleChatClick}
      />
      <div className="flex w-full max-w-3xl">    
        <div className="w-full h-[84vh] bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md px-8 py-2 rounded-2xl shadow-2xl border border-transparent flex flex-col mt-13">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Chat Box</h1>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent">
            {currentSession.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start space-x-3 max-w-[80%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={msg.role === 'user' ? 'user.png' : 'bot.png'}
                    alt={msg.role === 'user' ? 'User Avatar' : 'Bot Avatar'}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div
                  className={`px-5 py-2 text-sm whitespace-pre-wrap transition-all duration-300 shadow-lg
                    ${msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-2xl rounded-br-none'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-2xl rounded-bl-none'}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="w-fit max-w-[80%] min-h-[50px] px-5 py-3 rounded-2xl shadow-md text-sm whitespace-pre-wrap transition-all duration-300 mr-auto bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white flex items-center gap-1">
                <span className="h-2 w-2 bg-gray-900 dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="h-2 w-2 bg-gray-900 dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="h-2 w-2 bg-gray-900 dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-4 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-5 py-4 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md transition-all"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-200"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
