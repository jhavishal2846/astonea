'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { requestReplyOtp, postSubmitterReply } from '../_actions'

/**
 * Three-state composer:
 *   collapsed  → "Post a follow-up" button only
 *   composing  → message body + "Send code" button (no OTP field yet)
 *   verifying  → OTP input + "Post reply" submit
 */
export default function ReplyForm({
  token,
  locale,
  submitterEmail,
  submitterPhone,
}: {
  token: string
  locale: string
  submitterEmail: string
  submitterPhone: string
}) {
  const router = useRouter()
  const tg = useTranslations()
  const [state, setState] = useState<'collapsed' | 'composing' | 'verifying'>('collapsed')
  const [channel, setChannel] = useState<'email' | 'sms'>('email')
  const [body, setBody] = useState('')
  const [code, setCode] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [destinationMasked, setDestinationMasked] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  // intentionally unused; locale prop is passed through for future
  // template/translation routing on the server
  void locale
  void submitterEmail
  void submitterPhone

  function sendCode(targetChannel: 'email' | 'sms') {
    setError(null)
    setChannel(targetChannel)
    startTransition(async () => {
      const res = await requestReplyOtp(token, targetChannel)
      if ('error' in res) {
        setError(res.error)
        return
      }
      setDestinationMasked(res.destinationMasked)
      setState('verifying')
    })
  }

  function handleStartCompose() {
    setError(null)
    setBody('')
    setCode('')
    setFiles([])
    setState('composing')
  }

  function handleRequestCode(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) {
      setError(tg('support.reply.required'))
      return
    }
    sendCode(channel)
  }

  function handlePost(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const fd = new FormData()
    fd.set('body', body)
    fd.set('code', code)
    fd.set('channel', channel)
    for (const f of files) fd.append('attachments', f)
    startTransition(async () => {
      const res = await postSubmitterReply(token, fd)
      if ('error' in res) {
        setError(res.error)
        return
      }
      setState('collapsed')
      setBody('')
      setCode('')
      setFiles([])
      router.refresh()
    })
  }

  if (state === 'collapsed') {
    return (
      <button
        type="button"
        onClick={handleStartCompose}
        className="w-full py-3.5 rounded-2xl border border-dashed text-sm font-semibold transition-all hover:bg-slate-50"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
      >
        {tg('support.reply.start')}
      </button>
    )
  }

  return (
    <form
      onSubmit={state === 'composing' ? handleRequestCode : handlePost}
      className="rounded-2xl border bg-white p-5 space-y-4"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-ink-muted)' }}>
          {tg('support.reply.your_reply')}
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          disabled={state === 'verifying'}
          required
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 transition-all resize-none disabled:opacity-60"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-ink-muted)' }}>
          {tg('support.reply.attachments')}
        </label>
        <input
          type="file"
          multiple
          disabled={state === 'verifying'}
          accept="application/pdf,image/*,text/*"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="text-xs"
        />
      </div>

      {state === 'verifying' && (
        <div className="p-4 rounded-xl bg-slate-50 border" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs mb-2" style={{ color: 'var(--color-ink-muted)' }}>
            {tg('support.reply.code_sent_to')} <strong>{destinationMasked}</strong>. {tg('support.reply.code_expires')}
          </p>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="••••••"
            className="w-full px-3 py-2 rounded-lg border text-center font-mono tracking-[0.32em] text-base outline-none focus:ring-2 transition-all"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
            required
          />
          <div className="flex items-center justify-between mt-3 text-xs">
            <button
              type="button"
              onClick={() => sendCode(channel === 'email' ? 'sms' : 'email')}
              disabled={pending}
              className="underline-offset-2 hover:underline"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              {channel === 'email' ? tg('support.reply.switch_to_sms') : tg('support.reply.switch_to_email')}
            </button>
            <button
              type="button"
              onClick={() => {
                setState('composing')
                setCode('')
                setError(null)
              }}
              disabled={pending}
              className="underline-offset-2 hover:underline"
              style={{ color: 'var(--color-ink-muted)' }}
            >
              {tg('support.reply.edit_message')}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setState('collapsed')
            setError(null)
          }}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          {tg('support.reply.cancel')}
        </button>
        <button
          type="submit"
          disabled={pending || (state === 'verifying' && code.length !== 6)}
          className="px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--color-primary)' }}
        >
          {pending
            ? state === 'composing'
              ? tg('support.reply.sending_state')
              : tg('support.reply.posting_state')
            : state === 'composing'
            ? tg('support.reply.send_code')
            : tg('support.reply.post')}
        </button>
      </div>
    </form>
  )
}
