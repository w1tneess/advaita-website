import { Component } from 'react'
import EmptyState from './EmptyState.jsx'

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
            description="We encountered an unexpected error. Please try refreshing the page."
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
