import { useMemo, useCallback } from 'react'
import { byNewest, byOrder } from '../lib/format.js'

/**
 * Encapsulates the derivation of display-ready collections from raw site content.
 * Moving this out of ContentProvider keeps the main store clean and prevents
 * massive re-renders when mutations occur.
 */
export function useDerivedContent(content, previewDrafts) {
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

  return {
    settings,
    projects,
    publicProjects,
    featuredProjects,
    interests,
    skills,
    timeline,
    socialLinks,
    blog,
    publicBlogPosts,
    publicSocialLinks,
    skillGroups,
    findProjectBySlug,
    findBlogPostBySlug,
  }
}
