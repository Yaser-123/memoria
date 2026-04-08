'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Chat } from '@/lib/types'
import type { UIMessage } from 'ai'
import { supabase } from '@/lib/supabase'

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
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from Supabase on mount
  useEffect(() => {
    supabase.from('chats').select('*').order('updated_at', { ascending: false })
      .then(({data, error}) => {
        if (data && !error) {
          const loadedChats = data.map(d => ({
            id: d.id,
            title: d.title,
            messages: (d.messages || []) as UIMessage[],
            createdAt: new Date(d.created_at),
            updatedAt: new Date(d.updated_at)
          }))
          setChats(loadedChats)
          
          if (loadedChats.length > 0) {
            setCurrentChatId(current => current || loadedChats[0].id)
          }
        }
        setIsLoaded(true)
      })
  }, [])

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

    supabase.from('chats').insert({
      id: newChat.id,
      title: newChat.title,
      messages: newChat.messages,
      created_at: newChat.createdAt.toISOString(),
      updated_at: newChat.updatedAt.toISOString()
    }).then(({error}) => { if (error) console.error('Supabase error:', error) })

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
      supabase.from('chats').delete().eq('id', chatId).then(({error}) => { if (error) console.error('Supabase error:', error) })
    },
    [currentChatId]
  )

  const updateChatMessages = useCallback(
    (chatId: string, messages: UIMessage[]) => {
      setChats((prev) => {
        const index = prev.findIndex((c) => c.id === chatId)
        if (index === -1) return prev

        const chat = prev[index]
        let title = chat.title
        if (title === 'New Chat' && messages.length > 0) {
          const firstUserMessage = messages.find((m) => m.role === 'user')
          if (firstUserMessage) {
            const text = firstUserMessage.parts
              ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('')
            if (text) {
              title = generateTitle(text)
            }
          }
        }

        const newChat = {
          ...chat,
          title,
          messages,
          updatedAt: new Date(),
        }

        const newChats = [...prev]
        newChats[index] = newChat

        supabase.from('chats').update({
          title: newChat.title,
          messages: newChat.messages,
          updated_at: newChat.updatedAt.toISOString()
        }).eq('id', newChat.id).then(({error}) => { if (error) console.error('Supabase error:', error) })

        return newChats
      })
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
    isLoaded,
    createNewChat,
    selectChat,
    deleteChat,
    updateChatMessages,
    ensureCurrentChat,
  }
}
