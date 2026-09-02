import { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, FolderGit2, Home, MessageSquare, 
  Settings, Tags, User, Camera 
} from 'lucide-react'

import { useContent } from '../../lib/content.jsx'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { blog, projects } = useContent()

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command) => {
    setOpen(false)
    command()
  }

  // Styles for CMDK elements are injected globally or directly
  return (
    <>
      <style>{`
        [cmdk-overlay] {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 50;
        }
        [cmdk-dialog] {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          max-width: 640px;
          z-index: 51;
          padding: 1rem;
        }
        [cmdk-root] {
          width: 100%;
          background: var(--color-surface);
          border: 1px solid var(--color-line);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
        }
        [cmdk-input] {
          width: 100%;
          font-size: 1rem;
          padding: 1.25rem;
          border: none;
          border-bottom: 1px solid var(--color-line);
          background: transparent;
          color: var(--color-ink);
          outline: none;
        }
        [cmdk-input]::placeholder {
          color: var(--color-muted);
        }
        [cmdk-list] {
          max-height: 300px;
          overflow-y: auto;
          padding: 0.5rem;
        }
        [cmdk-group-heading] {
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-muted);
          font-weight: 600;
        }
        [cmdk-item] {
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          color: var(--color-ink);
          transition: background 0.1s ease;
        }
        [cmdk-item][aria-selected='true'] {
          background: var(--color-raised);
          color: var(--color-ink);
        }
        [cmdk-item] svg {
          color: var(--color-muted);
        }
        [cmdk-item][aria-selected='true'] svg {
          color: var(--color-accent);
        }
        [cmdk-empty] {
          padding: 2rem;
          text-align: center;
          color: var(--color-muted);
          font-size: 0.875rem;
        }
      `}</style>
      <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
        <Command.Input placeholder="Search posts, projects, or commands..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Navigation">
            <Command.Item onSelect={() => runCommand(() => navigate('/admin'))}>
              <Home className="h-4 w-4" /> Dashboard
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => navigate('/admin/messages'))}>
              <MessageSquare className="h-4 w-4" /> Messages
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => navigate('/admin/settings'))}>
              <Settings className="h-4 w-4" /> Settings
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => navigate('/admin/profile'))}>
              <User className="h-4 w-4" /> Profile & Interests
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => navigate('/admin/taxonomy'))}>
              <Tags className="h-4 w-4" /> Categories & Tags
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Quick Actions">
            <Command.Item onSelect={() => runCommand(() => navigate('/admin/blog/new'))}>
              <FileText className="h-4 w-4" /> Create New Post
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => navigate('/admin/projects/new'))}>
              <FolderGit2 className="h-4 w-4" /> Create New Project
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => navigate('/admin/photography/new'))}>
              <Camera className="h-4 w-4" /> Upload Photo
            </Command.Item>
          </Command.Group>

          {blog?.length > 0 && (
            <Command.Group heading="Blog Posts">
              {blog.slice(0, 5).map((post) => (
                <Command.Item 
                  key={post.id} 
                  onSelect={() => runCommand(() => navigate(`/admin/blog/${post.id}`))}
                >
                  <FileText className="h-4 w-4" />
                  {post.title || 'Untitled Post'}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {projects?.length > 0 && (
            <Command.Group heading="Projects">
              {projects.slice(0, 5).map((project) => (
                <Command.Item 
                  key={project.id} 
                  onSelect={() => runCommand(() => navigate(`/admin/projects/${project.id}`))}
                >
                  <FolderGit2 className="h-4 w-4" />
                  {project.title || 'Untitled Project'}
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command.Dialog>
    </>
  )
}
