import { supabase } from './client.js'

/**
 * ============================================================================
 * Supabase Data API
 * ============================================================================
 */

// --- PROJECTS ---

export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function upsertProject(project) {
  const { data, error } = await supabase
    .from('projects')
    .upsert({
      id: project.id,
      title: project.title,
      slug: project.slug,
      status: project.status,
      summary: project.summary,
      description: project.description,
      project_date: project.projectDate || project.project_date,
      role: project.role,
      visibility: project.visibility,
      published: project.published,
      featured: project.featured,
      links: project.links,
      tools: project.tools,
      methodology: project.methodology,
      limitations: project.limitations,
      published_at: project.published_at
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

// --- NOTES ---

export async function fetchNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function upsertNote(note) {
  const { data, error } = await supabase
    .from('notes')
    .upsert({
      id: note.id,
      title: note.title,
      slug: note.slug,
      excerpt: note.excerpt,
      content: note.content,
      category: note.category,
      status: note.status,
      published_at: note.published_at
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteNote(id) {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw error
}

// --- PHOTOGRAPHY ---

export async function fetchPhotography() {
  const { data, error } = await supabase
    .from('photography')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function upsertPhotography(photo) {
  const { data, error } = await supabase
    .from('photography')
    .upsert({
      id: photo.id,
      title: photo.title,
      caption: photo.caption,
      category: photo.category,
      image_url: photo.image_url,
      storage_path: photo.storage_path,
      alt_text: photo.alt_text,
      featured: photo.featured
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePhotography(id, storagePath) {
  // 1. Delete the image from Storage first
  if (storagePath) {
    const { error: storageError } = await supabase.storage.from('photography').remove([storagePath])
    if (storageError) console.error('Error deleting image from storage:', storageError)
  }

  // 2. Delete the record
  const { error } = await supabase.from('photography').delete().eq('id', id)
  if (error) throw error
}

/**
 * Upload an image file to Supabase Storage and return its public URL and storage path.
 */
export async function uploadImage(file, path) {
  const { data, error } = await supabase.storage
    .from('photography')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: publicUrlData } = supabase.storage
    .from('photography')
    .getPublicUrl(data.path)

  return {
    storagePath: data.path,
    publicUrl: publicUrlData.publicUrl
  }
}

// --- CONTACT FORM ---

export async function submitContactForm({ name, email, topic, message }) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert({
      name,
      email,
      topic,
      message,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

