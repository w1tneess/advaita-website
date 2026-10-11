import { RefreshCw, Trash2, Mail, Copy, Check, Download, Search } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import Button from '@/components/ui/Button'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import { useConfirm } from '../../hooks/useConfirm.jsx'
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client.js'
import { useToast } from '../../lib/toast'

export default function MessagesList() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const toast = useToast()
  const { confirm, dialogProps } = useConfirm()

  const fetchMessages = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Failed to load messages')
        console.error(error)
      } else {
        setMessages(data || [])
      }
    } catch (err) {
      toast.error('Failed to load messages')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const filteredMessages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return messages
    return messages.filter(
      (m) =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.email || '').toLowerCase().includes(q) ||
        (m.topic || '').toLowerCase().includes(q) ||
        (m.message || '').toLowerCase().includes(q),
    )
  }, [messages, searchQuery])

  const handleCopyEmail = (msg) => {
    navigator.clipboard.writeText(msg.email)
    setCopiedId(msg.id)
    toast.success(`Copied ${msg.email} to clipboard`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExportCsv = () => {
    if (messages.length === 0) {
      toast.info('No messages to export.')
      return
    }
    const headers = ['ID', 'Date', 'Name', 'Email', 'Topic', 'Message']
    const rows = messages.map((m) => [
      m.id,
      m.created_at,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.topic || '').replace(/"/g, '""')}"`,
      `"${(m.message || '').replace(/"/g, '""')}"`,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contact_messages_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Messages exported to CSV.')
  }

  const handleExportJson = () => {
    if (messages.length === 0) {
      toast.info('No messages to export.')
      return
    }
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contact_messages_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Messages exported to JSON.')
  }

  const handleDelete = async (msg) => {
    if (!isSupabaseConfigured() || !supabase) {
      toast.error('Supabase is not configured')
      return
    }

    const confirmed = await confirm({
      title: 'Delete this message?',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete message',
    })
    if (!confirmed) return

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', msg.id)
        .select()
      if (error) {
        toast.error('Failed to delete message')
        console.error(error)
      } else if (!data || data.length === 0) {
        toast.error('Could not delete message. Check database permissions.')
      } else {
        toast.success('Message deleted')
        setMessages((prev) => prev.filter((m) => m.id !== msg.id))
      }
    } catch (err) {
      toast.error('Failed to delete message')
      console.error(err)
    }
  }

  return (
    <AdminPage
      title="Messages"
      description="Inquiries and submissions received from the public contact terminal."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {messages.length > 0 && (
            <>
              <Button onClick={handleExportCsv} size="sm" variant="ghost">
                <Download className="h-4 w-4" aria-hidden="true" />
                CSV
              </Button>
              <Button onClick={handleExportJson} size="sm" variant="ghost">
                <Download className="h-4 w-4" aria-hidden="true" />
                JSON
              </Button>
            </>
          )}
          <Button onClick={fetchMessages} size="sm" variant="secondary" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </Button>
        </div>
      }
    >
      {/* Search Bar & Counter */}
      {messages.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, topic, or content..."
              className="w-full rounded-xl border border-line bg-surface/60 py-2 pl-10 pr-4 text-xs font-sans text-ink placeholder:text-neutral-500 focus:border-accent focus:outline-none transition-all duration-200"
            />
          </div>
          <span className="font-mono text-xs text-muted">
            Showing {filteredMessages.length} of {messages.length} inquiries
          </span>
        </div>
      )}

      <div className="space-y-4">
        {isLoading && messages.length === 0 ? (
          <p className="text-sm text-muted">Loading messages...</p>
        ) : filteredMessages.length === 0 ? (
          <p className="text-sm text-muted">
            {messages.length === 0 ? 'No messages received yet.' : 'No messages match your search query.'}
          </p>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg.id} className="rounded-2xl border border-line bg-surface/60 p-5 shadow-subtle hover:border-line/80 transition-all duration-200">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-medium text-ink text-sm tracking-tight">{msg.name}</div>
                <div className="font-mono text-xs text-muted">
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  }).format(new Date(msg.created_at))}
                </div>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                <a
                  href={`mailto:${encodeURIComponent(msg.email)}`}
                  className="text-accent hover:underline transition-colors"
                >
                  {msg.email}
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyEmail(msg)}
                  title="Copy email address"
                  className="inline-flex items-center text-neutral-500 hover:text-ink transition-colors cursor-pointer"
                >
                  {copiedId === msg.id ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
                {msg.topic && (
                  <>
                    <span className="text-neutral-600">•</span>
                    <span className="rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-neutral-300">
                      {msg.topic}
                    </span>
                  </>
                )}
              </div>

              <div className="whitespace-pre-wrap rounded-xl border border-line/40 bg-surface/40 p-4 text-xs font-sans text-neutral-300 leading-relaxed">
                {msg.message}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={`mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent(msg.topic ? `Re: ${msg.topic}` : 'Inquiry response from Advaita Chandra')}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-xs text-neutral-300 hover:border-accent hover:text-accent transition-all duration-150"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Reply via Email
                </a>

                <Button variant="danger" size="sm" onClick={() => handleDelete(msg)}>
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmDialog {...dialogProps} />
    </AdminPage>
  )
}

