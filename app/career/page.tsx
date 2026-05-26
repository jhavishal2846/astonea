'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'

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

export default function CareerPage() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', department: '', experience: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Join Us"
        title="Career at Astonea Labs"
        description="We value our people as our most valuable asset — fostering a dynamic, inclusive, and growth-oriented work environment."
        breadcrumb={[{ label: 'Career', href: '/career' }]}
      />

      {/* Why join */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Why Astonea
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              A place where talent, dedication, and innovation are rewarded
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--color-border)' }}>
            {whyJoin.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <div className="flex flex-col gap-3 p-8 h-full" style={{ background: 'var(--color-surface)' }}>
                  <span className="font-display text-4xl font-bold tracking-tighter leading-none select-none" style={{ color: 'var(--color-primary-xlight)' }}>
                    {w.num}
                  </span>
                  <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--color-ink)' }}>{w.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal candidates */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
                  Who We Are Looking For
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-snug mb-8 text-balance">
                  Passionate, ethical, and driven by excellence
                </h2>
                <div className="space-y-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {candidateTraits.map((t) => (
                    <div key={t} className="px-6 py-4" style={{ background: 'var(--color-slate-950)' }}>
                      <div className="pl-4 border-l-2" style={{ borderColor: 'var(--color-primary-light)' }}>
                        <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.78)' }}>{t}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
                  Departments Hiring
                </p>
                <div className="flex flex-wrap gap-2">
                  {departments.map((d) => (
                    <span key={d} className="px-3 py-2 rounded-full text-xs font-medium border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.78)' }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>
                  Apply Now
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-5 text-balance" style={{ color: 'var(--color-ink)' }}>
                  Ready to join the Astonea team?
                </h2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                  Fill in the form with your details and we'll be in touch. Alternatively, send your CV directly to{' '}
                  <a href="mailto:cs@astonea.org" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                    cs@astonea.org
                  </a>.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              {submitted ? (
                <div className="p-10 rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="font-mono text-xs font-bold tracking-widest mb-4" style={{ color: 'var(--color-primary)' }}>APPLICATION SUBMITTED</p>
                  <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--color-ink)' }}>We've received your application.</h3>
                  <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                    Thank you for your interest. Our HR team will review your application and reach out shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { name: 'name', label: 'Full Name', type: 'text', required: true },
                    { name: 'mobile', label: 'Mobile Number', type: 'tel', required: true },
                    { name: 'email', label: 'Email Address', type: 'email', required: true },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-ink-muted)' }}>
                        {field.label} *
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        required={field.required}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:ring-2 transition-all"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-ink-muted)' }}>
                      Department Applying For *
                    </label>
                    <select
                      name="department"
                      required
                      value={form.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:ring-2 transition-all"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                    >
                      <option value="">Select a department</option>
                      {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-ink-muted)' }}>
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      placeholder="e.g. Fresher, 2 years, 10+ years"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:ring-2 transition-all"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-ink-muted)' }}>
                      Message / Additional Info *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us about yourself, your experience, and what role you're interested in..."
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-sm border outline-none focus:ring-2 transition-all resize-none"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full text-white text-sm font-bold transition-all active:scale-95 hover:opacity-90"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    Submit Application →
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
