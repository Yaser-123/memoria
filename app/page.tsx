'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Sidebar } from '@/components/sidebar'
import { ChatContainer } from '@/components/chat-container'
import { ChatInput } from '@/components/chat-input'
import { AuthModal } from '@/components/auth-modal'
import { Toaster } from '@/components/ui/sonner'
import { useChatStore } from '@/hooks/use-chat-store'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const {
    chats,
    currentChatId,
    currentChat,
    isLoaded,
    selectChat,
    deleteChat,
    createNewChat,
    updateChatMessages,
    ensureCurrentChat,
  } = useChatStore(user?.id)

  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Close modal when user logs in
  useEffect(() => {
    if (user) setShowAuthModal(false)
  }, [user])

  const { messages, sendMessage, status, setMessages, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    id: currentChatId || undefined,
  })

  const isStreaming = status === 'streaming' || status === 'submitted'

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster position="top-center" />
      
      {showAuthModal && !user && (
        <div className="fixed inset-0 z-[100] bg-background">
          <Button 
            variant="ghost" 
            className="absolute top-4 right-4 z-[110]"
            onClick={() => setShowAuthModal(false)}
          >
            Close
          </Button>
          <AuthModal />
        </div>
      )}

      <Sidebar
        user={user}
        chats={chats}
        currentChatId={currentChatId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onLogout={handleLogout}
        onAuth={() => setShowAuthModal(true)}
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
