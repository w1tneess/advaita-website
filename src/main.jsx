import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css'
import { ContentProvider } from './lib/content.jsx'
import { ThemeProvider } from './lib/theme.jsx'
import { ToastProvider } from './lib/toast.jsx'

/**
 * Provider order matters and is not arbitrary:
 *
 *   ToastProvider   — outermost, because ContentProvider reports load problems via toast
 *   ContentProvider — owns the content document
 *   ThemeProvider   — reads settings.defaultTheme and settings.accent from content
 */
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
