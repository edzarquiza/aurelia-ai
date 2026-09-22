import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

function App() {
  const [requestText, setRequestText] = useState('')
  const [error, setError] = useState<string | null>(null)
  // Wired up in Phase 3 once the n8n webhook submission is implemented.
  const isSubmitting = false

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!requestText.trim()) {
      setError('Please describe your request before submitting.')
      return
    }

    setError(null)

    // n8n webhook submission will be implemented in Phase 3.
  }

  return (
    <div className="page">
      <header className="header">
        <h1>OpsFlow AI</h1>
        <p className="subtitle">AI-Powered Operations Support</p>
        <p className="description">
          Describe an operational issue or request and OpsFlow AI will analyze and route it.
        </p>
      </header>

      <main className="content">
        <form className="request-form" onSubmit={handleSubmit}>
          <h2 className="form-heading">How can we help?</h2>

          <label htmlFor="request-text" className="field-label">
            Describe your issue or request
          </label>
          <textarea
            id="request-text"
            className="request-textarea"
            value={requestText}
            onChange={(event) => setRequestText(event.target.value)}
            placeholder="Example: I cannot connect to the company VPN."
            rows={6}
            disabled={isSubmitting}
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Analyzing request...' : 'Submit Request'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default App
