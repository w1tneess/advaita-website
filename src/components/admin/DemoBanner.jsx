import { ShieldAlert } from 'lucide-react'

/**
 * The required, unconditional warning on every local editor page.
 */
export default function DemoBanner() {
  return (
    <div className="border-b border-limitation/30 bg-limitation/10">
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-5 py-2.5 sm:px-8">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
        <p className="text-xs leading-relaxed sm:text-sm">
          <strong className="font-semibold">Local editorial workspace.</strong> This browser
          editor never contains GitHub credentials. Export a publish bundle and commit it through
          your authenticated Codespace or GitHub interface.
        </p>
      </div>
    </div>
  )
}
