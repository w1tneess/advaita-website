import { Component } from 'react'
import EmptyState from './EmptyState.jsx'
import Button from './Button.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-canvas px-6">
          <EmptyState
            title="Something went wrong"
            description={
              <>
                We encountered an unexpected error. Please try refreshing the page.
                {import.meta.env?.DEV && this.state.error && (
                  <div className="mt-4 p-4 text-left font-mono text-xs text-red-500 bg-red-500/10 rounded overflow-auto max-w-full">
                    {this.state.error.toString()}
                  </div>
                )}
              </>
            }
            action={
              <div className="flex items-center justify-center gap-4 mt-2">
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  Reload page
                </Button>
                <Button variant="primary" onClick={() => window.location.href = '/'}>
                  Go home
                </Button>
              </div>
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
