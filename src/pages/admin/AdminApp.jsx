import { Route, Routes } from 'react-router-dom'

import AdminAuth from '../../components/admin/AdminAuth.jsx'
import Button from '../../components/Button.jsx'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import Dashboard from './Dashboard.jsx'
import DataManager from './DataManager.jsx'
import HomeEditor from './HomeEditor.jsx'
import BlogList from './BlogList.jsx'
import BlogEditor from './BlogEditor.jsx'
import ProfileEditor from './ProfileEditor.jsx'
import ProjectEditor from './ProjectEditor.jsx'
import ProjectsList from './ProjectsList.jsx'
import SettingsEditor from './SettingsEditor.jsx'
import SkillsEditor from './SkillsEditor.jsx'
import SocialEditor from './SocialEditor.jsx'
import Taxonomy from './Taxonomy.jsx'
import TimelineEditor from './TimelineEditor.jsx'
import MessagesList from './MessagesList.jsx'

/**
 * The whole admin panel, in one lazily-loaded module.
 *
 * App.jsx mounts this at /admin/*, so every path below is relative to /admin. Keeping the
 * admin routes here rather than in App.jsx is what lets the entire editor become a
 * separate chunk that a normal visitor never downloads.
 */

function AdminNotFound() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Admin page not found</h1>
      <p className="mt-3 text-sm text-muted">
        That admin URL does not exist. Use the navigation, or go back to the dashboard.
      </p>
      <Button to="/admin" variant="secondary" className="mt-6">
        Dashboard
      </Button>
    </div>
  )
}

export default function AdminApp() {
  return (
    <AdminAuth>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfileEditor />} />
          <Route path="home" element={<HomeEditor />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:id" element={<ProjectEditor />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:id" element={<BlogEditor />} />
          <Route path="taxonomy" element={<Taxonomy />} />
          <Route path="skills" element={<SkillsEditor />} />
          <Route path="timeline" element={<TimelineEditor />} />
          <Route path="social" element={<SocialEditor />} />
          <Route path="settings" element={<SettingsEditor />} />
          <Route path="messages" element={<MessagesList />} />
          <Route path="data" element={<DataManager />} />
          <Route path="*" element={<AdminNotFound />} />
        </Route>
      </Routes>
    </AdminAuth>
  )
}
