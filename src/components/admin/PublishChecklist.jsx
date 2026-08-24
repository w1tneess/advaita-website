import { Download } from 'lucide-react'
import { Link } from 'react-router-dom'

import Card from '../Card.jsx'

/**
 * The actual route from an edit here to a change on the live site.
 *
 * Marking something "Published" in this panel sets a real field that the public pages
 * filter on — that part is not a pretence. What it does not do is deploy. This checklist
 * exists so that distinction is never left implicit.
 */

const STEPS = [
  {
    title: 'Edit and save here',
    detail:
      'Changes are stored in this browser. The public pages in this browser update immediately, so you can check your work.',
  },
  {
    title: 'Export the JSON',
    detail: 'Data → Export. You get one file containing the whole content document.',
  },
  {
    title: 'Put the content into the repository',
    detail:
      'Split the exported values back into the matching files in src/data/ (profile.json, projects.json, posts.json, and so on), or keep the export as a record and edit those files directly.',
  },
  {
    title: 'Commit and push',
    detail: 'Push to the main branch of the repository the site is deployed from.',
  },
  {
    title: 'Let the workflow rebuild',
    detail:
      'The GitHub Actions workflow builds the site and publishes it to GitHub Pages. Until it finishes, the live site still shows the previous content.',
  },
]

export default function PublishChecklist({ className = '' }) {
  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-base font-semibold">How to actually publish</h2>
      <p className="mt-1.5 text-sm text-muted">
        Saving in this panel does not change the live site. This is the sequence that does.
      </p>

      <ol className="mt-5 space-y-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line font-mono text-xs text-muted"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{step.title}</p>
              <p className="mt-0.5 text-sm text-muted">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 border-t border-line pt-5 text-sm">
        <Link
          to="/admin/data"
          className="inline-flex items-center gap-1.5 font-medium text-accent underline underline-offset-4 hover:text-accent-strong"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Go to Data to export
        </Link>
      </p>
    </Card>
  )
}
