export interface Chat {
  id: string
  title: string
  messages: any[]
  createdAt: Date
  updatedAt: Date
}

export interface ChatStore {
  chats: Chat[]
  currentChatId: string | null
}

// Mockup interface for future Supabase integration
export interface SupabaseMemoryLayer {
  saveChat: (chat: Chat) => Promise<void>
  loadChats: () => Promise<Chat[]>
  deleteChat: (chatId: string) => Promise<void>
  updateChatTitle: (chatId: string, title: string) => Promise<void>
}

// Mock implementation - replace with actual Supabase when ready
export const mockSupabaseMemory: SupabaseMemoryLayer = {
  saveChat: async (chat: Chat) => {
    console.log('Mock: Saving chat to Supabase', chat)
  },
  loadChats: async () => {
    console.log('Mock: Loading chats from Supabase')
    return []
  },
  deleteChat: async (chatId: string) => {
    console.log('Mock: Deleting chat from Supabase', chatId)
  },
  updateChatTitle: async (chatId: string, title: string) => {
    console.log('Mock: Updating chat title in Supabase', chatId, title)
  },
}
