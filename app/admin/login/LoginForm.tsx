'use client'

import { useActionState } from 'react'
import { login, type LoginState } from './actions'

const initial: LoginState = {}

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initial)

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
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-ink focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow] duration-150"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-ink-subtle mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm text-ink focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow] duration-150"
        />
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
