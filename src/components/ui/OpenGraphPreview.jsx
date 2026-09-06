import { useState } from 'react'
import { Globe, Share2, Twitter, Facebook } from 'lucide-react'

/**
 * Open Graph Social Share Preview component.
 * Allows visitors or content managers to see how a page/blog post will look on social media.
 */
export default function OpenGraphPreview({
  title = 'Advaita — Personal Portfolio & Writing',
  description = 'Exploring philosophy, technology, software development, and visual arts.',
  image = '/og-image.jpg',
  url = 'https://advaitachandra.in',
}) {
  const [platform, setPlatform] = useState('twitter') // 'twitter' | 'facebook'

  const hostName = (() => {
    try {
      return new URL(url).hostname
    } catch {
      return 'advaitachandra.in'
    }
  })()

  return (
    <div className="rounded-2xl border border-line bg-surface/80 p-5 shadow-sm space-y-4 max-w-lg">
      <div className="flex items-center justify-between border-b border-line/40 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-wider">
          <Share2 className="h-4 w-4 text-accent" aria-hidden="true" />
          <span>Open Graph Share Preview</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-raised/50 p-0.5">
          <button
            type="button"
            onClick={() => setPlatform('twitter')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              platform === 'twitter' ? 'bg-surface text-ink shadow-xs' : 'text-muted hover:text-ink'
            }`}
          >
            <Twitter className="h-3.5 w-3.5" aria-hidden="true" />
            <span>X / Twitter</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('facebook')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              platform === 'facebook' ? 'bg-surface text-ink shadow-xs' : 'text-muted hover:text-ink'
            }`}
          >
            <Facebook className="h-3.5 w-3.5" aria-hidden="true" />
            <span>LinkedIn / FB</span>
          </button>
        </div>
      </div>

      {/* Card Preview Box */}
      <div className="overflow-hidden rounded-xl border border-line/70 bg-canvas shadow-md transition-all hover:border-line">
        {/* Card Image */}
        <div className="relative aspect-[1200/630] w-full overflow-hidden bg-raised">
          {image ? (
            <img
              src={image}
              alt="OG Share Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              <Globe className="h-10 w-10 opacity-30" />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-1.5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {hostName}
          </p>
          <h4 className="font-display text-base font-semibold tracking-tight text-ink line-clamp-1">
            {title}
          </h4>
          <p className="text-xs text-muted line-clamp-2 leading-normal">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
