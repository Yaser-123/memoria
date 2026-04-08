'use client'

import { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownProps {
  content: string
  className?: string
}

function CodeBlock({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}) {
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''

  if (inline) {
    return (
      <code
        className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono text-primary"
        {...props}
      >
        {children}
      </code>
    )
  }

  return (
    <div className="relative group my-4">
      {language && (
        <div className="absolute top-0 right-0 px-2 py-1 text-xs text-muted-foreground bg-muted rounded-bl rounded-tr-lg">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto p-4 rounded-lg bg-muted/50 border border-border">
        <code className={cn('text-sm font-mono', className)} {...props}>
          {children}
        </code>
      </pre>
    </div>
  )
}

export const Markdown = memo(function Markdown({
  content,
  className,
}: MarkdownProps) {
  const components = useMemo(
    () => ({
      code: CodeBlock,
      p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
      ),
      ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
      ),
      ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
      ),
      li: ({ children }: { children?: React.ReactNode }) => (
        <li className="leading-relaxed">{children}</li>
      ),
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-xl font-semibold mb-3 mt-5 first:mt-0">
          {children}
        </h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-lg font-semibold mb-2 mt-4 first:mt-0">
          {children}
        </h3>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 text-muted-foreground italic">
          {children}
        </blockquote>
      ),
      a: ({
        href,
        children,
      }: {
        href?: string
        children?: React.ReactNode
      }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {children}
        </a>
      ),
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      hr: () => <hr className="my-6 border-border" />,
    }),
    []
  )

  return (
    <div className={cn('prose prose-invert max-w-none', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
})
