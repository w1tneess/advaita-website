import {
  CircleDashed,
  CircleDot,
  CircleCheck,
  Eye,
  EyeOff,
  GraduationCap,
  Wrench,
} from 'lucide-react'

import Badge from './Badge.jsx'

/**
 * Status labels for projects, posts and skills.
 *
 * Kept in one place because these labels are load-bearing for honesty: "Concept stage"
 * is the difference between a design and a working product, and it must never be
 * quietly styled to look like a shipped release.
 */

const PROJECT = {
  concept: { label: 'Concept stage', tone: 'opinion', icon: CircleDashed },
  'in-progress': { label: 'In progress', tone: 'accent', icon: CircleDot },
  completed: { label: 'Completed', tone: 'fact', icon: CircleCheck },
}

const POST = {
  draft: { label: 'Draft', tone: 'neutral', icon: EyeOff },
  published: { label: 'Published', tone: 'fact', icon: Eye },
}

const SKILL = {
  learning: { label: 'Learning', tone: 'neutral', icon: GraduationCap },
  'working-knowledge': { label: 'Working knowledge', tone: 'accent', icon: Wrench },
}

const MAPS = { project: PROJECT, post: POST, skill: SKILL }

export default function StatusBadge({ kind = 'project', value, showIcon = true, className = '' }) {
  const entry = MAPS[kind]?.[value]
  if (!entry) return null

  const Icon = entry.icon

  return (
    <Badge tone={entry.tone} className={className}>
      {showIcon && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}
      {entry.label}
    </Badge>
  )
}

/** Published/unpublished state for a project, which is separate from its progress. */
export function VisibilityBadge({ published, className = '' }) {
  return (
    <Badge tone="neutral" className={className}>
      {published ? (
        <Eye className="h-3 w-3 shrink-0" aria-hidden="true" />
      ) : (
        <EyeOff className="h-3 w-3 shrink-0" aria-hidden="true" />
      )}
      {published ? 'Published' : 'Hidden'}
    </Badge>
  )
}
