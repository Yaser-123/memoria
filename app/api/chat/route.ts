import { streamText, convertToModelMessages, UIMessage } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

export const maxDuration = 60

const google = createGoogleGenerativeAI({
  apiKey: 'AIzaSyDiuOux6SlfFPyRYi8r_oEY5jDNFcyn7wo',
})

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  // Keep only last 10 messages for memory context
  const recentMessages = messages.slice(-10)

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are Memoria AI, a helpful, intelligent, and friendly AI assistant. You have excellent memory and recall previous parts of our conversation to provide contextual, personalized responses. 

Key traits:
- You're conversational and engaging
- You remember context from earlier in our chat
- You provide clear, well-structured responses
- You use markdown formatting when helpful (code blocks, lists, bold text)
- You're concise but thorough`,
    messages: await convertToModelMessages(recentMessages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse()
}
