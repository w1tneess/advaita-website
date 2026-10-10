import {
  BarChart3,
  FileText,
  FolderOpen,
  GraduationCap,
  Link2,
  Milestone,
  Tags,
  Camera,
  MessageSquare,
  ArrowRight,
  Clock,
  FolderGit2,
  BookMarked,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Link } from 'react-router'
import { useEffect, useState } from 'react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import { useContent } from '../../lib/content.jsx'
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client.js'
import { checkSupabaseHealth } from '../../lib/supabase/sync.js'

function formatActivityDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  )
}

function StatItem({ icon: Icon, label, value, to }) {
  return (
    <Link to={to} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface/80 active:scale-[0.97] transition-all duration-250 ease-[var(--ease-out-quart)] group">
      <div className="flex items-center gap-3 text-xs font-sans">
        <div className="p-2 rounded-lg bg-surface text-muted group-hover:text-accent transition-colors border border-line">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-neutral-300 group-hover:text-ink font-medium tracking-tight">{label}</span>
      </div>
      <span className="font-mono text-xs text-accent font-semibold">{value}</span>
    </Link>
  )
}

function QuickAction({ icon: Icon, label, description, to }) {
  return (
    <Link 
      to={to} 
      className="relative overflow-hidden flex flex-col p-5 rounded-2xl border border-line bg-surface/40 hover:bg-surface/80 hover:border-accent/40 transition-all duration-250 ease-[var(--ease-out-quart)] group shadow-subtle hover:-translate-y-0.5 active:scale-[0.97]"
    >
      <div className="flex items-start justify-between mb-3.5">
        <div className="p-2.5 rounded-xl bg-surface border border-line group-hover:border-accent/50 group-hover:text-accent text-muted transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <ArrowRight className="h-4 w-4 text-muted/40 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent transition-all duration-200" />
      </div>
      <h3 className="font-sans text-[15px] font-semibold text-ink group-hover:text-accent transition-colors tracking-tight">{label}</h3>
      <p className="font-sans text-xs text-muted mt-1 leading-relaxed">{description}</p>
    </Link>
  )
}

export default function Dashboard() {
  const {
    projects = [],
    interests = [],
    skills = [],
    timeline = [],
    socialLinks = [],
    projectCategories = [],
    activity = [],
    photography,
    blog = [],
    notes = [],
    isRemote
  } = useContent()

  const [messages, setMessages] = useState([])
  const [health, setHealth] = useState({
    loading: true,
    configured: false,
    connected: false,
    latencyMs: 0,
    tables: { siteContent: false, contactSubmissions: false, imagesBucket: false },
    message: ''
  })
  const [isTesting, setIsTesting] = useState(false)

  const runHealthCheck = async () => {
    setIsTesting(true)
    try {
      const res = await checkSupabaseHealth()
      setHealth({ ...res, loading: false })
    } catch (_) {
      setHealth({
        loading: false,
        configured: isSupabaseConfigured(),
        connected: false,
        latencyMs: 0,
        tables: { siteContent: false, contactSubmissions: false, imagesBucket: false },
        message: 'Diagnostics failed to run'
      })
    } finally {
      setIsTesting(false)
    }
  }

  useEffect(() => {
    runHealthCheck()

    async function loadMessages() {
      if (!isSupabaseConfigured() || !supabase) return
      try {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3)
        if (!error && data) setMessages(data)
      } catch (err) {
        console.warn('Could not load recent messages:', err)
      }
    }
    loadMessages()
  }, [])

  const photos = photography?.photos || []

  const stats = [
    { icon: FileText, label: 'Blog articles', value: blog.length, to: '/admin/blog' },
    { icon: BookMarked, label: 'Reading notes', value: notes.length, to: '/admin/notes' },
    { icon: FolderOpen, label: 'Projects', value: projects.length, to: '/admin/projects' },
    { icon: Camera, label: 'Photography', value: photos.length, to: '/admin/photography' },
    { icon: Tags, label: 'Categories', value: projectCategories.length, to: '/admin/taxonomy' },
    { icon: BarChart3, label: 'Interests', value: interests.length, to: '/admin/profile' },
    { icon: GraduationCap, label: 'Skills & Tools', value: skills.length, to: '/admin/skills' },
    { icon: Milestone, label: 'Timeline entries', value: timeline.length, to: '/admin/timeline' },
    { icon: Link2, label: 'Social links', value: socialLinks.length, to: '/admin/social' },
  ]

  const drafts = blog.filter((post) => post.status === 'draft')

  return (
    <AdminPage
      title="Studio Dashboard"
      description="Overview of your website portfolio, live storage state, and recent messages."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Primary Actions & Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quick Actions */}
          <section>
            <h2 className="font-mono text-[11px] font-bold tracking-widest text-neutral-500 uppercase mb-3">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <QuickAction 
                icon={FileText} 
                label="Write Article" 
                description="Draft a new blog post or note" 
                to="/admin/blog/new"
              />
              <QuickAction 
                icon={FolderGit2} 
                label="Add Project" 
                description="Add a new project or case study" 
                to="/admin/projects/new"
              />
              <QuickAction 
                icon={Camera} 
                label="Add Photo" 
                description="Upload a photo to gallery" 
                to="/admin/photography/new"
              />
            </div>
          </section>

          {/* Recent Messages */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-[11px] font-semibold tracking-wider text-muted uppercase">
                Recent Messages
              </h2>
              <Link to="/admin/messages" className="font-sans text-xs text-accent hover:text-accent-strong flex items-center gap-1 font-medium transition-colors duration-150 ease-[var(--ease-out-quart)] hover:-translate-x-0.5">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="rounded-2xl border border-line bg-surface/40 shadow-subtle overflow-hidden backdrop-blur-sm">
              {messages.length > 0 ? (
                <div className="divide-y divide-line">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-4 hover:bg-surface/70 transition-colors duration-250 ease-[var(--ease-out-quart)]">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-medium text-xs text-ink font-sans">{msg.name}</span>
                        <span className="text-[10px] font-mono text-muted">
                          {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(msg.created_at))}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-accent mb-1.5">{msg.email} {msg.topic && `• ${msg.topic}`}</p>
                      <p className="text-xs text-muted font-sans line-clamp-2 leading-relaxed">{msg.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs font-sans text-muted flex flex-col items-center">
                  <MessageSquare className="h-7 w-7 mb-2.5 opacity-30 text-accent" />
                  No messages received yet.
                </div>
              )}
            </div>
          </section>

          {/* Activity Feed */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-[11px] font-semibold tracking-wider text-muted uppercase">
                Recent Activity
              </h2>
              <span className="text-[11px] font-mono text-muted bg-surface/60 border border-line px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${isRemote ? 'bg-emerald-400' : 'bg-accent'} animate-pulse`} />
                {isRemote ? 'Cloud Synced' : 'Local Storage'}
              </span>
            </div>
            <div className="rounded-2xl border border-line bg-surface/40 shadow-subtle overflow-hidden backdrop-blur-sm">
              {activity.length > 0 ? (
                <ul className="divide-y divide-line">
                  {activity.slice(0, 5).map((entry) => (
                    <li key={entry.id} className="p-3.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs hover:bg-surface/70 transition-colors duration-250 ease-[var(--ease-out-quart)]">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted" />
                        <span className="text-ink font-sans text-xs">
                          <strong className="font-medium text-accent capitalize">{entry.action}</strong>{' '}
                          {entry.type.replace('categories.', '')} “{entry.label}”
                        </span>
                      </div>
                      <time className="text-[11px] font-mono text-muted" dateTime={entry.at}>
                        {formatActivityDate(entry.at)}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-8 text-center text-xs font-sans text-muted">No recent edits recorded.</p>
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Overview & System Diagnostics */}
        <div className="lg:col-span-4 space-y-8">
          
          {drafts.length > 0 && (
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 shadow-subtle backdrop-blur-sm">
              <h3 className="font-sans text-xs font-semibold text-accent flex items-center gap-2 mb-2 tracking-tight">
                <FileText className="h-3.5 w-3.5" />
                Drafts in Progress
              </h3>
              <ul className="space-y-1.5">
                {drafts.slice(0, 3).map(draft => (
                  <li key={draft.id}>
                    <Link to={`/admin/blog/${draft.id}`} className="text-xs text-muted hover:text-ink hover:underline line-clamp-1 transition-colors duration-150 ease-[var(--ease-out-quart)]">
                      {draft.title || 'Untitled Draft'}
                    </Link>
                  </li>
                ))}
              </ul>
              {drafts.length > 3 && (
                <Link to="/admin/blog" className="text-[11px] font-sans font-medium text-accent hover:underline mt-2 inline-block transition-colors duration-150 ease-[var(--ease-out-quart)]">
                  + {drafts.length - 3} more drafts
                </Link>
              )}
            </div>
          )}

          {/* Real Dynamic System Diagnostics */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-[11px] font-semibold tracking-wider text-muted uppercase">
                System Diagnostics
              </h2>
              <button
                type="button"
                onClick={runHealthCheck}
                disabled={isTesting}
                className="text-[11px] font-sans font-medium text-accent hover:underline flex items-center gap-1 cursor-pointer transition-colors duration-150 ease-[var(--ease-out-quart)] active:opacity-80"
              >
                <RefreshCw className={`h-2.5 w-2.5 ${isTesting ? 'animate-spin' : ''}`} />
                Test
              </button>
            </div>
            <div className="rounded-2xl border border-line bg-surface/40 shadow-subtle p-4 space-y-3 font-mono text-xs backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-muted">Database (Supabase)</span>
                {health.connected ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Connected ({health.latencyMs}ms)
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-accent text-[11px]">
                    <AlertCircle className="h-3.5 w-3.5" /> Offline / Local
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-muted">Content Table</span>
                <span className={`text-[11px] ${health.tables.siteContent ? 'text-emerald-400' : 'text-neutral-500'}`}>
                  {health.tables.siteContent ? 'site_content ready' : 'Not verified'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-muted">Storage Bucket</span>
                <span className={`text-[11px] ${health.tables.imagesBucket ? 'text-emerald-400' : 'text-neutral-500'}`}>
                  {health.tables.imagesBucket ? 'images ready' : 'Local URLs active'}
                </span>
              </div>

              <div className="pt-2">
                <Link to="/admin/data" className="text-[11px] font-sans font-medium text-accent hover:underline flex items-center justify-between transition-colors duration-150 ease-[var(--ease-out-quart)] active:opacity-80">
                  Manage backups &amp; schema <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </section>

          {/* Content Overview */}
          <section>
            <h2 className="font-mono text-[11px] font-semibold tracking-wider text-muted uppercase mb-3">
              Content Overview
            </h2>
            <div className="rounded-2xl border border-line bg-surface/40 shadow-subtle p-2 backdrop-blur-sm">
              <div className="flex flex-col space-y-0.5">
                {stats.map((stat) => (
                  <StatItem key={stat.label} {...stat} />
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </AdminPage>
  )
}
