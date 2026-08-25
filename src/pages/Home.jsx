import { ArrowRight, Check } from 'lucide-react'

import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import EmptyState from '../components/EmptyState.jsx'
import InterestCard from '../components/InterestCard.jsx'
import PostCard from '../components/PostCard.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Section from '../components/Section.jsx'
import Seo from '../components/Seo.jsx'
import { useContent } from '../lib/content.jsx'
import { PUBLIC_ROUTES } from '../lib/routes.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'home')

export default function Home() {
  const { profile, home, settings, featuredProjects, latestPosts, interests } = useContent()

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/" />

      {/* Hero — Deliberately restrained with strong typography hierarchy. */}
      <Container>
        <div className="max-w-3xl py-16 sm:py-24 lg:py-32">
          {home.heroKicker && (
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">{home.heroKicker}</p>
          )}

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {home.heroHeading}
          </h1>

          <p className="mt-6 max-w-prose text-lg leading-relaxed text-foreground-muted sm:text-xl">
            {home.heroIntro}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button to={home.primaryCta.to} size="lg">
              {home.primaryCta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to={home.secondaryCta.to} variant="secondary" size="lg">
              {home.secondaryCta.label}
            </Button>
          </div>

          <p className="mt-12 text-sm text-foreground-muted">
            <span className="font-medium">{profile.name}</span> · {profile.location}
          </p>
        </div>
      </Container>

      <Section
        id="featured"
        tone="raised"
        title={home.featuredHeading}
        intro={home.featuredIntro}
        actions={
          <Button to="/portfolio" variant="secondary" size="sm">
            All projects
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        }
      >
        {featuredProjects.length > 0 ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <li key={project.id} className="h-full">
                <ProjectCard project={project} variant="compact" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No featured projects yet"
            message="Projects marked as featured will appear here."
            action={
              <Button to="/portfolio" variant="secondary" size="sm">
                View the portfolio
              </Button>
            }
          />
        )}
      </Section>

      <Section
        id="latest"
        title={home.postsHeading}
        intro={home.postsIntro}
        actions={
          latestPosts.length > 0 ? (
            <Button to="/blog" variant="secondary" size="sm">
              All writing
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          ) : null
        }
      >
        {latestPosts.length > 0 ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <li key={post.id} className="h-full">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        ) : (
          /* The blog ships empty rather than with invented articles. */
          <EmptyState
            title="Nothing published yet"
            message={settings.blogEmptyState}
            action={
              <Button to="/blog" variant="secondary" size="sm">
                Go to Writing
              </Button>
            }
          />
        )}
      </Section>

      <Section
        id="interests"
        tone="raised"
        title={home.interestsHeading}
        intro={home.interestsIntro}
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interests.map((interest) => (
            <InterestCard key={interest.id} interest={interest} />
          ))}
        </ul>
      </Section>

      <Section id="credibility" title={home.credibilityHeading} width="prose">
        <Card className="p-6 sm:p-8 lg:p-10">
          <p className="text-base leading-relaxed text-foreground">{home.credibilityStatement}</p>

          {(home.credibilityPoints || []).length > 0 && (
            <ul className="mt-8 space-y-3 border-t border-border pt-8">
              {home.credibilityPoints.map((point, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent flex-shrink-0" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Section>
    </>
  )
}
