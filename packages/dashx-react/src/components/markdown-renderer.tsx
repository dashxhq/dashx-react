import React from 'react'
import ReactMarkdown from 'react-markdown'

import { cn } from '../utils/cn.js'
import { Heading } from './heading.js'
import { Link } from './link.js'
import { Text } from './text.js'

type MarkdownRendererProps = {
  children: string,
  className?: string
}

function MarkdownRenderer({ children, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        h1({ children }) {
          return <Heading as="h1" className={cn("text-gray-900", className)}>{children}</Heading>
        },
        h2({ children }) {
          return <Heading as="h2" className={cn("text-gray-900", className)}>{children}</Heading>
        },
        p({ children }) {
          return <Text as="p" className={cn("text-gray-900", className)}>{children}</Text>
        },
        ul({ children }) {
          return <ul className={cn("list-disc list-inside", className)}>{children}</ul>
        },
        ol({ children }) {
          return <ol className={cn("list-decimal list-inside", className)}>{children}</ol>
        },
        li({ children }) {
          return <li className={cn("text-gray-900", className)}>{children}</li>
        },
        a({ children, href }) {
          return <Link href={href}>{children}</Link>
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export { MarkdownRenderer }
