'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Sidebar } from '@/components/sidebar'
import { ChatContainer } from '@/components/chat-container'
import { ChatInput } from '@/components/chat-input'
import { useChatStore } from '@/hooks/use-chat-store'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const {
    chats,
    currentChatId,
    currentChat,
    createNewChat,
    selectChat,
    deleteChat,
    updateChatMessages,
    ensureCurrentChat,
  } = useChatStore()

  const { messages, sendMessage, status, setMessages, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    id: currentChatId || undefined,
  })

  const isStreaming = status === 'streaming' || status === 'submitted'

  // Sync messages with chat store
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      updateChatMessages(currentChatId, messages)
    }
  }, [currentChatId, messages, updateChatMessages])

  const lastChatId = useRef<string | null>(null)

  // Load messages when switching chats
  useEffect(() => {
    if (currentChatId !== lastChatId.current) {
      lastChatId.current = currentChatId
      if (currentChat) {
        setMessages(currentChat.messages)
      } else {
        setMessages([])
      }
    }
  }, [currentChatId, currentChat, setMessages])


  const handleSendMessage = useCallback(
    (text: string) => {
      const chatId = ensureCurrentChat()
      if (chatId) {
        sendMessage({ text })
      }
    },
    [ensureCurrentChat, sendMessage]
  )

  const handleNewChat = useCallback(() => {
    createNewChat()
  }, [createNewChat])

  const handleSelectChat = useCallback(
    (chatId: string) => {
      selectChat(chatId)
    },
    [selectChat]
  )

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      deleteChat(chatId)
    },
    [deleteChat]
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSendMessage(suggestion)
    },
    [handleSendMessage]
  )

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <ChatContainer
          messages={messages}
          isStreaming={isStreaming}
          onSuggestionClick={handleSuggestionClick}
        />
        <ChatInput
          onSendMessage={handleSendMessage}
          onStop={stop}
          isLoading={isStreaming}
        />
      </main>
    </div>
  )
}
