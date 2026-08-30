import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { createSeedDocument } from '../data/seed.js'
import { byNewest, byOrder } from './format.js'
import {
  clearDocument,
  loadDocument,
  saveDocument,
  seedIsNewerThan,
  storageAvailable,
} from './store.js'
import { useToast } from './toast.jsx'

/**
 * The content store shared by the public site and the local admin editor.
 *
 * Both read from the same document. The public pages filter to published items;
 * the admin sees everything. Preview mode lets the admin temporarily view the public
 * pages with drafts included.
 */

const ContentContext = createContext(null)

/* --------------------------------------------------------------------------
   Immutable path helpers — 'categories.blog' addresses a nested collection.
   -------------------------------------------------------------------------- */

function getPath(source, path) {
  return path.split('.').reduce((accumulator, key) => accumulator?.[key], source)
}

/** Returns a shallow-cloned copy of `source` with `path` set to `value`. */
function setPath(source, path, value) {
  const keys = path.split('.')
  const root = Array.isArray(source) ? [...source] : { ...source }

  let cursor = root
  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index]
    const child = cursor[key]
    cursor[key] = Array.isArray(child) ? [...child] : { ...child }
    cursor = cursor[key]
  }

  cursor[keys[keys.length - 1]] = value
  return root
}

/** Rewrite `order` to match array position, so ordering is always 1..n with no gaps. */
function renumber(collection) {
  return collection.map((item, index) =>
    item.order === index + 1 ? item : { ...item, order: index + 1 },
  )
}

function recordActivity(document, action, type, item) {
  const activity = Array.isArray(document.activity) ? document.activity : []
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    action,
    type,
    label: item?.title || item?.name || item?.label || type,
    at: new Date().toISOString(),
  }
  return { ...document, activity: [entry, ...activity].slice(0, 100) }
}

export function ContentProvider({ children }) {
  const toast = useToast()

  const [isLoaded, setIsLoaded] = useState(false)
  const initial = useRef(null)

  const [content, setContent] = useState(null)
  const [isLocal, setIsLocal] = useState(false) // represents if we are using remote DB
  const [previewDrafts, setPreviewDrafts] = useState(false)

  // Anything queued here is written by the effect below.
  const pending = useRef(null)
  const warningShown = useRef(false)

  useEffect(() => {
    async function init() {
      try {
        const state = await loadDocument()
        initial.current = state
        setContent(state.doc)
        setIsLocal(state.source === 'remote')
        setIsLoaded(true)

        if (!warningShown.current && state.warning) {
          warningShown.current = true
          toast.error(state.warning)
        }
      } catch (error) {
        console.error('Failed to load content', error)
        toast.error('Failed to load content from database')
      }
    }
    init()
  }, [toast])

  // Persist after the state change, not inside the updater: updaters must stay pure,
  // and React invokes them twice in development StrictMode.
  useEffect(() => {
    if (pending.current === null) return
    const document = pending.current
    pending.current = null

    async function persist() {
      const result = await saveDocument(document)
      if (result.ok) setIsLocal(true)
      else toast.error(result.error)
    }
    persist()
  }, [content, toast])

  const commit = useCallback((updater) => {
    setContent((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater
      pending.current = next
      return next
    })
  }, [])

  /* ------------------------------------------------------------------------
     Mutations
     ------------------------------------------------------------------------ */

  /** Insert or replace an item by id, appending new items at the end. */
  const upsertItem = useCallback(
    (path, item) => {
      commit((document) => {
        const collection = getPath(document, path) || []
        const index = collection.findIndex((existing) => existing.id === item.id)
        const next =
          index === -1
            ? [...collection, item]
            : collection.map((existing) => (existing.id === item.id ? item : existing))
        const nextDocument = setPath(document, path, renumber(next))
        return recordActivity(nextDocument, index === -1 ? 'created' : 'edited', path, item)
      })
    },
    [commit],
  )

  const removeItem = useCallback(
    (path, id) => {
      commit((document) => {
        const collection = getPath(document, path) || []
        const next = collection.filter((item) => item.id !== id)
        const removed = collection.find((item) => item.id === id)
        const nextDocument = setPath(document, path, renumber(next))
        return recordActivity(nextDocument, 'deleted', path, removed)
      })
    },
    [commit],
  )

  /** Merge a partial update into one item. */
  const patchItem = useCallback(
    (path, id, patch) => {
      commit((document) => {
        const collection = getPath(document, path) || []
        const next = collection.map((item) => (item.id === id ? { ...item, ...patch } : item))
        const nextDocument = setPath(document, path, next)
        const updated = next.find((item) => item.id === id)
        return recordActivity(nextDocument, 'updated', path, updated)
      })
    },
    [commit],
  )

  /** Move an item by `delta` positions (-1 up, +1 down). No-op at the boundaries. */
  const moveItem = useCallback(
    (path, id, delta) => {
      commit((document) => {
        const collection = byOrder(getPath(document, path) || [])
        const from = collection.findIndex((item) => item.id === id)
        if (from === -1) return document

        const to = from + delta
        if (to < 0 || to >= collection.length) return document

        const next = [...collection]
        ;[next[from], next[to]] = [next[to], next[from]]
        const nextDocument = setPath(document, path, renumber(next))
        const moved = next.find((item) => item.id === id)
        return recordActivity(nextDocument, 'reordered', path, moved)
      })
    },
    [commit],
  )

  /** Merge a partial update into a top-level object section (profile, home, settings). */
  const setSection = useCallback(
    (key, patch) => {
      commit((document) => {
        const nextDocument = { ...document, [key]: { ...document[key], ...patch } }
        return recordActivity(nextDocument, 'updated', key, nextDocument[key])
      })
    },
    [commit],
  )

  /** Replace the whole document — used by JSON import. */
  const replaceDocument = useCallback(
    (document) => {
      commit(document)
    },
    [commit],
  )

  /** Discard local edits and return to the deployed seed content. */
  const resetDocument = useCallback(() => {
    const result = clearDocument()
    if (!result.ok && storageAvailable()) {
      toast.error(result.error)
      return false
    }
    pending.current = null
    setContent(createSeedDocument())
    setIsLocal(false)
    return true
  }, [toast])

  /* ------------------------------------------------------------------------
     Derived views
     ------------------------------------------------------------------------ */

  const settings = content?.settings ?? {}

  const projects = useMemo(() => byOrder(content?.projects ?? []), [content?.projects])

  const publicProjects = useMemo(
    () => (previewDrafts ? projects : projects.filter((project) => project.published !== false)),
    [projects, previewDrafts],
  )

  const featuredProjects = useMemo(
    () =>
      publicProjects
        .filter((project) => project.featured)
        .slice(0, settings.featuredProjectLimit ?? 3),
    [publicProjects, settings.featuredProjectLimit],
  )

  const interests = useMemo(() => byOrder(content?.interests ?? []), [content?.interests])
  const skills = useMemo(() => byOrder(content?.skills ?? []), [content?.skills])
  const timeline = useMemo(() => byOrder(content?.timeline ?? []), [content?.timeline])
  const socialLinks = useMemo(() => byOrder(content?.social ?? []), [content?.social])
  const blog = useMemo(() => byNewest(content?.blog ?? [], 'published_at'), [content?.blog])

  const publicBlogPosts = useMemo(
    () => (previewDrafts ? blog : blog.filter((post) => post.status === 'published')),
    [blog, previewDrafts],
  )

  /** Social links to show publicly: visible ones, including unconfigured placeholders. */
  const publicSocialLinks = useMemo(
    () => socialLinks.filter((link) => link.visible !== false),
    [socialLinks],
  )

  /** Skills grouped for display, preserving the ordering within each group. */
  const skillGroups = useMemo(() => {
    const groups = new Map()
    for (const skill of skills) {
      const key = skill.group || 'Other'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(skill)
    }
    return [...groups.entries()].map(([name, items]) => ({ name, items }))
  }, [skills])

  const findProjectBySlug = useCallback(
    (slug) => publicProjects.find((project) => project.slug === slug) ?? null,
    [publicProjects],
  )

  const findBlogPostBySlug = useCallback(
    (slug) => publicBlogPosts.find((post) => post.slug === slug) ?? null,
    [publicBlogPosts],
  )

  const value = useMemo(
    () => ({
      // Raw document — the admin panel edits this.
      content,
      profile: content?.profile,
      home: content?.home,
      settings,
      philosophy: content?.philosophy || {},
      photography: content?.photography || {},
      projectCategories: content?.categories?.project,

      // Admin-facing collections (everything, including drafts).
      projects,
      interests,
      skills,
      timeline,
      socialLinks,
      blog,

      // Public-facing views.
      publicProjects,
      featuredProjects,
      publicSocialLinks,
      skillGroups,
      publicBlogPosts,
      findProjectBySlug,
      findBlogPostBySlug,

      // Mutations.
      upsertItem,
      removeItem,
      patchItem,
      moveItem,
      setSection,
      replaceDocument,
      resetDocument,
      activity: content?.activity ?? [],

      // Storage state.
      isLocal,
      storageAvailable: true, // Supabase is always available over network
      hasLocalDocument: isLocal, // If source is remote, we have a document
      seedIsNewer: content ? seedIsNewerThan(content) : false,

      // Preview mode.
      previewDrafts,
      setPreviewDrafts,
    }),
    [
      content,
      settings,
      projects,
      interests,
      skills,
      timeline,
      socialLinks,
      blog,
      publicProjects,
      featuredProjects,
      publicSocialLinks,
      skillGroups,
      publicBlogPosts,
      findProjectBySlug,
      findBlogPostBySlug,
      upsertItem,
      removeItem,
      patchItem,
      moveItem,
      setSection,
      replaceDocument,
      resetDocument,
      isLocal,
      previewDrafts,
    ],
  )

  if (!isLoaded) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <p className="text-sm text-muted animate-pulse">Loading...</p>
      </div>
    )
  }

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) throw new Error('useContent must be used inside <ContentProvider>.')
  return context
}
