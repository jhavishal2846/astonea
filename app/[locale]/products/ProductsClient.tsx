'use client'

import ProductPageHeader from '@/components/ProductPageHeader'
import { motion } from 'framer-motion'
import Link from 'next/link'

const categories = [
  { title: "API's",                href: '/products/apis',                   count: '200+', tag: 'Pharmaceutical' },
  { title: 'Intermediates',        href: '/products/intermediates',           count: '150+', tag: 'Pharmaceutical' },
  { title: 'Industrial Chemicals', href: '/products/industrial-chemicals',   count: '500+', tag: 'Industrial' },
  { title: 'Organic & Inorganic',  href: '/products/organic-inorganic',      count: '300+', tag: 'Industrial' },
  { title: 'Nutraceuticals',       href: '/products/nutraceuticals',         count: '100+', tag: 'Specialty' },
  { title: 'Herbal Extracts',      href: '/products/herbal-extracts',        count: '80+',  tag: 'Specialty' },
  { title: 'Excipients',           href: '/products/excipients',             count: '120+', tag: 'Pharmaceutical' },
  { title: 'Dyes & Intermediates', href: '/products/dyes-and-intermediates', count: '90+',  tag: 'Industrial' },
  { title: 'Impurities',           href: '/products/impurities',             count: '400+', tag: 'Reference' },
  { title: 'Food Chemicals',       href: '/products/food-chemicals',         count: '60+',  tag: 'Food Grade' },
  { title: 'Pellets',              href: '/products/pellets',                count: '30+',  tag: 'Drug Delivery' },
]

const tagColors: Record<string, string> = {
  Pharmaceutical: '#0072CE',
  Industrial:     '#3395D9',
  Specialty:      '#10B981',
  Reference:      '#F97316',
  'Food Grade':   '#0F766E',
  'Drug Delivery':'#6366F1',
}

export default function ProductsPage() {
  return (
    <>
      <ProductPageHeader
        title="Our Products"
        subtitle="A comprehensive catalog of pharmaceutical, industrial, and specialty chemicals — sourced globally, tested in-house, and shipped worldwide."
        breadcrumbs={[{ label: 'Products' }]}
        variant="gradient"
        tag="Full Catalog"
      />

      <section className="py-20 bg-bg">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((cat, i) => {
              const color = tagColors[cat.tag] ?? '#0072CE'
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: i * 0.06 }}
                  viewport={{ once: true, margin: '-30px' }}
                >
                  <Link
                    href={cat.href}
                    className="group flex flex-col h-full bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  >
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full self-start mb-4"
                      style={{ backgroundColor: `${color}15`, color }}>
                      {cat.tag}
                    </span>
                    <h3 className="font-display font-bold text-xl text-ink mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
                    <p className="text-sm text-primary-light font-semibold mb-4">{cat.count} products</p>
                    <div className="mt-auto flex items-center gap-1 text-primary text-sm font-bold">
                      Browse catalog
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-14 p-8 bg-surface border border-border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-display font-bold text-2xl text-ink mb-1">Can&apos;t find what you need?</h3>
              <p className="text-ink-muted">Our sourcing team can find virtually any chemical compound. Submit a custom request and we&apos;ll respond within 24 hours.</p>
            </div>
            <Link
              href="/contact-us"
              className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white text-sm font-bold hover:bg-accent-dark active:scale-95 transition-all duration-150"
            >
              Custom Sourcing Request
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
