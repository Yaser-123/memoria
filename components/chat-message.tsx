'use client'

import { memo } from 'react'
import type { UIMessage } from 'ai'
import { cn } from '@/lib/utils'
import { Markdown } from './markdown'
import { User, Sparkles } from 'lucide-react'

interface ChatMessageProps {
  message: UIMessage
  isStreaming?: boolean
}

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ''
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

export const ChatMessage = memo(function ChatMessage({
  message,
  isStreaming = false,
}: ChatMessageProps) {
  const isUser = message.role === 'user'
  const text = getMessageText(message)

  return (
    <div
      className={cn(
        'flex gap-4 px-4 py-6 transition-colors',
        isUser ? 'bg-transparent' : 'bg-card/30'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {isUser ? 'You' : 'Memoria AI'}
          </span>
        </div>

        <div className="text-foreground">
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
          ) : (
            <>
              <Markdown content={text} />
              {isStreaming && text && (
                <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse rounded-sm" />
              )}
              {isStreaming && !text && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
})
