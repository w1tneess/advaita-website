import { ShieldAlert } from 'lucide-react'

/**
 * The required, unconditional warning on every authenticated admin page.
 */
export default function DemoBanner() {
  return (
    <div className="border-b border-limitation/30 bg-limitation/10">
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-5 py-2.5 sm:px-8">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-limitation" aria-hidden="true" />
        <p className="text-xs leading-relaxed sm:text-sm">
          <strong className="font-semibold">Frontend-only admin panel.</strong> The password
          gate is a browser-level privacy measure, not secure production authentication. Edits
          remain in this browser only; there is no server or database.
        </p>
      </div>
    </div>
  )
}
