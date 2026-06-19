import 'server-only'
import sanitizeHtml, { type IOptions } from 'sanitize-html'

/**
 * Single, conservative allow-list shared by every block that renders user-
 * supplied HTML. Keeps formatting Tiptap emits (bold, italic, lists, color,
 * font-size, alignment, links) while blocking <script>, iframes, on* handlers,
 * etc.
 */
const OPTIONS: IOptions = {
  allowedTags: [
    'p',
    'br',
    'span',
    'strong',
    'em',
    'u',
    's',
    'a',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'code',
    'pre',
    'hr',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    span: ['style'],
    p: ['style'],
    h1: ['style'],
    h2: ['style'],
    h3: ['style'],
    h4: ['style'],
    h5: ['style'],
    h6: ['style'],
    li: ['style'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedStyles: {
    '*': {
      color: [/^#(0x)?[0-9a-fA-F]+$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/],
      'background-color': [/^#(0x)?[0-9a-fA-F]+$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/],
      'font-size': [/^\d+(\.\d+)?(px|em|rem|%)$/],
      'text-align': [/^(left|center|right|justify)$/],
    },
  },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: 'noopener noreferrer',
        target: attribs.target ?? '_blank',
      },
    }),
  },
}

export function sanitizeRichText(html: string): string {
  if (!html) return ''
  return sanitizeHtml(html, OPTIONS)
}
