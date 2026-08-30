import { HardDrive, Info, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useContent } from '../../lib/content.jsx'

/**
 * Explains, on every admin page, exactly where the edits are going.
 *
 * Three separate facts that are easy to conflate:
 *   1. Edits are saved in this browser's localStorage — nowhere else.
 *   2. localStorage is not secure storage. It is readable by any script on this origin.
 *   3. Saving here does not change the live site. That takes an export and a commit.
 */
export default function LocalOnlyNotice({ className = '' }) {
  const { isLocal, storageAvailable, seedIsNewer } = useContent()

  if (!storageAvailable) {
    return (
      <div className={`rounded-card border border-limitation/40 bg-limitation/10 p-4 ${className}`}>
        <p className="flex items-start gap-2.5 text-sm">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-limitation" aria-hidden="true" />
          <span>
            <strong className="font-semibold">This browser is blocking local storage.</strong> You
            can still edit and export, but nothing will survive a page reload. Private or incognito
            windows are the usual cause.
          </span>
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-card border border-line bg-surface p-4 ${className}`}>
      <p className="flex items-start gap-2.5 text-sm">
        <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <span>
          {isLocal ? (
            <>
              <strong className="font-semibold">Editing a local copy.</strong> Your changes are
              saved in this browser only. Export a publish bundle, then commit it through GitHub.
            </>
          ) : (
            <>
              <strong className="font-semibold">Showing checked-in content.</strong> Nothing has
              been edited in this browser yet. The first change you save creates a local copy.
            </>
          )}{' '}
          Local storage is not secure storage: never put a password, an API key or anything private
          into these fields.{' '}
          <Link to="/admin/data" className="text-accent underline underline-offset-4">
            Export or reset
          </Link>
          .
        </span>
      </p>

      {seedIsNewer && (
        <p className="mt-3 flex items-start gap-2.5 border-t border-line pt-3 text-sm text-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            The deployed site&rsquo;s default content is newer than your local copy. Your edits have
            been kept — nothing was overwritten. To adopt the new defaults instead, use{' '}
            <Link to="/admin/data" className="text-accent underline underline-offset-4">
              Reset demo data
            </Link>
            , which discards local changes.
          </span>
        </p>
      )}
    </div>
  )
}
