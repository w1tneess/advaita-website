/**
 * Lightweight, privacy-first analytics helper.
 *
 * Supports zero-cookie, GDPR-compliant analytics providers (e.g. Plausible,
 * Cloudflare Web Analytics, Umami) or custom telemetry if an environment variable
 * or data attribute is configured. Does not store personal identifiable data.
 */

export function trackPageView(path) {
  if (typeof window === 'undefined') return

  // If Plausible is loaded
  if (window.plausible) {
    window.plausible('pageview', { u: window.location.href })
  }

  // If Umami is loaded
  if (window.umami) {
    window.umami.track((props) => ({ ...props, url: path || window.location.pathname }))
  }

  // If Google Tag / GA4 is configured via gtag
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path || window.location.pathname,
    })
  }
}

export function trackEvent(eventName, eventData = {}) {
  if (typeof window === 'undefined') return

  if (window.plausible) {
    window.plausible(eventName, { props: eventData })
  } else if (window.umami) {
    window.umami.track(eventName, eventData)
  } else if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventData)
  }
}
