import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './utils/supabase'
import './App.css'

type AuthView = 'email' | 'check-email' | 'password'

function App() {
  const [view, setView] = useState<AuthView>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleGoogleSignIn() {
    setError('')
    setMessage('')
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setView('check-email')
      setMessage('We sent a sign-in link to your email.')
    }

    setIsLoading(false)
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setPassword('')
    }

    setIsLoading(false)
  }

  async function handleSignOut() {
    setError('')
    setMessage('')
    await supabase.auth.signOut()
  }

  if (user) {
    return (
      <main className="auth-shell">
        <section className="session-panel" aria-label="Current session">
          <span className="eyebrow">Signed in</span>
          <h1>Welcome back.</h1>
          <p>{user.email}</p>
          <button type="button" className="secondary-button" onClick={handleSignOut}>
            Sign out
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="brand-mark" aria-hidden="true">
          S
        </div>

        {view === 'email' && (
          <>
            <span className="eyebrow">Supabase auth POC</span>
            <h1 id="auth-title">Sign in to continue.</h1>
            <p className="lede">Use Google or get a secure email sign-in link.</p>

            <button
              type="button"
              className="google-button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <span className="google-icon" aria-hidden="true">
                G
              </span>
              Continue with Google
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <form className="auth-form" onSubmit={handleEmailSubmit}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button type="submit" className="primary-button" disabled={isLoading}>
                {isLoading ? 'Sending link...' : 'Continue with email'}
              </button>
            </form>
          </>
        )}

        {view === 'check-email' && (
          <>
            <span className="eyebrow">Check your inbox</span>
            <h1 id="auth-title">Follow the email instructions.</h1>
            <p className="lede">
              Open the message we sent to <strong>{email}</strong> to complete sign in.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => setView('password')}
            >
              Continue with password
            </button>
            <button type="button" className="text-button" onClick={() => setView('email')}>
              Use another email
            </button>
          </>
        )}

        {view === 'password' && (
          <>
            <span className="eyebrow">Password sign in</span>
            <h1 id="auth-title">Enter your password.</h1>
            <p className="lede">Use the same email address, then finish with your password.</p>

            <form className="auth-form" onSubmit={handlePasswordSubmit}>
              <label htmlFor="password-email">Email address</label>
              <input
                id="password-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button type="submit" className="primary-button" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <button type="button" className="text-button" onClick={() => setView('email')}>
              Back to sign in options
            </button>
          </>
        )}

        {message && <p className="status-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </section>
    </main>
  )
}

export default App
