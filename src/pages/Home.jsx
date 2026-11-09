import { useContent } from '@/lib/content.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import {
  HeroSection,
  SelectedProjectsSection,
  ActiveInquiriesSection,
} from '@/components/features/home'
import NotesSection from '@/components/features/home/NotesSection.jsx'
import RuleSection from '@/components/features/home/RuleSection.jsx'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'home')

export default function Home() {
  const { featuredProjects, philosophy, publicNotes, profile } = useContent()

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/" />
      <HeroSection profile={profile} />
      <RuleSection profile={profile} />
      <NotesSection notes={publicNotes} thinkers={philosophy?.thinkers} />
      <SelectedProjectsSection featuredProjects={featuredProjects} />
      <ActiveInquiriesSection philosophy={philosophy} />
    </>
  )
}
