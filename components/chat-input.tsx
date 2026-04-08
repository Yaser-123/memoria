'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onStop?: () => void
  isLoading?: boolean
  disabled?: boolean
}

export function ChatInput({
  onSendMessage,
  onStop,
  isLoading = false,
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = () => {
    if (!input.trim() || disabled) return
    onSendMessage(input.trim())
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-card p-2 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Memoria AI..."
            disabled={disabled}
            rows={1}
            className={cn(
              'flex-1 resize-none bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none text-sm leading-relaxed',
              'min-h-[40px] max-h-[200px]'
            )}
          />
          
          {isLoading ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onStop}
              className="h-9 w-9 rounded-xl bg-destructive/20 hover:bg-destructive/30 text-destructive"
            >
              <Square className="h-4 w-4 fill-current" />
              <span className="sr-only">Stop generating</span>
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              onClick={handleSubmit}
              disabled={!input.trim() || disabled}
              className={cn(
                'h-9 w-9 rounded-xl transition-all',
                input.trim()
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <ArrowUp className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          )}
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Memoria AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}
