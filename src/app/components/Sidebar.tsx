'use client'

import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
// Removed unused: import { useRouter } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
  onChatClick: (session: { id: string; messages: { role: string; content: string }[] }) => void
  allSessions: { id: string; messages: { role: string; content: string }[] }[]
}

export default function Sidebar({
  isOpen,
  onClose,
  onNewChat,
  onChatClick,
  allSessions
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleNewChatClick = () => {
    onNewChat()
    onClose()
  }

  const handleHelp = () => {
    alert('Help / FAQ clicked')
    onClose()
  }

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b dark:border-white/10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">Smarty</h2>
        <button onClick={onClose}>
          <X className="h-6 w-6 text-gray-800 dark:text-white" />
        </button>
      </div>
      <div className="px-4 py-4 space-y-4">
        {/* New Chat */}
        <button
          onClick={handleNewChatClick}
          className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition"
        >
          ➕ New Chat
        </button>

        {/* All Chat Sessions */}
        <div>
          <h3 className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition">📜 Chats History</h3>
          <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {allSessions.length > 0 ? (
              allSessions.map((session, index) => {
                const firstMessage = session.messages[0]?.content || 'New Chat'
                return (
                  <li
                    key={session.id || index}
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition text-sm truncate text-gray-700 dark:text-gray-300"
                    onClick={() => onChatClick(session)} // Handle chat session click
                  >
                    🗨️ {firstMessage.slice(0, 50)}
                  </li>
                )
              })
            ) : (
              <li className="text-gray-500 dark:text-gray-400 px-2 py-2">No chat sessions yet</li>
            )}
          </ul>
        </div>

        {/* Help/FAQ */}
        <button
          onClick={handleHelp}
          className="w-full text-left px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition"
        >
          ❓ Help / FAQ
        </button>
      </div>
    </div>
  )
}
