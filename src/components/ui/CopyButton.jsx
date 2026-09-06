import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useToast } from '@/lib/toast.jsx'

/**
 * Reusable Copy-To-Clipboard button component.
 * Copies specified `text` or `getText()` content, providing instant visual feedback.
 */
export default function CopyButton({
  text,
  getText,
  label = 'Copy',
  copiedLabel = 'Copied!',
  showText = false,
  notify = true,
  className = '',
}) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const handleCopy = async (e) => {
    e.stopPropagation()
    const contentToCopy = getText ? getText() : text

    if (!contentToCopy) return

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(contentToCopy)
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = contentToCopy
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopied(true)
      if (notify) {
        toast.success('Copied to clipboard!')
      }

      setTimeout(() => setCopied(false), 2000)
    } catch (_err) {
      toast.error('Failed to copy text.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-line/70 bg-surface/70 px-2.5 py-1.5 text-xs font-medium text-ink shadow-xs backdrop-blur-md transition-all hover:border-accent hover:bg-surface active:scale-95 ${className}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-accent animate-rise" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted transition-colors hover:text-ink" aria-hidden="true" />
      )}
      {showText && <span>{copied ? copiedLabel : label}</span>}
    </button>
  )
}
