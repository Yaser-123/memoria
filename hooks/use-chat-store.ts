'use client'

import { useState, useCallback } from 'react'
import type { Chat } from '@/lib/types'
import type { UIMessage } from 'ai'

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function generateTitle(firstMessage: string): string {
  const maxLength = 30
  const cleaned = firstMessage.trim().replace(/\n/g, ' ')
  if (cleaned.length <= maxLength) return cleaned
  return cleaned.substring(0, maxLength) + '...'
}

interface ChatWithMessages extends Chat {
  messages: UIMessage[]
}

export function useChatStore() {
  const [chats, setChats] = useState<ChatWithMessages[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  const currentChat = chats.find((c) => c.id === currentChatId) || null

  const createNewChat = useCallback(() => {
    const newChat: ChatWithMessages = {
      id: generateId(),
      title: 'New Chat',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    }
    setChats((prev) => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    return newChat.id
  }, [])

  const selectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId)
  }, [])

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => prev.filter((c) => c.id !== chatId))
      if (currentChatId === chatId) {
        setCurrentChatId(null)
      }
    },
    [currentChatId]
  )

  const updateChatMessages = useCallback(
    (chatId: string, messages: UIMessage[]) => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat

          // Update title based on first user message if still "New Chat"
          let title = chat.title
          if (title === 'New Chat' && messages.length > 0) {
            const firstUserMessage = messages.find((m) => m.role === 'user')
            if (firstUserMessage) {
              const text = firstUserMessage.parts
                ?.filter(
                  (p): p is { type: 'text'; text: string } => p.type === 'text'
                )
                .map((p) => p.text)
                .join('')
              if (text) {
                title = generateTitle(text)
              }
            }
          }

          return {
            ...chat,
            title,
            messages,
            updatedAt: new Date(),
          }
        })
      )
    },
    []
  )

  const ensureCurrentChat = useCallback(() => {
    if (!currentChatId) {
      return createNewChat()
    }
    return currentChatId
  }, [currentChatId, createNewChat])

  return {
    chats,
    currentChatId,
    currentChat,
    createNewChat,
    selectChat,
    deleteChat,
    updateChatMessages,
    ensureCurrentChat,
  }
}
