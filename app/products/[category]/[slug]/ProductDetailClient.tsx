'use client'

import ProductPageHeader from '@/components/ProductPageHeader'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ProductDetail, DocumentType } from '@/lib/products/types'
import { categoryLabel } from '@/lib/products/utils'

const docConfig: Record<DocumentType, { label: string; color: string }> = {
  'COA':     { label: 'Certificate of Analysis',        color: '#0072CE' },
  'MSDS':    { label: 'Material Safety Data Sheet',     color: '#10B981' },
  'DMF':     { label: 'Drug Master File',               color: '#6366F1' },
  'CEP/COS': { label: 'Certificate of Suitability',    color: '#F97316' },
  'TDS':     { label: 'Technical Data Sheet',           color: '#0F766E' },
  'COPP':    { label: 'Certificate of Pharma Product',  color: '#84CC16' },
  'FSSAI':   { label: 'FSSAI Compliance',               color: '#EF4444' },
  'WHO-GMP': { label: 'WHO-GMP Certificate',            color: '#E8A900' },
}

interface Props {
  product: ProductDetail
  category: string
  siblings: ProductDetail[]
}

function SpecRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex gap-4 py-3 border-b border-border last:border-0">
      <span className="w-40 flex-shrink-0 text-xs font-semibold text-ink-subtle uppercase tracking-wide">{label}</span>
      <span className="text-sm text-ink font-medium">{value}</span>
    </div>
  )
}

export default function ProductDetailClient({ product, category, siblings }: Props) {
  const catLabel = categoryLabel(category)

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  }

  const hasSpecs = product.molecularFormula || product.molecularWeight || product.purity ||
    product.appearance || product.storageConditions

  return (
    <>
      <ProductPageHeader
        title={product.name}
        subtitle={`CAS: ${product.cas}  ·  Grade: ${product.grade}  ·  Category: ${product.category}`}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: catLabel, href: `/products/${category}` },
          { label: product.name },
        ]}
        variant="dark"
        tag={product.grade}
      />

      <section className="py-16 bg-bg">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-8">

              <motion.div variants={fadeUp} initial="hidden" animate="show"
                className="bg-surface border border-border rounded-2xl p-8">
                <h2 className="font-display font-bold text-xl text-ink mb-4">Product Overview</h2>
                <p className="text-ink-muted leading-relaxed">{product.description}</p>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="show"
                transition={{ delay: 0.08 }}
                className="bg-surface border border-border rounded-2xl p-8">
                <h2 className="font-display font-bold text-xl text-ink mb-5">Applications & Uses</h2>
                <ul className="space-y-3">
                  {product.applications.map((app, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.12 + i * 0.06, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-ink-muted">{app}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {hasSpecs && (
                <motion.div variants={fadeUp} initial="hidden" animate="show"
                  transition={{ delay: 0.14 }}
                  className="bg-surface border border-border rounded-2xl p-8">
                  <h2 className="font-display font-bold text-xl text-ink mb-5">Technical Specifications</h2>
                  <div>
                    <SpecRow label="CAS Number" value={product.cas} />
                    <SpecRow label="Grade" value={product.grade} />
                    <SpecRow label="Molecular Formula" value={product.molecularFormula} />
                    <SpecRow label="Molecular Weight" value={product.molecularWeight} />
                    <SpecRow label="Purity" value={product.purity} />
                    <SpecRow label="Appearance" value={product.appearance} />
                    <SpecRow label="Storage" value={product.storageConditions} />
                  </div>
                </motion.div>
              )}

              <motion.div variants={fadeUp} initial="hidden" animate="show"
                transition={{ delay: 0.18 }}
                className="bg-surface border border-border rounded-2xl p-8">
                <h2 className="font-display font-bold text-xl text-ink mb-5">Packaging Options</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {product.packaging.map((pkg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
                      className="border border-border rounded-xl p-4 text-center hover:border-primary/30 hover:bg-primary-xlight/30 transition-all duration-200"
                    >
                      <div className="font-display font-bold text-primary text-lg mb-1">{pkg.size}</div>
                      <div className="text-xs text-ink-subtle leading-tight">{pkg.type}</div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-ink-subtle mt-4">Custom packaging available on request. Minimum order quantities may apply.</p>
              </motion.div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">

              <motion.div variants={fadeUp} initial="hidden" animate="show"
                transition={{ delay: 0.05 }}
                className="bg-primary rounded-2xl p-6 text-white">

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 pb-5 mb-5 border-b border-white/15">
                  {[
                    { label: 'CAS Number', value: product.cas },
                    { label: 'Grade', value: product.grade },
                    { label: 'Category', value: product.category },
                    ...(product.purity ? [{ label: 'Purity', value: product.purity }] : []),
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-[10px] uppercase tracking-wider text-white/50 mb-0.5">{label}</div>
                      <div className="text-sm font-semibold text-white font-mono break-all">{value}</div>
                    </div>
                  ))}
                </div>

                <h3 className="font-display font-bold text-lg mb-1.5">Request a Quote</h3>
                <p className="text-white/70 text-sm mb-5 leading-relaxed">
                  Competitive pricing, COA samples, and full documentation within 24 hours.
                </p>
                <Link
                  href={`/contact-us?product=${encodeURIComponent(product.name)}&cas=${product.cas}`}
                  className="block w-full text-center py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent-dark active:scale-95 transition-all duration-150 mb-2.5"
                >
                  Enquire Now
                </Link>
                <Link
                  href="/contact-us"
                  className="block w-full text-center py-3 rounded-xl border border-white/25 text-white/85 font-semibold text-sm hover:bg-white/10 transition-all duration-150"
                >
                  Talk to Expert
                </Link>

                <div className="mt-5 pt-5 border-t border-white/15 flex items-center gap-2">
                  <svg className="w-4 h-4 text-white/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-white/55">Response within 24 business hours</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="show"
                transition={{ delay: 0.1 }}
                className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-display font-bold text-base text-ink mb-4">Available Documentation</h3>
                <div className="space-y-2.5">
                  {product.documents.map((doc) => {
                    const cfg = docConfig[doc]
                    return (
                      <div key={doc} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/20 hover:bg-primary-xlight/20 transition-all duration-200 cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${cfg.color}15` }}>
                          <svg className="w-4 h-4" style={{ color: cfg.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold" style={{ color: cfg.color }}>{doc}</div>
                          <div className="text-xs text-ink-subtle truncate">{cfg.label}</div>
                        </div>
                        <svg className="w-3.5 h-3.5 text-ink-subtle opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-ink-subtle mt-3">Documents available on request after enquiry submission.</p>
              </motion.div>
            </div>
          </div>

          {siblings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <h2 className="font-display font-bold text-2xl text-ink mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {siblings.map((sib) => (
                  <Link
                    key={sib.slug}
                    href={`/products/${category}/${sib.slug}`}
                    className="group bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-primary-xlight text-primary rounded-full">{sib.grade}</span>
                      <svg className="w-4 h-4 text-ink-subtle opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    <h3 className="font-display font-bold text-sm text-ink group-hover:text-primary transition-colors mb-1">{sib.name}</h3>
                    <p className="text-xs font-mono text-ink-subtle">CAS: {sib.cas}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          <div className="mt-10 pt-8 border-t border-border flex items-center justify-between">
            <Link
              href={`/products/${category}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to {catLabel}
            </Link>
            <Link
              href={`/contact-us?product=${encodeURIComponent(product.name)}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark active:scale-95 transition-all duration-150"
            >
              Request a Quote
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
