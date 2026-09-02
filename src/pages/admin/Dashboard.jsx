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
  FolderGit2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import Card from '../../components/Card.jsx'
import { useContent } from '../../lib/content.jsx'
import { supabase } from '../../lib/supabase/client.js'

function formatActivityDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  )
}

function StatItem({ icon: Icon, label, value, to }) {
  return (
    <Link to={to} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/60 transition-all group">
      <div className="flex items-center gap-3 text-sm">
        <div className="p-2 rounded-md bg-zinc-900 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-950 transition-colors border border-zinc-800">
          <Icon className="h-4 w-4" />
        </div>
        <span className="font-medium text-zinc-300 group-hover:text-zinc-100">{label}</span>
      </div>
      <span className="font-mono text-sm text-zinc-500">{value}</span>
    </Link>
  )
}

function QuickAction({ icon: Icon, label, description, to, colorClass }) {
  return (
    <Link 
      to={to} 
      className={`relative overflow-hidden flex flex-col p-5 rounded-xl border border-zinc-800 bg-[#0a0a0a] hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 group ${colorClass}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:bg-zinc-100 group-hover:border-zinc-200 group-hover:text-zinc-950 text-zinc-300 transition-colors z-10">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="h-4 w-4 text-zinc-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-zinc-300 transition-all z-10" />
      </div>
      <h3 className="font-semibold text-zinc-100 z-10">{label}</h3>
      <p className="text-xs text-zinc-500 mt-1 z-10">{description}</p>
    </Link>
  )
}

export default function Dashboard() {
  const {
    projects,
    interests,
    skills,
    timeline,
    socialLinks,
    projectCategories,
    activity,
    photography,
    blog = [],
  } = useContent()

  const [messages, setMessages] = useState([])

  useEffect(() => {
    async function loadMessages() {
      const { data } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3)
      if (data) setMessages(data)
    }
    loadMessages()
  }, [])

  const photos = photography?.photos || []

  const stats = [
    { icon: FileText, label: 'Blog posts', value: blog.length, to: '/admin/blog' },
    { icon: FolderOpen, label: 'Projects', value: projects.length, to: '/admin/projects' },
    { icon: Camera, label: 'Photography', value: photos.length, to: '/admin/photography' },
    { icon: Tags, label: 'Categories', value: projectCategories.length, to: '/admin/taxonomy' },
    { icon: BarChart3, label: 'Interests', value: interests.length, to: '/admin/profile' },
    { icon: GraduationCap, label: 'Abilities', value: skills.length, to: '/admin/skills' },
    { icon: Milestone, label: 'Timeline', value: timeline.length, to: '/admin/timeline' },
    { icon: Link2, label: 'Links', value: socialLinks.length, to: '/admin/social' },
  ]

  const drafts = blog.filter((post) => post.status === 'draft')

  return (
    <AdminPage
      title="Dashboard"
      description="Manage your website content. Changes are synced directly to Supabase."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Primary Actions & Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quick Actions */}
          <section>
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuickAction 
                icon={FileText} 
                label="Write Post" 
                description="Draft a new article" 
                to="/admin/blog/new"
                colorClass="group-hover:text-accent"
              />
              <QuickAction 
                icon={FolderGit2} 
                label="Add Project" 
                description="Showcase your work" 
                to="/admin/projects/new"
              />
              <QuickAction 
                icon={Camera} 
                label="Upload Photo" 
                description="Publish to gallery" 
                to="/admin/photography/new"
              />
            </div>
          </section>

          {/* Recent Messages */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">Recent Messages</h2>
              <Link to="/admin/messages" className="text-xs text-accent hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <Card className="p-0 overflow-hidden border-zinc-800/60 bg-[#0a0a0a] shadow-lg">
              {messages.length > 0 ? (
                <div className="divide-y divide-zinc-800/60">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-4 hover:bg-zinc-900/50 transition-colors">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-medium text-sm text-zinc-200">{msg.name}</span>
                        <span className="text-xs text-zinc-500">
                          {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(msg.created_at))}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mb-2">{msg.email} {msg.topic && `• ${msg.topic}`}</p>
                      <p className="text-sm text-zinc-300 line-clamp-2">{msg.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-zinc-500 flex flex-col items-center">
                  <MessageSquare className="h-8 w-8 mb-3 opacity-20" />
                  No messages received yet.
                </div>
              )}
            </Card>
          </section>

          {/* Activity Feed */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">Recent Activity</h2>
              <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                Live sync active
              </span>
            </div>
            <Card className="p-0 overflow-hidden border-zinc-800/60 bg-[#0a0a0a] shadow-lg">
              {activity.length > 0 ? (
                <ul className="divide-y divide-zinc-800/60">
                  {activity.slice(0, 5).map((entry) => (
                    <li key={entry.id} className="p-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm hover:bg-zinc-900/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-zinc-500" />
                        <span className="text-zinc-300">
                          <strong className="font-medium capitalize">{entry.action}</strong>{' '}
                          {entry.type.replace('categories.', '')} “{entry.label}”
                        </span>
                      </div>
                      <time className="text-xs text-zinc-500" dateTime={entry.at}>
                        {formatActivityDate(entry.at)}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-8 text-center text-sm text-zinc-500">No admin changes recorded yet.</p>
              )}
            </Card>
          </section>

        </div>

        {/* Right Column: Overview & Publishing */}
        <div className="lg:col-span-4 space-y-8">
          
          {drafts.length > 0 && (
            <Card className="p-5 border-opinion/30 bg-opinion/5">
              <h3 className="text-sm font-semibold text-opinion flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4" />
                Drafts in progress
              </h3>
              <ul className="space-y-2">
                {drafts.slice(0, 3).map(draft => (
                  <li key={draft.id}>
                    <Link to={`/admin/blog/${draft.id}`} className="text-sm hover:text-accent hover:underline line-clamp-1">
                      {draft.title || 'Untitled Draft'}
                    </Link>
                  </li>
                ))}
              </ul>
              {drafts.length > 3 && (
                <Link to="/admin/blog" className="text-xs text-muted hover:text-accent mt-3 inline-block">
                  + {drafts.length - 3} more drafts
                </Link>
              )}
            </Card>
          )}

          <section>
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase mb-4">Content Overview</h2>
            <Card className="p-2 border-zinc-800/60 bg-[#0a0a0a] shadow-lg">
              <div className="flex flex-col space-y-1">
                {stats.map((stat) => (
                  <StatItem key={stat.label} {...stat} />
                ))}
              </div>
            </Card>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase mb-4">System Status</h2>
            <Card className="p-5 border-zinc-800/60 bg-[#0a0a0a] shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Database Connection</span>
                <span className="flex items-center gap-2 text-sm text-green-500 font-medium">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div> Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Storage Bucket</span>
                <span className="flex items-center gap-2 text-sm text-green-500 font-medium">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div> Active
                </span>
              </div>
              <div className="pt-4 border-t border-zinc-800/60">
                <Link to="/admin/data" className="text-xs text-accent hover:underline flex items-center justify-between">
                  Manage database backups <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          </section>

        </div>
      </div>
    </AdminPage>
  )
}
