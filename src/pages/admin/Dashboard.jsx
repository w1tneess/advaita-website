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
import Card from '@/components/ui/Card.jsx'
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
    <Link to={to} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#181a1a] transition-all group">
      <div className="flex items-center gap-3 text-xs font-mono">
        <div className="p-2 rounded-md bg-[#161818] text-neutral-400 group-hover:text-[#D1B18A] transition-colors border border-[#242626]">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-neutral-300 group-hover:text-[#E8E6E1] uppercase tracking-wider">{label}</span>
      </div>
      <span className="font-mono text-xs text-[#D1B18A] font-semibold">{value}</span>
    </Link>
  )
}

function QuickAction({ icon: Icon, label, description, to }) {
  return (
    <Link 
      to={to} 
      className="relative overflow-hidden flex flex-col p-5 rounded-xl border border-[#242626] bg-[#121414] hover:bg-[#161818] hover:border-[#D1B18A]/50 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-[#181a1a] border border-[#292a2a] group-hover:border-[#D1B18A] group-hover:text-[#D1B18A] text-neutral-400 transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-neutral-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#D1B18A] transition-all" />
      </div>
      <h3 className="font-display text-base font-normal text-[#E8E6E1] group-hover:text-[#D1B18A] transition-colors">{label}</h3>
      <p className="font-mono text-[11px] text-neutral-500 mt-1">{description}</p>
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
                description="Draft a new blog post or essay" 
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
              <h2 className="font-mono text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
                Recent Messages
              </h2>
              <Link to="/admin/messages" className="font-mono text-xs text-[#D1B18A] hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <Card className="p-0 overflow-hidden border-[#242626] bg-[#121414] shadow-xl">
              {messages.length > 0 ? (
                <div className="divide-y divide-[#242626]">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-4 hover:bg-[#161818] transition-colors">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-medium text-xs text-[#E8E6E1] font-mono">{msg.name}</span>
                        <span className="text-[10px] font-mono text-neutral-500">
                          {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(msg.created_at))}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-[#D1B18A] mb-1.5">{msg.email} {msg.topic && `• ${msg.topic}`}</p>
                      <p className="text-xs text-neutral-300 font-light line-clamp-2">{msg.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs font-mono text-neutral-500 flex flex-col items-center">
                  <MessageSquare className="h-7 w-7 mb-2.5 opacity-20 text-[#D1B18A]" />
                  No messages received yet.
                </div>
              )}
            </Card>
          </section>

          {/* Activity Feed */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
                Recent Activity
              </h2>
              <span className="text-[11px] font-mono text-neutral-400 bg-[#141616] border border-[#242626] px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${isRemote ? 'bg-emerald-400' : 'bg-[#D1B18A]'} animate-pulse`} />
                {isRemote ? 'Cloud Synced' : 'Local Storage'}
              </span>
            </div>
            <Card className="p-0 overflow-hidden border-[#242626] bg-[#121414] shadow-xl">
              {activity.length > 0 ? (
                <ul className="divide-y divide-[#242626]">
                  {activity.slice(0, 5).map((entry) => (
                    <li key={entry.id} className="p-3.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs hover:bg-[#161818] transition-colors">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-neutral-500" />
                        <span className="text-neutral-300 font-mono">
                          <strong className="font-semibold text-[#D1B18A] capitalize">{entry.action}</strong>{' '}
                          {entry.type.replace('categories.', '')} “{entry.label}”
                        </span>
                      </div>
                      <time className="text-[11px] font-mono text-neutral-500" dateTime={entry.at}>
                        {formatActivityDate(entry.at)}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-8 text-center text-xs font-mono text-neutral-500">No recent edits recorded.</p>
              )}
            </Card>
          </section>

        </div>

        {/* Right Column: Overview & System Diagnostics */}
        <div className="lg:col-span-4 space-y-8">
          
          {drafts.length > 0 && (
            <Card className="p-4 border-[#D1B18A]/30 bg-[#D1B18A]/5">
              <h3 className="font-mono text-xs font-semibold text-[#D1B18A] flex items-center gap-2 mb-2 uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5" />
                Drafts in Progress
              </h3>
              <ul className="space-y-1.5">
                {drafts.slice(0, 3).map(draft => (
                  <li key={draft.id}>
                    <Link to={`/admin/blog/${draft.id}`} className="text-xs text-neutral-300 hover:text-[#E8E6E1] hover:underline line-clamp-1">
                      {draft.title || 'Untitled Draft'}
                    </Link>
                  </li>
                ))}
              </ul>
              {drafts.length > 3 && (
                <Link to="/admin/blog" className="text-[10px] font-mono text-[#D1B18A] hover:underline mt-2 inline-block">
                  + {drafts.length - 3} more drafts
                </Link>
              )}
            </Card>
          )}

          {/* Real Dynamic System Diagnostics */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
                System Diagnostics
              </h2>
              <button
                type="button"
                onClick={runHealthCheck}
                disabled={isTesting}
                className="text-[10px] font-mono text-[#D1B18A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`h-2.5 w-2.5 ${isTesting ? 'animate-spin' : ''}`} />
                Test
              </button>
            </div>
            <Card className="p-4 border-[#242626] bg-[#121414] shadow-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#242626] pb-2.5">
                <span className="text-neutral-400">Database (Supabase)</span>
                {health.connected ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Connected ({health.latencyMs}ms)
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[#D1B18A] text-[11px]">
                    <AlertCircle className="h-3.5 w-3.5" /> Offline / Local
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-b border-[#242626] pb-2.5">
                <span className="text-neutral-400">Content Table</span>
                <span className={`text-[11px] ${health.tables.siteContent ? 'text-emerald-400' : 'text-neutral-500'}`}>
                  {health.tables.siteContent ? 'site_content ready' : 'Not verified'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#242626] pb-2.5">
                <span className="text-neutral-400">Storage Bucket</span>
                <span className={`text-[11px] ${health.tables.imagesBucket ? 'text-emerald-400' : 'text-neutral-500'}`}>
                  {health.tables.imagesBucket ? 'images ready' : 'Local URLs active'}
                </span>
              </div>

              <div className="pt-2">
                <Link to="/admin/data" className="text-[11px] text-[#D1B18A] hover:underline flex items-center justify-between">
                  Manage backups &amp; schema <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          </section>

          {/* Content Overview */}
          <section>
            <h2 className="font-mono text-[11px] font-bold tracking-widest text-neutral-500 uppercase mb-3">
              Content Overview
            </h2>
            <Card className="p-1.5 border-[#242626] bg-[#121414] shadow-xl">
              <div className="flex flex-col space-y-0.5">
                {stats.map((stat) => (
                  <StatItem key={stat.label} {...stat} />
                ))}
              </div>
            </Card>
          </section>

        </div>
      </div>
    </AdminPage>
  )
}
