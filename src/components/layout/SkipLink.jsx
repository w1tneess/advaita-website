/**
 * Keyboard shortcut past the navigation. First focusable element on the page;
 * visually hidden until focused.
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only-focusable absolute top-3 left-3 z-50 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent shadow-raised"
    >
      Skip to main content
    </a>
  )
}
