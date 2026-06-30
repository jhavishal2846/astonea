'use client'

import Link from '@/components/LocaleLink'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { usePageText } from '@/components/PageTextProvider'
import TicketFormShell from '@/app/[locale]/_tickets/TicketFormShell'

const whyJoin = [
  {
    num: '01',
    title: 'State-of-the-Art Facility',
    desc: 'Work in a modern GMP-compliant manufacturing environment with advanced production systems and industry-leading equipment.',
  },
  {
    num: '02',
    title: 'Stringent Quality Standards',
    desc: 'Be part of a culture where WHO-GMP, ISO, and cGMP compliance is not just policy — it is embedded in how we operate every single day.',
  },
  {
    num: '03',
    title: 'Diverse Product Range',
    desc: 'Engage with a broad portfolio spanning antibiotics, antidiabetics, cardiovascular drugs, cosmetics, and nutraceuticals.',
  },
  {
    num: '04',
    title: 'Career Development',
    desc: 'Growth opportunities across manufacturing, R&D, quality assurance, regulatory affairs, marketing, supply chain, and corporate functions.',
  },
  {
    num: '05',
    title: 'Collaborative Culture',
    desc: 'A collaborative, inclusive environment that encourages teamwork, innovation, and continuous professional improvement.',
  },
  {
    num: '06',
    title: 'Global Exposure',
    desc: 'Involvement in domestic and international operations, USFDA compliance, and global supply chain dynamics.',
  },
]

const departments = [
  'Manufacturing & Production', 'Quality Assurance', 'Research & Development',
  'Drug Regulatory Affairs', 'Marketing & Sales', 'Supply Chain & Procurement',
  'Finance & Accounts', 'Human Resources', 'Corporate Affairs',
]

const candidateTraits = [
  'Passionate about pharmaceuticals, cosmetics, manufacturing, quality control, and regulatory compliance',
  'Eager to learn and innovate in a structured, process-driven environment',
  'Committed to ethical standards and quality excellence',
  'Adaptable to dynamic industrial and regulatory settings',
  'Open to continuous professional development and growth',
  'Fresh graduates and experienced professionals are both welcome',
]

export default function CareerPage({
  categoryOptions,
}: {
  categoryOptions: Array<{ slug: string; label: string }>
}) {
  const t = usePageText()

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow={t('header.eyebrow', 'Join Us') as string}
        title={t('header.title', 'Career at Astonea Labs') as string}
        description={t('header.description', 'We value our people as our most valuable asset — fostering a dynamic, inclusive, and growth-oriented work environment.') as string}
        breadcrumb={[{ label: 'Career', href: '/career' }]}
      />

      {/* Why join */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              {t('career.why.label', 'Why Astonea')}
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              {t('career.why.heading', 'A place where talent, dedication, and innovation are rewarded')}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--color-border)' }}>
            {whyJoin.map((w, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="flex flex-col gap-3 p-8 h-full" style={{ background: 'var(--color-surface)' }}>
                  <span className="font-display text-4xl font-bold tracking-tighter leading-none select-none" style={{ color: 'var(--color-primary-light)' }}>
                    {t(`career.why_${i}.num`, w.num)}
                  </span>
                  <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--color-ink)' }}>{t(`career.why_${i}.title`, w.title)}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{t(`career.why_${i}.desc`, w.desc)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal candidates */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
                  {t('career.candidates.label', 'Who We Are Looking For')}
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-snug mb-8 text-balance">
                  {t('career.candidates.heading', 'Passionate, ethical, and driven by excellence')}
                </h2>
                <div className="space-y-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {candidateTraits.map((trait, i) => (
                    <div key={i} className="px-6 py-4" style={{ background: 'var(--color-slate-950)' }}>
                      <div className="pl-4 border-l-2" style={{ borderColor: 'var(--color-primary-light)' }}>
                        <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>{t(`career.trait_${i}`, trait)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
                  {t('career.dept_label', 'Departments Hiring')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {departments.map((d, i) => (
                    <span key={i} className="px-3 py-2 rounded-full text-xs font-medium border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.78)' }}>
                      {t(`career.dept_${i}`, d)}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-14 lg:py-12" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>
                  {t('career.form.label', 'Apply Now')}
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-5 text-balance" style={{ color: 'var(--color-ink)' }}>
                  {t('career.form.heading', 'Ready to join the Astonea team?')}
                </h2>
                <p className="text-base leading-relaxed mb-3" style={{ color: 'var(--color-ink-muted)' }}>
                  {t(
                    'career.form.body',
                    "Fill in the form with your details and attach your CV. You'll receive an email confirmation with a tracking link.",
                  )}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-ink-subtle)' }}>
                  {t('career.form.support_redirect_prefix', 'Already applied and want to follow up?')}{' '}
                  <Link href="/support" className="font-semibold underline" style={{ color: 'var(--color-primary)' }}>
                    {t('career.form.support_redirect_cta', 'Use your tracking link →')}
                  </Link>
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <TicketFormShell
                source="support_form"
                defaultCategorySlug="careers"
                categoryOptions={categoryOptions}
                submitLabel={t('career.form.submit', 'Send verification code →') as string}
                extraFields={[
                  {
                    kind: 'text',
                    name: 'subject',
                    label: t('career.form.field.role', 'Role you\'re applying for') as string,
                    required: true,
                    placeholder: t('career.form.field.role_placeholder', 'e.g. QA Officer · 3 yrs') as string,
                  },
                  {
                    kind: 'select',
                    name: 'department_label',
                    label: t('career.form.field.department', 'Department') as string,
                    required: true,
                    options: departments.map((d, i) => ({ value: d, label: t(`career.dept_${i}`, d) as string })),
                  },
                  {
                    kind: 'file',
                    name: 'attachments',
                    label: t('career.form.field.cv', 'CV / Resume') as string,
                    accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    required: true,
                    help: t('career.form.field.cv_help', 'PDF or Word document up to 25 MB.') as string,
                  },
                ]}
                renderSuccess={({ statusHref, shortCode }) => (
                  <div className="p-10 rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="font-mono text-xs font-bold tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>
                      {t('career.form.success_label', 'APPLICATION SUBMITTED') as string} · {shortCode}
                    </p>
                    <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--color-ink)' }}>
                      {t('career.form.success_heading', "We've received your application.") as string}
                    </h3>
                    <p className="text-sm mb-5" style={{ color: 'var(--color-ink-muted)' }}>
                      {t('career.form.success_body', 'Thank you for your interest. Our HR team will review your application and reach out shortly. A confirmation email with a tracking link is on its way.') as string}
                    </p>
                    <a
                      href={statusHref}
                      className="inline-block px-5 py-2.5 rounded-full text-white text-sm font-bold transition-all"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      {t('career.form.success_cta', 'Track your application →') as string}
                    </a>
                  </div>
                )}
                classes={{
                  label: 'block text-xs font-medium mb-1.5 text-[var(--color-ink-muted)]',
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
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
