import React from 'react'
import ReactMarkdown from 'react-markdown'

import { Heading } from './heading.js'
import { Link } from './link.js'
import { Text } from './text.js'

type MarkdownRendererProps = {
  children: string
}

function MarkdownRenderer({ children }: MarkdownRendererProps) {
  return (
    <div className="space-y-6">
      <ReactMarkdown
        components={{
          h1({ children }) {
            return <Heading as="h1" size={4} className="text-gray-900">{children}</Heading>
          },
          h2({ children }) {
            return <Heading as="h2" size={3} className="text-gray-900">{children}</Heading>
          },
          p({ children }) {
            return <Text as="p" className="text-gray-900">{children}</Text>
          },
          ul({ children }) {
            return <ul className="list-disc list-inside">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside">{children}</ol>
          },
          li({ children }) {
            return <li className="text-gray-900">{children}</li>
          },
          a({ children, href }) {
            return <Link href={href}>{children}</Link>
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export { MarkdownRenderer }
