import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import RequestResult from './components/RequestResult'
import { N8nClientError, submitRequest } from './services/n8nClient'
import type { OpsFlowResponse } from './types/opsflow'

function App() {
  const [requestText, setRequestText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<OpsFlowResponse | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!requestText.trim()) {
      setError('Please describe your request before submitting.')
      return
    }

    setError(null)
    setResult(null)
    setIsSubmitting(true)

    try {
      const response = await submitRequest(requestText)
      setResult(response)
    } catch (err) {
      if (err instanceof N8nClientError) {
        setError(err.message)
      } else {
        setError('Something went wrong while processing your request. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
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

        {result && <RequestResult result={result} />}
      </main>
    </div>
  )
}

export default App
