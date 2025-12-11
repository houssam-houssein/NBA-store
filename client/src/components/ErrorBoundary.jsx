import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          color: '#fff',
          padding: '40px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Something went wrong</h1>
          <p style={{ marginBottom: '20px', opacity: 0.8 }}>
            {this.state.error && this.state.error.toString()}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null })
              window.location.href = '/'
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Go to Homepage
          </button>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details style={{ marginTop: '20px', maxWidth: '800px' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>Error Details</summary>
              <pre style={{
                backgroundColor: '#1a1a1a',
                padding: '20px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

