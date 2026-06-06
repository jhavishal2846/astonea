'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Reveal, StaggerReveal } from '@/components/StaggerReveal'

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
  { dept: 'Business Development', email: 'bdm.astonea@gmail.com', phone: '+91-9997774840' },
  { dept: 'Export Enquiries', email: 'export@astonea.org' },
  { dept: 'Procurement', email: 'purchase@astonea.org' },
  { dept: 'Investor Relations', email: 'cs@astonea.org' },
]

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: '', company: '', mobile: '', email: '', city: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Manufacturing enquiries, investor relations, export partnerships, or career — we're ready to connect."
        breadcrumb={[{ label: 'Contact Us', href: '/contact-us' }]}
      />

      {/* Offices */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              Our Offices
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-snug mb-14 text-balance" style={{ color: 'var(--color-ink)' }}>
              Find us across North India
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-px mb-16" style={{ background: 'var(--color-border)' }}>
            {offices.map((o, i) => (
              <Reveal key={o.label} delay={i * 80}>
                <div className="p-8 h-full" style={{ background: 'var(--color-surface)' }}>
                  <p className="font-mono text-xs font-bold tracking-widest mb-6" style={{ color: 'var(--color-primary-light)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--color-ink)' }}>{o.label}</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-ink-muted)' }}>{o.address}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Contact table */}
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--color-primary)' }}>
              Contact Directories
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {contacts.map((c) => (
              <Reveal key={c.dept}>
                <div className="flex items-start justify-between p-5 rounded-xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-ink-subtle)' }}>{c.dept}</p>
                    <a href={`mailto:${c.email}`} className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                      {c.email}
                    </a>
                    {c.phone && (
                      <p className="mt-1 text-sm" style={{ color: 'var(--color-ink-muted)' }}>
                        <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a>
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-sm" style={{ color: 'var(--color-ink-subtle)' }}>
              Business Hours: Monday – Saturday, 10 AM – 6 PM (IST)
            </p>
          </Reveal>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--color-slate-950)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>
                  Enquiry Form
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-snug mb-5 text-balance">
                  Send us a message
                </h2>
                <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  Whether you're a brand owner looking for a manufacturing partner, an investor with questions,
                  or a professional exploring export opportunities — fill in the form and our team will get
                  back to you within one business day.
                </p>

                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <iframe
                    src="https://maps.google.com/maps?q=Astonea+Labs+Limited,+Haripur,+Haryana&ll=30.5483669,76.9880911&hl=en&z=16&output=embed"
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
              {submitted ? (
                <div className="p-10 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <p className="font-mono text-xs font-bold tracking-widest mb-4" style={{ color: 'var(--color-primary-light)' }}>MESSAGE RECEIVED</p>
                  <h3 className="font-display text-xl font-semibold text-white mb-3">Thank you for reaching out.</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    Our team will contact you within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { name: 'name', label: 'Full Name', type: 'text', required: true },
                    { name: 'company', label: 'Company Name', type: 'text', required: false },
                    { name: 'mobile', label: 'Mobile Number', type: 'tel', required: true },
                    { name: 'email', label: 'Email Address', type: 'email', required: true },
                    { name: 'city', label: 'City', type: 'text', required: false },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.72)' }}>
                        {field.label}{field.required && ' *'}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        required={field.required}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white',
                        }}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.72)' }}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 transition-all resize-none"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full text-sm font-bold transition-all active:scale-95"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-slate-950)' }}
                  >
                    Send Enquiry →
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
