/**
 * Domain types and interfaces for Advaita Website content architecture.
 * Provides static type safety across projects, philosophy, photography, blog, and Supabase sync.
 */

export interface ProjectLinks {
  repository: string | null
  live: string | null
  writeup: string | null
}

export interface ProjectMethodology {
  title: string
  detail: string
}

export interface Project {
  id: string
  slug: string
  title: string
  categories: string[]
  summary?: string
  description?: string
  role?: string
  tools?: string[]
  status?: string
  visibility?: string
  published: boolean
  featured?: boolean
  order?: number
  methodology?: ProjectMethodology[]
  limitations?: string[]
  links?: ProjectLinks
  link?: string
  url?: string
}

export interface BlogItem {
  id: string
  slug: string
  title: string
  category: string
  excerpt: string
  content: string
  date: string
  published: boolean
  readingTime?: number
  tags?: string[]
}

export interface PhilosophyThinker {
  name: string
  description: string
  url?: string
}

export interface PhilosophyNote {
  id: string
  slug: string
  title: string
  thinker: string
  date: string
  category: string
  excerpt: string
  body: string
  published: boolean
}

export interface PhilosophyState {
  intro: string
  description: string
  thinkers: PhilosophyThinker[]
  notesIntro: string
  notesDescription: string
  notes: PhilosophyNote[]
}

export interface PhotoItem {
  id: string
  title: string
  caption: string
  date: string
  category: string
  image: string
  location?: string
  camera?: string
  aperture?: string
  exposure?: string
  focalLength?: string
  published: boolean
  featured?: boolean
}

export interface PhotoCategory {
  id: string
  label: string
}

export interface PhotographyState {
  intro: string
  description: string
  note: string
  categoriesNote: string
  categories: PhotoCategory[]
  photos: PhotoItem[]
}

export interface ProfileState {
  name: string
  tagline: string
  bio: string
  location: string
  email: string
  avatar?: string
}

export interface HomeState {
  heroIntro: string
  heroStatement: string
  credibilityStatement: string
}

export interface TimelineItem {
  year: string | number
  phase: string
  title: string
  detail: string
}

export interface SkillItem {
  category: string
  items: string[]
}

export interface ActivityEntry {
  id: string
  action: 'created' | 'edited' | 'updated' | 'deleted' | 'reordered'
  type: string
  label: string
  at: string
}

export interface SiteContentDocument {
  schemaVersion: number
  seedVersion: number
  profile: ProfileState
  home: HomeState
  projects: Project[]
  categories?: Record<string, string[]>
  skills?: SkillItem[]
  timeline?: TimelineItem[]
  social?: Record<string, string>
  settings?: Record<string, unknown>
  interests?: Array<{ title: string; detail: string }>
  philosophy: PhilosophyState
  photography: PhotographyState
  blog: BlogItem[]
  activity?: ActivityEntry[]
}

export interface LoadDocumentResult {
  doc: SiteContentDocument
  source: 'seed' | 'local' | 'remote'
  warning: string | null
}
