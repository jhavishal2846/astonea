'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle, FontSize, Color } from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect, useRef } from 'react'

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '40px']
const COLORS = [
  '#0f172a',
  '#475569',
  '#0072CE', // brand primary
  '#1e40af',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#000000',
  '#ffffff',
]

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep selection
      onClick={onClick}
      title={title}
      className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const setColor = (c: string) => editor.chain().focus().setColor(c).run()
  const unsetColor = () => editor.chain().focus().unsetColor().run()
  const setFontSize = (size: string | null) => {
    if (size) editor.chain().focus().setFontSize(size).run()
    else editor.chain().focus().unsetFontSize().run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50">
      <ToolbarButton
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (Ctrl+I)"
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline (Ctrl+U)"
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <span className="w-px h-5 bg-slate-300 mx-1" />

      <ToolbarButton
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('paragraph')}
        onClick={() => editor.chain().focus().setParagraph().run()}
        title="Paragraph"
      >
        ¶
      </ToolbarButton>

      <span className="w-px h-5 bg-slate-300 mx-1" />

      <ToolbarButton
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bulleted list"
      >
        •
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered list"
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
      >
        ❝
      </ToolbarButton>

      <span className="w-px h-5 bg-slate-300 mx-1" />

      <ToolbarButton
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="Align left"
      >
        ⫷
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="Align centre"
      >
        ≡
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="Align right"
      >
        ⫸
      </ToolbarButton>

      <span className="w-px h-5 bg-slate-300 mx-1" />

      {/* Font-size picker */}
      <select
        defaultValue=""
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => {
          const v = e.target.value
          setFontSize(v === '' ? null : v)
          e.currentTarget.selectedIndex = 0
        }}
        className="h-7 px-1.5 rounded text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
        title="Font size"
      >
        <option value="" disabled>
          Size
        </option>
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
        <option value="reset">Default</option>
      </select>

      {/* Colour swatches */}
      <div className="flex items-center gap-0.5 ml-1">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setColor(c)}
            title={`Set colour ${c}`}
            className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
            style={{ background: c }}
          />
        ))}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={unsetColor}
          title="Clear colour"
          className="w-5 h-5 rounded border border-slate-300 text-[10px] font-bold text-slate-600 hover:bg-slate-100"
        >
          ✕
        </button>
      </div>

      <span className="w-px h-5 bg-slate-300 mx-1" />

      <ToolbarButton
        active={editor.isActive('link')}
        onClick={() => {
          const previous = editor.getAttributes('link').href as string | undefined
          const url = window.prompt('Link URL (leave empty to remove)', previous ?? 'https://')
          if (url === null) return // cancelled
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }}
        title="Add / edit link"
      >
        🔗
      </ToolbarButton>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo (Ctrl+Z)"
        className="w-7 h-7 rounded text-xs text-slate-700 hover:bg-slate-100 ml-auto"
      >
        ↶
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo"
        className="w-7 h-7 rounded text-xs text-slate-700 hover:bg-slate-100"
      >
        ↷
      </button>
    </div>
  )
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (html: string) => void
}) {
  // Keep the latest onChange in a ref so we don't need to put it in the
  // editor extensions deps (which would re-init the editor on every keystroke).
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      Color.configure({ types: ['textStyle'] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ['http', 'https', 'mailto', 'tel'],
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[160px] px-3 py-3 focus:outline-none text-slate-900 leading-relaxed',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChangeRef.current(ed.getHTML())
    },
  })

  // External value resets (e.g. switching the selected block) should sync.
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value === current) return
    editor.commands.setContent(value || '<p></p>', { emitUpdate: false })
  }, [value, editor])

  if (!editor) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white min-h-[200px] flex items-center justify-center text-xs text-slate-400">
        Loading editor…
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
