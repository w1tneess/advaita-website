import { useContent } from '@/lib/content.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import {
  HeroSection,
  SelectedProjectsSection,
  ActiveInquiriesSection,
  CorrespondenceSection,
} from '@/components/features/home'
import NotesSection from '@/components/features/home/NotesSection.jsx'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'home')

export default function Home() {
  const { featuredProjects, philosophy, publicNotes, publicProjects, profile } = useContent()

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/" />
      <HeroSection profile={profile} notes={publicNotes} projects={publicProjects} />
      <NotesSection notes={publicNotes} thinkers={philosophy?.thinkers} />
      <SelectedProjectsSection featuredProjects={featuredProjects} />
      <ActiveInquiriesSection philosophy={philosophy} />
      <CorrespondenceSection />
    </>
  )
}
