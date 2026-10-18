import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css'
import { ContentProvider } from './lib/content.jsx'
import { ThemeProvider } from './lib/theme'
import { ToastProvider } from './lib/toast'

/**
 * Provider order matters and is not arbitrary:
 *
 *   ToastProvider   — outermost, because ContentProvider reports load problems via toast
 *   ContentProvider — owns the content document
 *   ThemeProvider   — reads settings.defaultTheme and settings.accent from content
 */

// Drop the pre-rendered <!--seo--> tags: <Seo> owns <head> from here, and React 19 does not
// replace foreign tags, so the first route's canonical/robots would survive client navigation.
const isComment = (node, text) => node?.nodeType === Node.COMMENT_NODE && node.data === text
let seoNode = [...document.head.childNodes].find((node) => isComment(node, 'seo'))
while (seoNode && !isComment(seoNode, '/seo')) {
  const next = seoNode.nextSibling
  if (seoNode.nodeType === Node.ELEMENT_NODE) seoNode.remove()
  seoNode = next
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <ContentProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ContentProvider>
    </ToastProvider>
  </StrictMode>,
)
