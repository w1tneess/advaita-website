import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

const DEFAULT_INQUIRIES = [
  {
    category: 'Philosophy & Psychology',
    status: 'Active inquiry',
    title: 'Attention, observation, and mental habits',
    summary:
      'Reading J. Krishnamurti alongside modern cognitive psychology to explore how non-verbal attention affects habits of thought and reaction.',
    locus: 'Philosophy',
    text: 'J. Krishnamurti / Albert Camus',
    link: '/philosophy',
    linkText: 'Read note',
  },
  {
    category: 'History & Data Analysis',
    status: 'Completed study',
    title: 'Terrorism in India: Data Visualisation, 1947–2026',
    summary:
      'A Python data project collecting and visualising records from 1947 to 2026. Highlights where different historical databases conflict and preserves data gaps rather than hiding them.',
    locus: 'Historical Data',
    text: 'Python / Matplotlib',
    link: '/projects',
    linkText: 'View project',
  },
  {
    category: 'Historical Accounts',
    status: 'Documentary inquiry',
    title: 'Osho: Impartial Archival Inquiry',
    summary:
      'An evidence-graded investigative inquiry into Bhagwan Shree Rajneesh (1931–1990) deconstructing his life, teachings, Oregon commune, 1984 bioterror attack, and global legacy across primary sources.',
    locus: 'Web Archive & Primary Sources',
    text: 'Comparative Analysis',
    link: 'https://oshodocumentary.advaitachandra.in/',
    linkText: 'Visit documentary',
  },
  {
    category: 'Computer Systems',
    status: 'Ongoing learning',
    title: 'Fundamentals of Computer Systems & Security',
    summary:
      'Learning the basics of networks, operating systems, and defensive security by building small tools and studying how systems handle failures.',
    locus: 'Systems & Security',
    text: 'Networking / Linux',
    link: '/about',
    linkText: 'View log',
  },
  {
    category: 'Public Policy & Governance',
    status: 'Study notes',
    title: 'Policy Decisions: Costs, Incentives, and Outcomes',
    summary:
      'Notes tracking how policies transition from initial proposals to ground realities in India, looking at budgets, incentives, and measurable results.',
    locus: 'Indian Governance',
    text: 'Policy Analysis',
    link: '/about',
    linkText: 'View log',
  },
]

export default function ActiveInquiriesSection({ philosophy = {} }) {
  const thinkers = philosophy?.thinkers?.slice(0, 5) || [
    { name: 'J. Krishnamurti', role: 'Observer & Mental Habits' },
    { name: 'Albert Camus', role: 'The Absurd as Baseline' },
    { name: 'Fyodor Dostoevsky', role: 'Rational Egoism & Will' },
    { name: 'Ramana Maharshi', role: 'Practical Self-Inquiry' },
    { name: 'Osho', role: 'Competing Historical Narratives' },
  ]

  return (
    <section className="shell pt-[var(--spacing-fluid-section)]" id="inquiries">
      <div className="border-b border-line pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-normal text-ink leading-snug text-balance">
              Currently studying &amp; reading
            </h2>
          </div>
          <div className="max-w-xs md:text-right">
            <p className="text-base text-muted leading-relaxed">
              Notes, studies, and questions I am exploring in philosophy, history, governance, and
              computer systems.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-asymmetric items-start">
        <div className="space-y-[var(--spacing-fluid-lg)] lg:sticky lg:top-12 border-b lg:border-b-0 lg:border-r border-line pb-10 lg:pb-0 lg:pr-[var(--spacing-fluid-md)]">
          <div>
            <h3 className="font-sans text-sm tracking-wide text-ink mb-4">How I Work</h3>
            <p className="text-muted text-base leading-relaxed">
              I study topics through primary sources and datasets. These notes track questions that
              come up across books, official records, and data projects.
            </p>
          </div>

          <div className="pt-8 border-t border-line">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sans text-sm tracking-wide text-ink">Readings &amp; Thinkers</h3>
              <Link
                to="/philosophy"
                className="font-sans text-sm tracking-wide text-ink border-b border-line hover:text-muted hover:border-muted active:opacity-80 transition-all duration-150 ease-[var(--ease-out-quart)] pb-1"
              >
                Reading log &rarr;
              </Link>
            </div>
            <ul className="space-y-5 text-base">
              {thinkers.map((thinker) => (
                <li
                  key={thinker.name}
                  className="flex justify-between items-start gap-6 text-muted"
                >
                  <span className="font-normal whitespace-nowrap text-ink">{thinker.name}</span>
                  <span className="text-right italic">
                    {thinker.description
                      ? thinker.description.split('.')[0].slice(0, 24)
                      : thinker.role || 'Inquiry'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 border-t border-line">
            <h3 className="font-sans text-sm tracking-wide text-ink mb-4">Guiding Rule</h3>
            <blockquote className="text-lg leading-relaxed text-muted italic font-display">
              &ldquo;On this site I try to separate four things: facts from sources, my inferences,
              my opinions, and things I do not know.&rdquo;
            </blockquote>
          </div>
        </div>

        <div className="divide-y divide-line border-t border-b border-line lg:border-t-0 lg:border-b-0">
          {DEFAULT_INQUIRIES.map((item, idx) => (
            <article
              key={idx}
              className="group py-8 sm:py-10 grid gap-4 sm:grid-cols-[1fr_2fr] items-baseline transition-all duration-250 ease-[var(--ease-out-quart)] hover:bg-surface/60 -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl hover:-translate-y-0.5 hover:shadow-subtle active:scale-[0.98] first:pt-4"
            >
              <div className="font-mono text-xs tracking-widest uppercase text-muted font-medium">
                {item.category}
              </div>

              <div>
                <h3 className="text-[length:var(--text-2xl)] font-normal text-ink group-hover:text-muted transition-colors duration-150 ease-[var(--ease-out-quart)] leading-snug mb-3">
                  {item.link?.startsWith('http') ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-baseline gap-3 outline-none"
                    >
                      <span>{item.title}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-all duration-250 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-muted" />
                    </a>
                  ) : (
                    <Link to={item.link} className="inline-flex items-baseline gap-3 outline-none">
                      <span>{item.title}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-250 ease-[var(--ease-out-quart)] -translate-x-3 group-hover:translate-x-0 text-muted" />
                    </Link>
                  )}
                </h3>

                <p className="text-lg text-muted font-sans leading-relaxed max-w-2xl">
                  {item.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
