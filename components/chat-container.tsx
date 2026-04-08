'use client'

import { useEffect, useRef } from 'react'
import type { UIMessage } from 'ai'
import { ChatMessage } from './chat-message'
import { WelcomeScreen } from './welcome-screen'

interface ChatContainerProps {
  messages: UIMessage[]
  isStreaming: boolean
  onSuggestionClick: (suggestion: string) => void
}

export function ChatContainer({
  messages,
  isStreaming,
  onSuggestionClick,
}: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isStreaming])

  if (messages.length === 0) {
    return <WelcomeScreen onSuggestionClick={onSuggestionClick} />
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
    >
      <div className="max-w-3xl mx-auto">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={
              isStreaming &&
              index === messages.length - 1 &&
              message.role === 'assistant'
            }
          />
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  )
}
