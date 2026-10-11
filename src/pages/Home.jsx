import { useContent } from '@/lib/content.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import {
  HeroSection,
  SelectedProjectsSection,
  ActiveInquiriesSection,
  CorrespondenceSection,
} from '@/components/features/home'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'home')

export default function Home() {
  const { featuredProjects, philosophy, publicSocialLinks, profile } = useContent()

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/" />
      <HeroSection profile={profile} />
      <SelectedProjectsSection featuredProjects={featuredProjects} />
      <ActiveInquiriesSection philosophy={philosophy} />
      <CorrespondenceSection publicSocialLinks={publicSocialLinks} />
    </>
  )
}
