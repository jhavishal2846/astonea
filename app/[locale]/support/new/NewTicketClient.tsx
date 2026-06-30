'use client'

import { usePageText } from '@/components/PageTextProvider'
import TicketFormShell from '@/app/[locale]/_tickets/TicketFormShell'

export default function NewTicketClient({
  categoryOptions,
}: {
  categoryOptions: Array<{ slug: string; label: string }>
}) {
  const t = usePageText()
  return (
    <TicketFormShell
      source="support_form"
      submitLabel={t('support_new.form.submit', 'Send verification code →') as string}
      categoryOptions={categoryOptions}
      extraFields={[
        {
          kind: 'text',
          name: 'subject',
          label: t('support_new.form.field.subject', 'Subject') as string,
          required: true,
          placeholder: t('support_new.form.field.subject_placeholder', 'Short summary of the issue') as string,
        },
        {
          kind: 'text',
          name: 'company',
          label: t('support_new.form.field.company', 'Company (optional)') as string,
        },
        {
          kind: 'file',
          name: 'attachments',
          label: t('support_new.form.field.attachments', 'Attachments (optional)') as string,
          accept: 'application/pdf,image/*,text/*',
          help: t('support_new.form.field.attachments_help', 'Screenshots, invoices, photos. PDF / image / text up to 25 MB each.') as string,
        },
      ]}
      renderSuccess={({ statusHref, shortCode }) => (
        <div className="p-8 rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
          <p className="font-mono text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
            {t('support_new.success.label', 'TICKET LOGGED') as string} · {shortCode}
          </p>
          <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>
            {t('support_new.success.heading', "We've received your ticket.") as string}
          </h3>
          <p className="text-sm mb-5" style={{ color: 'var(--color-ink-muted)' }}>
            {t('support_new.success.body', 'A confirmation email is on its way with the same tracking link. You can keep this page open or visit it later.') as string}
          </p>
          <a
            href={statusHref}
            className="inline-block px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all"
            style={{ background: 'var(--color-primary)' }}
          >
            {t('support_new.success.cta', 'View ticket status →') as string}
          </a>
        </div>
      )}
      classes={{
        label: 'block text-xs font-semibold mb-1.5 text-[var(--color-ink-muted)]',
        input: 'w-full px-4 py-3 rounded-xl text-sm border border-[var(--color-border)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/40 transition-all text-[var(--color-ink)] bg-white',
        select: 'w-full px-4 py-3 rounded-xl text-sm border border-[var(--color-border)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/40 transition-all text-[var(--color-ink)] bg-white',
        textarea: 'w-full px-4 py-3 rounded-xl text-sm border border-[var(--color-border)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/40 transition-all text-[var(--color-ink)] bg-white resize-none min-h-[8rem]',
        button: 'w-full py-3.5 rounded-full text-white text-sm font-bold transition-all active:scale-95 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-primary)]',
        secondaryLink: 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] underline-offset-2 hover:underline disabled:opacity-40',
        hintMuted: 'text-xs text-[var(--color-ink-subtle)]',
        errorBox: 'px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs',
        otpBox: 'p-5 rounded-2xl border border-[var(--color-border)] bg-white',
      }}
    />
  )
}
