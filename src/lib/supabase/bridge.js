/**
 * Bridge between existing admin panel and Supabase database.
 *
 * The admin panel already exists and works with localStorage.
 * This module intercepts saves and pushes them to Supabase instead.
 */

import { supabase } from './client.js'

/**
 * Save admin content to Supabase (replaces localStorage for persistence)
 */
export async function saveContentToSupabase(content) {
  if (!supabase) return false

  try {
    // Save profile
    if (content.profile) {
      await supabase.from('profile').upsert(content.profile).select().single()
    }

    // Save home
    if (content.home) {
      await supabase.from('home').upsert(content.home).select().single()
    }

    // Save settings
    if (content.settings) {
      await supabase.from('settings').upsert(content.settings).select().single()
    }

    // Save projects
    if (content.projects && Array.isArray(content.projects)) {
      for (const project of content.projects) {
        await supabase.from('projects').upsert(project).select()
      }
    }

    // Save posts
    if (content.posts && Array.isArray(content.posts)) {
      for (const post of content.posts) {
        await supabase.from('posts').upsert(post).select()
      }
    }

    // Save skills
    if (content.skills && Array.isArray(content.skills)) {
      for (const skill of content.skills) {
        await supabase.from('skills').upsert(skill).select()
      }
    }

    // Save timeline
    if (content.timeline && Array.isArray(content.timeline)) {
      for (const item of content.timeline) {
        await supabase.from('timeline').upsert(item).select()
      }
    }

    // Save social links
    if (content.social && Array.isArray(content.social)) {
      for (const link of content.social) {
        await supabase.from('social_links').upsert(link).select()
      }
    }

    // Save interests
    if (content.interests && Array.isArray(content.interests)) {
      for (const interest of content.interests) {
        await supabase.from('interests').upsert(interest).select()
      }
    }

    // Save tags
    if (content.tags && Array.isArray(content.tags)) {
      for (const tag of content.tags) {
        await supabase.from('tags').upsert(tag).select()
      }
    }

    // Save categories
    if (content.categories) {
      // Blog categories
      if (content.categories.blog && Array.isArray(content.categories.blog)) {
        for (const cat of content.categories.blog) {
          await supabase.from('categories').upsert({ ...cat, type: 'blog' }).select()
        }
      }
      // Project categories
      if (content.categories.project && Array.isArray(content.categories.project)) {
        for (const cat of content.categories.project) {
          await supabase.from('categories').upsert({ ...cat, type: 'project' }).select()
        }
      }
    }

    return true
  } catch (error) {
    console.error('Error saving to Supabase:', error)
    return false
  }
}

/**
 * Load content from Supabase
 */
export async function loadContentFromSupabase() {
  if (!supabase) return null

  try {
    const [
      profileData,
      homeData,
      settingsData,
      projectsData,
      postsData,
      skillsData,
      timelineData,
      socialData,
      interestsData,
      tagsData,
      categoriesData,
    ] = await Promise.all([
      supabase.from('profile').select().single(),
      supabase.from('home').select().single(),
      supabase.from('settings').select().single(),
      supabase.from('projects').select(),
      supabase.from('posts').select(),
      supabase.from('skills').select(),
      supabase.from('timeline').select(),
      supabase.from('social_links').select(),
      supabase.from('interests').select(),
      supabase.from('tags').select(),
      supabase.from('categories').select(),
    ])

    return {
      profile: profileData.data || {},
      home: homeData.data || {},
      settings: settingsData.data || {},
      projects: projectsData.data || [],
      posts: postsData.data || [],
      skills: skillsData.data || [],
      timeline: timelineData.data || [],
      social: socialData.data || [],
      interests: interestsData.data || [],
      tags: tagsData.data || [],
      categories: {
        blog: (categoriesData.data || []).filter((c) => c.type === 'blog'),
        project: (categoriesData.data || []).filter((c) => c.type === 'project'),
      },
    }
  } catch (error) {
    console.error('Error loading from Supabase:', error)
    return null
  }
}
