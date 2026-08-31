import {
  BarChart3,
  FileText,
  FolderOpen,
  GraduationCap,
  Link2,
  Milestone,
  Tags,
  Camera,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import AdminPage from '../../components/admin/AdminPage.jsx'
import PublishChecklist from '../../components/admin/PublishChecklist.jsx'
import Card from '../../components/Card.jsx'
import { useContent } from '../../lib/content.jsx'
import { pluralize } from '../../lib/format.js'

function formatActivityDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  )
}

/**
 * Admin landing page.
 *
 * Counts only — no charts and no "views" or "visitors", because there is no analytics and
 * inventing a metric here would be exactly the kind of fake functionality this project
 * avoids. What it does show is the publish path, which is the thing people actually get
 * wrong about a static-site admin panel.
 */

function StatCard({ icon: Icon, label, value, detail, to }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-1 font-display text-3xl leading-none tabular-nums">{value}</p>
        </div>
        <Icon className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
      </div>
      {detail && <p className="mt-3 text-xs text-muted">{detail}</p>}
      <Link
        to={to}
        className="mt-4 inline-block text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-strong"
      >
        Manage
      </Link>
    </Card>
  )
}

export default function Dashboard() {
  const { projects, interests, skills, timeline, socialLinks, projectCategories, activity, photography } =
    useContent()

  const photos = photography?.photos || []

  const publishedProjects = projects.filter((project) => project.published !== false).length
  const configuredLinks = socialLinks.filter((link) => link.url).length
  const totalContent = projects.length + interests.length + skills.length + timeline.length + photos.length

  const stats = [
    {
      icon: FolderOpen,
      label: 'Projects',
      value: projects.length,
      detail: `${publishedProjects} visible on the public site, ${
        projects.length - publishedProjects
      } hidden.`,
      to: '/admin/projects',
    },
    {
      icon: Tags,
      label: 'Categories',
      value: projectCategories.length,
      detail: `${projectCategories.length} project ${pluralize(
        projectCategories.length,
        'category',
      )}.`,
      to: '/admin/taxonomy',
    },
    {
      icon: BarChart3,
      label: 'Research interests',
      value: interests.length,
      detail: 'Shown on the home page and the about page.',
      to: '/admin/profile',
    },
    {
      icon: GraduationCap,
      label: 'Abilities',
      value: skills.length,
      detail: 'Each one is labelled "learning" or "working knowledge".',
      to: '/admin/skills',
    },
    {
      icon: Milestone,
      label: 'Timeline entries',
      value: timeline.length,
      detail: 'The learning-direction sequence on the about page.',
      to: '/admin/timeline',
    },
    {
      icon: Link2,
      label: 'Social links',
      value: socialLinks.length,
      detail:
        configuredLinks === 0
          ? 'None have a real URL yet, so all of them render as placeholders.'
          : `${configuredLinks} with a real URL, ${
              socialLinks.length - configuredLinks
            } still placeholders.`,
      to: '/admin/social',
    },
    {
      icon: FileText,
      label: 'Total content',
      value: totalContent,
      detail: 'Editable records across the main content collections.',
      to: '/admin/data',
    },
    {
      icon: Camera,
      label: 'Photography',
      value: photos.length,
      detail: `${photos.filter((p) => p.featured).length} featured photos.`,
      to: '/admin/photography',
    },
  ]

  return (
    <AdminPage
      title="Dashboard"
      description="Manage your website content. Changes are synced directly to Supabase."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <li key={stat.label}>
            <StatCard {...stat} />
          </li>
        ))}
      </ul>

      <PublishChecklist className="mt-8" />

      <Card className="mt-8 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Recent activity</h2>
            <p className="mt-1 text-sm text-muted">Recent changes saved to database.</p>
          </div>
          <span className="text-xs text-muted">Website status: Live sync active</span>
        </div>
        {activity.length > 0 ? (
          <ul className="mt-4 divide-y divide-line">
            {activity.slice(0, 8).map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-sm first:pt-0 last:pb-0"
              >
                <span>
                  <strong className="font-medium capitalize">{entry.action}</strong>{' '}
                  {entry.type.replace('categories.', '')} “{entry.label}”
                </span>
                <time className="text-xs text-muted" dateTime={entry.at}>
                  {formatActivityDate(entry.at)}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">No admin changes recorded yet.</p>
        )}
      </Card>
    </AdminPage>
  )
}
