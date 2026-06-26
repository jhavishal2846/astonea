'use client'

import { useActionState, useState } from 'react'
import { login, type LoginState } from './actions'

const initial: LoginState = {}

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initial)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.email ?? ''}
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-ink focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow] duration-150"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            className="w-full px-3.5 py-2.5 pr-11 rounded-lg border border-border bg-surface text-sm text-ink focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow] duration-150"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-subtle hover:text-ink transition-colors"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-error" role="alert">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full px-5 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
