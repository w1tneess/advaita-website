import { Database } from 'lucide-react'
import Card from '../Card.jsx'

export default function PublishChecklist({ className = '' }) {
  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-base font-semibold">Live Sync Active</h2>
      <p className="mt-1.5 text-sm text-muted">
        Changes made in the admin panel are immediately saved to the Supabase database and are live
        on your website.
      </p>

      <div className="mt-5 flex items-center gap-3 rounded-lg border border-line bg-surface p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Database className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium">Supabase Database Connected</p>
          <p className="mt-0.5 text-sm text-muted">
            Vercel deployments fetch the latest data automatically.
          </p>
        </div>
      </div>
    </Card>
  )
}
