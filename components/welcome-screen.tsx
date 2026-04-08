'use client'

import { Sparkles, Code, Lightbulb, PenLine } from 'lucide-react'

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void
}

const suggestions = [
  {
    icon: Code,
    title: 'Write code',
    prompt: 'Help me write a React component that displays a countdown timer',
  },
  {
    icon: Lightbulb,
    title: 'Brainstorm ideas',
    prompt: 'Give me 5 creative ideas for a mobile app that helps with productivity',
  },
  {
    icon: PenLine,
    title: 'Draft content',
    prompt: 'Help me write a professional email to request a meeting with a client',
  },
]

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12">
      <div className="flex flex-col items-center gap-6 max-w-2xl text-center">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">
            Welcome to Memoria AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Your intelligent chat assistant with contextual memory
          </p>
        </div>

        {/* Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-8">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.title}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className="group flex flex-col items-start gap-3 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <suggestion.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">
                  {suggestion.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {suggestion.prompt}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <p className="text-sm text-muted-foreground mt-8">
          Start typing below or click a suggestion to begin
        </p>
      </div>
    </div>
  )
}
