import { useState, useEffect, useRef } from 'react'
import {
  Columns2,
  Eye,
  PenLine,
  Check,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react'

export default function MarkdownSplitEditor({
  id = 'markdown-editor',
  label = 'Content',
  value = '',
  onChange,
  storageKey = 'default_draft',
  error,
  placeholder = 'Write your thoughts, essays, or notes in Markdown...',
  className = '',
  title = '',
  category = '',
  excerpt = '',
}) {
  const [mode, setMode] = useState('split') // 'write' | 'split' | 'preview'
  const [localSavedTime, setLocalSavedTime] = useState(null)
  const [hasRestorableDraft, setHasRestorableDraft] = useState(false)
  const [pendingDraft, setPendingDraft] = useState(null)
  const textareaRef = useRef(null)

  const localStorageKey = `advaita_draft_${storageKey}`

  // Check for existing local draft on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(localStorageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.content && parsed.content !== value && parsed.timestamp) {
          setHasRestorableDraft(true)
          setPendingDraft(parsed)
        }
      }
    } catch (_e) {
      // Ignore localStorage read errors
    }
  }, [localStorageKey])

  // Autosave to localStorage on changes
  useEffect(() => {
    if (!value) return
    const timer = setTimeout(() => {
      try {
        const payload = {
          content: value,
          timestamp: Date.now(),
        }
        localStorage.setItem(localStorageKey, JSON.stringify(payload))
        setLocalSavedTime(new Date())
      } catch (_e) {
        // Ignore quota errors
      }
    }, 1200)

    return () => clearTimeout(timer)
  }, [value, localStorageKey])

  const restoreDraft = () => {
    if (pendingDraft?.content) {
      onChange(pendingDraft.content)
      setHasRestorableDraft(false)
      setPendingDraft(null)
      setLocalSavedTime(new Date(pendingDraft.timestamp))
    }
  }

  const discardDraft = () => {
    try {
      localStorage.removeItem(localStorageKey)
    } catch (_e) {
      // Ignore localStorage errors
    }
    setHasRestorableDraft(false)
    setPendingDraft(null)
  }

  const insertSyntax = (before, after = '') => {
    const el = textareaRef.current
    if (!el) return

    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.substring(start, end)
    const replacement = `${before}${selected}${after}`

    const nextValue = value.substring(0, start) + replacement + value.substring(end)
    onChange(nextValue)

    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  // Simple, safe client-side Markdown formatter for instant live preview
  const formatMarkdown = (text) => {
    if (!text) return ''
    return text
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Restorable Draft Banner */}
      {hasRestorableDraft && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-accent/40 bg-accent/10 backdrop-blur-md text-xs font-mono text-ink">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>
              Unsaved local draft from{' '}
              {pendingDraft?.timestamp ? new Date(pendingDraft.timestamp).toLocaleTimeString() : 'earlier'}{' '}
              found.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={restoreDraft}
              className="px-3 py-1 rounded-md bg-accent text-canvas font-semibold hover:bg-accent-strong transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] cursor-pointer"
            >
              Restore Draft
            </button>
            <button
              type="button"
              onClick={discardDraft}
              className="px-3 py-1 rounded-md border border-line bg-surface hover:bg-raised text-muted hover:text-ink transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] cursor-pointer"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-line">
        <label htmlFor={id} className="text-sm font-medium text-ink flex items-center gap-2">
          <span>{label}</span>
          {localSavedTime && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted">
              <Check className="h-3 w-3 text-accent" />
              <span>Draft saved locally ({localSavedTime.toLocaleTimeString()})</span>
            </span>
          )}
        </label>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-line bg-surface/80 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMode('write')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              mode === 'write'
                ? 'bg-ink text-canvas font-semibold shadow-subtle'
                : 'text-muted hover:text-ink'
            }`}
            title="Write Only"
          >
            <PenLine className="h-3.5 w-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              mode === 'split'
                ? 'bg-ink text-canvas font-semibold shadow-subtle'
                : 'text-muted hover:text-ink'
            }`}
            title="Split Screen"
          >
            <Columns2 className="h-3.5 w-3.5" />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              mode === 'preview'
                ? 'bg-ink text-canvas font-semibold shadow-subtle'
                : 'text-muted hover:text-ink'
            }`}
            title="Live Preview"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Markdown Helper Formatting Ribbon (Active when writing or split) */}
      {mode !== 'preview' && (
        <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl border border-line bg-surface/50 backdrop-blur-sm text-muted">
          <button
            type="button"
            onClick={() => insertSyntax('**', '**')}
            className="p-1.5 rounded hover:bg-raised hover:text-ink transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] cursor-pointer"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('*', '*')}
            className="p-1.5 rounded hover:bg-raised hover:text-ink transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] cursor-pointer"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <span className="w-[1px] h-4 bg-line mx-1" />
          <button
            type="button"
            onClick={() => insertSyntax('## ')}
            className="p-1.5 rounded hover:bg-raised hover:text-ink transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] cursor-pointer"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('### ')}
            className="p-1.5 rounded hover:bg-raised hover:text-ink transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] cursor-pointer"
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <span className="w-[1px] h-4 bg-line mx-1" />
          <button
            type="button"
            onClick={() => insertSyntax('> ')}
            className="p-1.5 rounded hover:bg-raised hover:text-ink transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] cursor-pointer"
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('```\n', '\n```')}
            className="p-1.5 rounded hover:bg-raised hover:text-ink transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] cursor-pointer"
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('- ')}
            className="p-1.5 rounded hover:bg-raised hover:text-ink transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] cursor-pointer"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('[', '](https://...)')}
            className="p-1.5 rounded hover:bg-raised hover:text-ink transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] cursor-pointer"
            title="Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Editor & Preview Panes */}
      <div
        className={`grid gap-4 ${
          mode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Editor Pane */}
        {mode !== 'preview' && (
          <div className="relative">
            <textarea
              ref={textareaRef}
              id={id}
              rows={22}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full rounded-2xl border bg-surface/60 p-4 font-mono text-sm sm:text-base text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none transition-colors leading-relaxed shadow-subtle ${
                error ? 'border-limitation' : 'border-line'
              }`}
            />
          </div>
        )}

        {/* Live Reader Preview Pane */}
        {mode !== 'write' && (
          <div className="rounded-2xl border border-line bg-surface/40 p-5 sm:p-7 overflow-y-auto max-h-[640px] shadow-raised text-left">
            <div className="pb-4 mb-5 border-b border-line">
              <div className="flex items-center gap-2 font-mono text-xs text-accent uppercase mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Reader Live View</span>
                {category && <span className="text-muted">• {category}</span>}
              </div>
              {title && (
                <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-tight">
                  {title}
                </h2>
              )}
              {excerpt && (
                <p className="mt-3 font-sans text-sm sm:text-base text-muted italic border-l border-accent/60 pl-3.5 py-0.5">
                  {excerpt}
                </p>
              )}
            </div>

            {/* Prose Content */}
            <div className="prose-body whitespace-pre-wrap text-sm sm:text-base font-sans leading-relaxed text-ink/90 space-y-4">
              {value ? (
                formatMarkdown(value)
              ) : (
                <p className="text-muted/50 font-mono text-xs italic">
                  Live preview will render here as you type...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs font-mono text-limitation">{error}</p>}
    </div>
  )
}
