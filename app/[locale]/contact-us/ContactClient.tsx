'use client'

import Link from '@/components/LocaleLink'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { usePageText } from '@/components/PageTextProvider'
import TicketFormShell from '@/app/[locale]/_tickets/TicketFormShell'

const offices = [
  {
    label: 'Registered Office',
    address: 'SCO 321-322, Basement, Sector 35B\nChandigarh — 160022',
  },
  {
    label: 'Corporate Office',
    address: 'Plot No. 63, Industrial Area Phase-II\nPanchkula, Haryana — 134113',
  },
  {
    label: 'Manufacturing Facility',
    address: 'Vill. Haripur, Tehsil Raipur Rani\nDist. Panchkula, Haryana — 134204',
  },
]

const contacts = [
  { dept: 'Business Development', email: 'bdm.astonea@gmail.com' },
  { dept: 'Export Enquiries', email: 'export@astonea.org' },
  { dept: 'Procurement', email: 'purchase@astonea.org' },
  { dept: 'Investor Relations', email: 'cs@astonea.org' },
  { dept: 'USA Subsidiary Operations', email: 'usa@astonea.org' },
  { dept: 'Investor Grievance', email: 'investorgrievance@astonea.org' },
  { dept: 'Damaira Pharmaceuticals', email: 'bdm@damaira.com' },
]

export default function ContactUsPage({
  categoryOptions,
}: {
  categoryOptions: Array<{ slug: string; label: string }>
}) {
  const t = usePageText()

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Get in Touch') as string}
        title={t('header.title', 'Contact Us') as string}
        description={t('header.description', "Manufacturing enquiries, investor relations, export partnerships, or career — we're ready to connect.") as string}
        breadcrumb={[{ label: 'Contact Us', href: '/contact-us' }]}
      />

      {/* Offices */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              {t('contact.offices.label', 'Our Offices')}
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              {t('contact.offices.heading', 'Find us across North India')}
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-px mb-16" style={{ background: 'var(--color-border)' }}>
            {offices.map((o, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="p-8 h-full" style={{ background: 'var(--color-surface)' }}>
                  <p className="font-mono text-xs font-bold tracking-widest mb-6" style={{ color: 'var(--color-primary-light)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--color-ink)' }}>{t(`contact.office_${i}.label`, o.label)}</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-ink-muted)' }}>{t(`contact.office_${i}.address`, o.address)}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Contact directories */}
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--color-primary)' }}>
              {t('contact.directory_label', 'Contact Directories')}
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {contacts.map((c, i) => (
              <Reveal key={i}>
                <div className="flex items-start justify-between p-5 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-ink-subtle)' }}>{t(`contact.c_${i}.dept`, c.dept)}</p>
                    <a href={`mailto:${c.email}`} className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                      {t(`contact.c_${i}.email`, c.email)}
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-sm" style={{ color: 'var(--color-ink-subtle)' }}>
              {t('contact.business_hours', 'Business Hours: Monday – Saturday, 10 AM – 6 PM (IST)')}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-ink-subtle)' }}>
              {t('contact.support_redirect_prefix', 'Have a support issue or complaint?')}{' '}
              <Link href="/support" className="font-semibold underline" style={{ color: 'var(--color-primary)' }}>
                {t('contact.support_redirect_cta', 'Raise a support ticket →')}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
                  {t('contact.form.label', 'Enquiry Form')}
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-snug mb-5 text-balance">
                  {t('contact.form.heading', 'Send us a message')}
                </h2>
                <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  {t(
                    'contact.form.body',
                    "Whether you're a brand owner looking for a manufacturing partner, an investor with questions, or a professional exploring export opportunities — fill in the form and our team will get back to you within one business day.",
                  )}
                </p>

                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <iframe
                    src="https://www.google.com/maps?q=astonea+labs+pvt+ltd+panchkula&z=15&output=embed"
                    title="Astonea Labs Limited — Location on Google Maps"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-80 block"
                    style={{ border: 0, filter: 'grayscale(0.15) contrast(1.05)' }}
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <TicketFormShell
                source="support_form"
                defaultCategorySlug="business-development"
                categoryOptions={categoryOptions}
                submitLabel={t('contact.form.submit', 'Send verification code →') as string}
                extraFields={[
                  { kind: 'text', name: 'company', label: t('contact.form.field.company', 'Company Name') as string },
                  { kind: 'text', name: 'city', label: t('contact.form.field.city', 'City') as string },
                ]}
                renderSuccess={({ statusHref, shortCode }) => (
                  <div className="p-10 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    <p className="font-mono text-xs font-bold tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
                      {t('contact.form.success_label', 'ENQUIRY RECEIVED') as string} · {shortCode}
                    </p>
                    <h3 className="font-display text-xl font-semibold text-white mb-3">{t('contact.form.success_heading', 'Thank you for reaching out.') as string}</h3>
                    <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.72)' }}>
                      {t('contact.form.success_body', "Our team will contact you within one business day. A confirmation email is on its way with a link to track this enquiry.") as string}
                    </p>
                    <a
                      href={statusHref}
                      className="inline-block px-5 py-2.5 rounded-full text-sm font-bold transition-all"
                      style={{ background: 'var(--color-accent)', color: 'var(--color-slate-950)' }}
                    >
                      {t('contact.form.success_cta', 'Track this enquiry →') as string}
                    </a>
                  </div>
                )}
                classes={{
                  label: 'block text-xs font-medium mb-1.5 text-white/70',
                  input: 'w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition-all bg-white/[0.06] border border-white/10 text-white placeholder-white/30',
                  select: 'w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition-all bg-white/[0.06] border border-white/10 text-white',
                  textarea: 'w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition-all bg-white/[0.06] border border-white/10 text-white resize-none min-h-[8rem]',
                  button: 'w-full py-3.5 rounded-full text-sm font-bold transition-all active:scale-95 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-accent)] text-[var(--color-slate-950)]',
                  secondaryLink: 'text-white/60 hover:text-white underline-offset-2 hover:underline disabled:opacity-40',
                  hintMuted: 'text-xs text-white/50',
                  errorBox: 'px-3 py-2 rounded-lg bg-rose-500/15 border border-rose-400/30 text-rose-200 text-xs',
                  otpBox: 'p-5 rounded-2xl border border-white/10 bg-white/[0.04]',
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
