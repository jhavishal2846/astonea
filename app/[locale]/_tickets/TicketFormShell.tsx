'use client'

import {
  useState,
  useTransition,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { COUNTRIES, DEFAULT_COUNTRY_ISO2 } from '@/lib/tickets/countries'
import { requestSubmissionOtp, submitTicket } from './_actions'

/**
 * Two-step OTP-gated ticket form, shared by /contact-us, /career, and
 * /support/new. Caller supplies copy, extra fields, success card render, and a
 * `classes` bag scoped to its own design surface (dark for contact, light for
 * career/support).
 *
 * Step 1 (`details`)  → requestSubmissionOtp sends SMS.
 * Step 2 (`otp`)      → 6-box code input, resend cooldown, channel switch.
 * Step 3 (`done`)     → caller's renderSuccess.
 *
 * Internal-only polish (no caller breaking changes): step indicator, 6-cell
 * OTP input with paste support + auto-advance focus, 30s resend countdown,
 * loading spinner inside the submit button.
 */

const OTP_LENGTH = 6
const RESEND_COOLDOWN_SECS = 30

export type ExtraField =
  | { kind: 'text'; name: string; label: string; required?: boolean; placeholder?: string }
  | { kind: 'select'; name: string; label: string; required?: boolean; options: Array<{ value: string; label: string }> }
  | { kind: 'file'; name: 'attachments'; label: string; accept?: string; required?: boolean; help?: string }

export type TicketFormShellProps = {
  source: 'support_form'
  defaultCategorySlug?: string | null
  categoryOptions?: Array<{ slug: string; label: string }>
  extraFields?: ExtraField[]
  submitLabel: string
  renderSuccess: (props: { statusHref: string; shortCode: string }) => ReactNode
  classes: {
    label: string
    input: string
    select: string
    textarea: string
    button: string
    secondaryLink: string
    hintMuted: string
    errorBox: string
    otpBox: string
  }
}

export default function TicketFormShell(props: TicketFormShellProps) {
  const params = useParams<{ locale: string }>()
  const locale = params?.locale ?? 'en'
  const tg = useTranslations()

  const [step, setStep] = useState<'details' | 'otp' | 'done'>('details')
  const [otpChannel, setOtpChannel] = useState<'sms' | 'email'>('sms')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [successInfo, setSuccessInfo] = useState<{ token: string; shortCode: string } | null>(null)
  const [resendIn, setResendIn] = useState(0)

  const [form, setForm] = useState<Record<string, string>>({
    name: '',
    email: '',
    phone: '',
    countryIso2: DEFAULT_COUNTRY_ISO2,
    company: '',
    city: '',
    message: '',
    subject: '',
    categorySlug: props.defaultCategorySlug ?? '',
    ...Object.fromEntries((props.extraFields ?? []).map((f) => [f.name, ''])),
  })
  const [files, setFiles] = useState<File[]>([])

  // Resend countdown ticker.
  useEffect(() => {
    if (resendIn <= 0) return
    const id = window.setTimeout(() => setResendIn((n) => Math.max(0, n - 1)), 1000)
    return () => window.clearTimeout(id)
  }, [resendIn])

  function update<K extends string>(name: K, value: string) {
    setForm((s) => ({ ...s, [name]: value }))
  }

  function buildFormData(): FormData {
    const fd = new FormData()
    for (const [k, v] of Object.entries(form)) fd.set(k, v)
    fd.set('source', props.source)
    fd.set('locale', locale)
    fd.set('otpChannel', otpChannel)
    for (const f of files) fd.append('attachments', f)
    return fd
  }

  function preflight(): string | null {
    if (!form.name.trim()) return tg('ticket.validation.name_required')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return tg('ticket.validation.email_invalid')
    if (!form.phone.trim()) return tg('ticket.validation.phone_required')
    if (form.message.trim().length < 5) return tg('ticket.validation.message_short')
    for (const f of props.extraFields ?? []) {
      if (!f.required) continue
      if (f.kind === 'text' && !(form[f.name] ?? '').trim()) return tg('ticket.validation.field_required', { label: f.label })
      if (f.kind === 'select' && !(form[f.name] ?? '')) return tg('ticket.validation.field_select', { label: f.label.toLowerCase() })
      if (f.kind === 'file' && files.length === 0) return tg('ticket.validation.field_required', { label: f.label })
    }
    return null
  }

  function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const issue = preflight()
    if (issue) {
      setError(issue)
      return
    }
    startTransition(async () => {
      const res = await requestSubmissionOtp(buildFormData())
      if ('error' in res) {
        setError(res.error)
        return
      }
      setStep('otp')
      setResendIn(RESEND_COOLDOWN_SECS)
    })
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (code.length !== OTP_LENGTH) {
      setError(tg('ticket.otp.enter_full', { length: OTP_LENGTH }))
      return
    }
    const fd = buildFormData()
    fd.set('code', code)
    startTransition(async () => {
      const res = await submitTicket(fd)
      if ('error' in res) {
        setError(res.error)
        return
      }
      setSuccessInfo({ token: res.token, shortCode: res.shortCode })
      setStep('done')
    })
  }

  function handleResend(channel: 'sms' | 'email') {
    if (resendIn > 0 && channel === otpChannel) return
    setOtpChannel(channel)
    setError(null)
    setCode('')
    const fd = buildFormData()
    fd.set('otpChannel', channel)
    startTransition(async () => {
      const res = await requestSubmissionOtp(fd)
      if ('error' in res) {
        setError(res.error)
        return
      }
      setResendIn(RESEND_COOLDOWN_SECS)
    })
  }

  if (step === 'done' && successInfo) {
    const href = `/${locale}/support/${successInfo.token}`
    return <>{props.renderSuccess({ statusHref: href, shortCode: successInfo.shortCode })}</>
  }

  const country = COUNTRIES.find((c) => c.iso2 === form.countryIso2) ?? COUNTRIES[0]

  if (step === 'otp') {
    const destinationDisplay =
      otpChannel === 'sms'
        ? `+${country.dial} ${maskPhone(form.phone)}`
        : maskEmail(form.email)
    return (
      <form onSubmit={handleVerify} className="space-y-5" noValidate>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <StepIndicator
          current={2}
          stepLabels={[tg('ticket.step.details'), tg('ticket.step.verify')]}
          ariaLabel={tg('ticket.step.aria')}
        />

        <div className={props.classes.otpBox}>
          <p className="text-sm leading-relaxed mb-1 opacity-80">
            {otpChannel === 'sms' ? tg('ticket.otp.sent_sms') : tg('ticket.otp.sent_email')}
          </p>
          <p className="text-sm font-semibold mb-4 break-all">{destinationDisplay}</p>
          <OtpCells value={code} onChange={setCode} length={OTP_LENGTH} />
          <p className={`${props.classes.hintMuted} mt-3 text-center`}>
            {resendIn > 0 ? (
              tg('ticket.otp.expires', { seconds: resendIn })
            ) : (
              <>{tg('ticket.otp.didnt_get')}{' '}
                <button
                  type="button"
                  onClick={() => handleResend(otpChannel)}
                  className={`${props.classes.secondaryLink} font-semibold`}
                  disabled={pending}
                >
                  {tg('ticket.otp.resend')}
                </button>
              </>
            )}
          </p>
        </div>

        {error && <ErrorAlert className={props.classes.errorBox} message={error} />}

        <SubmitButton className={props.classes.button} pending={pending} disabled={code.length !== OTP_LENGTH} workingLabel={tg('ticket.button.working')}>
          {tg('ticket.otp.verify_submit')}
        </SubmitButton>

        <div className="flex items-center justify-between text-xs gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setStep('details')
              setError(null)
              setCode('')
            }}
            className={props.classes.secondaryLink}
            disabled={pending}
          >
            {tg('ticket.otp.edit_details')}
          </button>
          <button
            type="button"
            onClick={() => handleResend(otpChannel === 'sms' ? 'email' : 'sms')}
            className={props.classes.secondaryLink}
            disabled={pending}
          >
            {otpChannel === 'sms' ? tg('ticket.otp.switch_to_email') : tg('ticket.otp.switch_to_sms')}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleRequestOtp} className="space-y-5" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <StepIndicator
        current={1}
        stepLabels={[tg('ticket.step.details'), tg('ticket.step.verify')]}
        ariaLabel={tg('ticket.step.aria')}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={tg('ticket.field.name')} required className={props.classes.label}>
          <input
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={props.classes.input}
            placeholder={tg('ticket.field.name_placeholder')}
          />
        </Field>
        <Field label={tg('ticket.field.email')} required className={props.classes.label}>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value.toLowerCase())}
            className={props.classes.input}
            placeholder={tg('ticket.field.email_placeholder')}
          />
        </Field>
      </div>

      <Field label={tg('ticket.field.mobile')} required className={props.classes.label} hint={tg('ticket.field.mobile_hint')}>
        <div className="flex gap-2 items-stretch">
          <CountryPicker
            value={form.countryIso2}
            onChange={(iso2) => update('countryIso2', iso2)}
            triggerClassName={props.classes.select}
          />
          <input
            type="tel"
            required
            autoComplete="tel-national"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder={tg('ticket.field.mobile_placeholder')}
            className={`${props.classes.input} flex-1 min-w-0`}
          />
        </div>
      </Field>

      {(props.extraFields ?? []).map((f) => (
        <Field
          key={f.name}
          label={f.label}
          required={f.required}
          className={props.classes.label}
          hint={f.kind === 'file' ? f.help : undefined}
        >
          {f.kind === 'text' && (
            <input
              type="text"
              required={f.required}
              placeholder={f.placeholder}
              value={form[f.name] ?? ''}
              onChange={(e) => update(f.name, e.target.value)}
              className={props.classes.input}
            />
          )}
          {f.kind === 'select' && (
            <select
              required={f.required}
              value={form[f.name] ?? ''}
              onChange={(e) => update(f.name, e.target.value)}
              className={props.classes.select}
            >
              <option value="">{tg('ticket.field.select_placeholder')}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
          {f.kind === 'file' && (
            <input
              type="file"
              required={f.required}
              accept={f.accept}
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className={`${props.classes.input} cursor-pointer file:mr-3 file:border-0 file:rounded-md file:px-3 file:py-1.5 file:text-xs file:font-semibold file:bg-current/10`}
            />
          )}
        </Field>
      ))}

      {props.categoryOptions && props.categoryOptions.length > 0 && (
        <Field label={tg('ticket.field.department')} className={props.classes.label}>
          <select
            value={form.categorySlug}
            onChange={(e) => update('categorySlug', e.target.value)}
            className={props.classes.select}
          >
            <option value="" disabled hidden>
              {tg('ticket.field.department_placeholder')}
            </option>
            {props.categoryOptions.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </Field>
      )}

      <Field label={tg('ticket.field.message')} required className={props.classes.label}>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          className={props.classes.textarea}
          placeholder={tg('ticket.field.message_placeholder')}
        />
      </Field>

      {error && <ErrorAlert className={props.classes.errorBox} message={error} />}

      <SubmitButton className={props.classes.button} pending={pending} workingLabel={tg('ticket.button.working')}>
        {props.submitLabel}
      </SubmitButton>

      <p className={`${props.classes.hintMuted} text-center`}>
        {tg('ticket.disclaimer.step1')}
      </p>
    </form>
  )
}

/* ─── internal components ───────────────────────────────────────────────── */

function Field({
  label,
  required,
  hint,
  children,
  className,
}: {
  label: string
  required?: boolean
  hint?: string
  children: ReactNode
  className: string
}) {
  return (
    <div>
      <label className={className}>
        {label}
        {required && <span className="ml-0.5 opacity-70">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs opacity-60">{hint}</p>}
    </div>
  )
}

function StepIndicator({
  current,
  stepLabels,
  ariaLabel,
}: {
  current: 1 | 2
  stepLabels: [string, string]
  ariaLabel: string
}) {
  return (
    <ol className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest opacity-80" aria-label={ariaLabel}>
      <li className={`flex items-center gap-1.5 ${current === 1 ? '' : 'opacity-50'}`}>
        <Pip filled={current >= 1} done={current > 1}>1</Pip>
        <span>{stepLabels[0]}</span>
      </li>
      <li className="flex-1 h-px bg-current opacity-20" aria-hidden />
      <li className={`flex items-center gap-1.5 ${current === 2 ? '' : 'opacity-50'}`}>
        <Pip filled={current >= 2}>2</Pip>
        <span>{stepLabels[1]}</span>
      </li>
    </ol>
  )
}

function Pip({ filled, done, children }: { filled: boolean; done?: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
        filled ? 'bg-current text-bg' : 'border border-current/40'
      }`}
      style={{ background: filled ? 'currentColor' : undefined }}
    >
      <span className={filled ? 'mix-blend-difference text-white' : ''}>{done ? '✓' : children}</span>
    </span>
  )
}

function SubmitButton({
  className,
  pending,
  disabled,
  workingLabel,
  children,
}: {
  className: string
  pending: boolean
  disabled?: boolean
  workingLabel: string
  children: ReactNode
}) {
  return (
    <button type="submit" disabled={pending || disabled} className={className}>
      <span className="inline-flex items-center justify-center gap-2">
        {pending && <Spinner />}
        <span>{pending ? workingLabel : children}</span>
      </span>
    </button>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-30" />
      <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function ErrorAlert({ className, message }: { className: string; message: string }) {
  return (
    <div className={className} role="alert" aria-live="polite">
      {message}
    </div>
  )
}

function OtpCells({
  value,
  onChange,
  length,
}: {
  value: string
  onChange: (v: string) => void
  length: number
  /** Accepted but no longer used — cells use currentColor-based styling so they adapt to the surrounding form theme without inheriting conflicting widths (w-full / padding) from the design system's input class. */
  inputClassName?: string
}) {
  const tg = useTranslations()
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const digits = useMemo(() => {
    const out = new Array<string>(length).fill('')
    for (let i = 0; i < Math.min(value.length, length); i++) out[i] = value[i] ?? ''
    return out
  }, [value, length])

  // Focus first empty cell on mount.
  useEffect(() => {
    const first = digits.findIndex((d) => !d)
    refs.current[first === -1 ? 0 : first]?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setAt(i: number, ch: string) {
    const next = digits.slice()
    next[i] = ch
    onChange(next.join('').slice(0, length))
  }

  function handleInput(i: number) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '')
      if (!raw) {
        setAt(i, '')
        return
      }
      // Accept multi-char input (autofill / paste-into-single-cell).
      if (raw.length > 1) {
        const merged = (digits.slice(0, i).join('') + raw).slice(0, length).padEnd(length, '')
        onChange(merged.replace(/\s/g, '').slice(0, length).replace(/[^0-9]/g, ''))
        const nextIdx = Math.min(i + raw.length, length - 1)
        refs.current[nextIdx]?.focus()
        return
      }
      setAt(i, raw)
      if (i < length - 1) refs.current[i + 1]?.focus()
    }
  }

  function handleKeyDown(i: number) {
    return (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[i] && i > 0) {
        refs.current[i - 1]?.focus()
        setAt(i - 1, '')
        e.preventDefault()
      } else if (e.key === 'ArrowLeft' && i > 0) {
        refs.current[i - 1]?.focus()
        e.preventDefault()
      } else if (e.key === 'ArrowRight' && i < length - 1) {
        refs.current[i + 1]?.focus()
        e.preventDefault()
      }
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!text) return
    e.preventDefault()
    onChange(text)
    refs.current[Math.min(text.length, length - 1)]?.focus()
  }

  return (
    <div className="flex gap-1.5 sm:gap-2.5 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={length /* allow paste of full code into one cell */}
          value={d}
          onChange={handleInput(i)}
          onKeyDown={handleKeyDown(i)}
          onFocus={(e) => e.target.select()}
          aria-label={tg('ticket.otp.cell_aria', { index: i + 1, length })}
          className="w-10 h-12 sm:w-12 sm:h-14 min-w-0 text-center font-mono text-lg sm:text-2xl rounded-xl border-2 border-current/15 bg-transparent text-current focus:outline-none focus:border-current/15 focus:ring-0 caret-current p-0"
        />
      ))}
    </div>
  )
}

/**
 * Custom country picker: native <select> on Windows ignores any styled width
 * (renders OS-chrome dropdown at element width, full-page if w-full leaks in
 * from the design system) and has no search across 60 countries. This is a
 * button + popover combobox: fixed-width trigger styled like an input, a 5-row
 * scrollable list, type-to-filter, arrow keys + Enter to select, Esc to close,
 * click-outside to dismiss.
 *
 * The trigger inherits the form's `classes.select` so it visually matches the
 * surrounding inputs (dark on contact-us, light elsewhere). The popover stays
 * light/high-contrast regardless of the form theme — popovers should be
 * legible, not aesthetically consistent with a dark form.
 */
function CountryPicker({
  value,
  onChange,
  triggerClassName,
}: {
  value: string
  onChange: (iso2: string) => void
  triggerClassName: string
}) {
  const tg = useTranslations()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selected = COUNTRIES.find((c) => c.iso2 === value) ?? COUNTRIES[0]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return COUNTRIES
    const qDigits = q.replace(/^\+/, '')
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso2.toLowerCase().includes(q) ||
        c.dial.startsWith(qDigits),
    )
  }, [search])

  // Click-outside dismisses. mousedown (not click) so the popover closes
  // before any other clicked element processes the event.
  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  // Focus the search field whenever the popover opens; reset state on close.
  useEffect(() => {
    if (open) {
      searchRef.current?.focus()
      setHighlighted(0)
    } else {
      setSearch('')
    }
  }, [open])

  // Keep the highlighted row visible as the user arrows through filter results.
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.children[highlighted] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [highlighted, open])

  function selectAt(i: number) {
    const c = filtered[i]
    if (!c) return
    onChange(c.iso2)
    setOpen(false)
  }

  function handleSearchKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1))
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      setHighlighted((h) => Math.max(h - 1, 0))
      e.preventDefault()
    } else if (e.key === 'Enter') {
      selectAt(highlighted)
      e.preventDefault()
    } else if (e.key === 'Escape') {
      setOpen(false)
      e.preventDefault()
    }
  }

  return (
    <div ref={rootRef} className="relative flex-none w-28">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${triggerClassName} w-full! text-left font-mono text-sm flex items-center justify-between gap-1 cursor-pointer`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={tg('ticket.country.aria_label', { dial: selected.dial, iso2: selected.iso2 })}
      >
        <span>+{selected.dial} {selected.iso2}</span>
        <span className="opacity-50 text-xs leading-none" aria-hidden>▾</span>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 w-[min(18rem,calc(100vw-2rem))] z-50 rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setHighlighted(0)
              }}
              onKeyDown={handleSearchKey}
              placeholder={tg('ticket.country.search_placeholder')}
              className="w-full px-3 py-2 rounded-lg text-sm bg-slate-50 border border-transparent focus:bg-white focus:border-slate-300 outline-none"
            />
          </div>
          <div ref={listRef} className="max-h-60 overflow-y-auto" role="listbox" aria-label={tg('ticket.country.list_aria')}>
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-sm text-center text-slate-500">{tg('ticket.country.no_matches')}</p>
            ) : (
              filtered.map((c, i) => (
                <button
                  key={c.iso2}
                  type="button"
                  onClick={() => selectAt(i)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`w-full px-3 py-2 text-sm text-left flex items-center gap-3 ${
                    i === highlighted ? 'bg-slate-100' : 'bg-white'
                  } ${c.iso2 === value ? 'font-semibold' : ''}`}
                  role="option"
                  aria-selected={c.iso2 === value}
                >
                  <span className="font-mono w-12 shrink-0 text-slate-500">+{c.dial}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-xs text-slate-400 font-mono">{c.iso2}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── small helpers ─────────────────────────────────────────────────────── */

function maskPhone(national: string): string {
  const digits = national.replace(/\D/g, '')
  if (digits.length <= 4) return digits
  return `${'•'.repeat(Math.max(0, digits.length - 4))} ${digits.slice(-4)}`
}

function maskEmail(email: string): string {
  const at = email.indexOf('@')
  if (at < 0) return email
  const user = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (user.length <= 2) return `${user[0] ?? ''}•@${domain}`
  return `${user[0]}•••${user.at(-1)}@${domain}`
}
