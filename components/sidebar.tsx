'use client'

import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Plus,
  MessageSquare,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Chat } from '@/lib/types'

interface SidebarProps {
  chats: Chat[]
  currentChatId: string | null
  isOpen: boolean
  onToggle: () => void
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
}

export const Sidebar = memo(function Sidebar({
  chats,
  currentChatId,
  isOpen,
  onToggle,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:relative z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
          isOpen ? 'w-64' : 'w-0 md:w-0'
        )}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sidebar-foreground">
                  Memoria AI
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <PanelLeftClose className="h-4 w-4" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>

            {/* New Chat Button */}
            <div className="p-3">
              <Button
                onClick={onNewChat}
                className="w-full justify-start gap-2 bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-1 pb-4">
                {chats.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8 px-4">
                    No conversations yet. Start a new chat!
                  </div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={cn(
                        'group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors',
                        currentChatId === chat.id
                          ? 'bg-sidebar-primary/10 text-sidebar-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      )}
                      onClick={() => onSelectChat(chat.id)}
                    >
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 truncate text-sm">
                        {chat.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteChat(chat.id)
                        }}
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-transparent"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Delete chat</span>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border">
              <p className="text-xs text-muted-foreground text-center">
                Powered by Gemini 2.5 Flash
              </p>
            </div>
          </>
        )}
      </aside>

      {/* Toggle button when closed */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="fixed top-4 left-4 z-40 h-10 w-10 bg-card hover:bg-accent border border-border"
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      )}
    </>
  )
})
