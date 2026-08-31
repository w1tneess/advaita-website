import { RefreshCw, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import Button from '../../components/Button.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import { useConfirm } from '../../hooks/useConfirm.jsx'
import { supabase } from '../../lib/supabase/client.js'
import { useToast } from '../../lib/toast.jsx'

export default function MessagesList() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()
  const { confirm, dialogProps } = useConfirm()

  const fetchMessages = async () => {
    setIsLoading(true)
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
    setIsLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleDelete = async (msg) => {
    const confirmed = await confirm({
      title: 'Delete this message?',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete message',
    })
    if (!confirmed) return

    const { data, error } = await supabase.from('contact_submissions').delete().eq('id', msg.id).select()
    if (error) {
      toast.error('Failed to delete message')
      console.error(error)
    } else if (!data || data.length === 0) {
      toast.error('Could not delete message. Check database permissions.')
    } else {
      toast.success('Message deleted')
      setMessages((prev) => prev.filter((m) => m.id !== msg.id))
    }
  }

  return (
    <AdminPage
      title="Messages"
      description="Submissions from the public contact form."
      actions={
        <Button onClick={fetchMessages} size="sm" variant="secondary" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
          Refresh
        </Button>
      }
    >
      <div className="space-y-4">
        {isLoading && messages.length === 0 ? (
          <p className="text-sm text-muted">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="rounded-lg border border-line bg-surface p-4 shadow-sm">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-medium text-ink">{msg.name}</div>
                <div className="text-xs text-muted">
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  }).format(new Date(msg.created_at))}
                </div>
              </div>
              <div className="mb-3 text-sm text-muted">
                <a href={`mailto:${msg.email}`} className="text-accent hover:underline">
                  {msg.email}
                </a>
                {msg.topic && (
                  <>
                    <span className="mx-2 inline-block">•</span>
                    <span>{msg.topic}</span>
                  </>
                )}
              </div>
              <div className="whitespace-pre-wrap text-sm text-ink">{msg.message}</div>
              <div className="mt-4 flex justify-end">
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
