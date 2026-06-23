'use client'

import ProductPageHeader from '@/components/ProductPageHeader'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from '@/components/LocaleLink'

const TAG_COLORS: Record<string, string> = {
  Pharmaceutical:   '#0072CE',
  Industrial:       '#3395D9',
  Specialty:        '#10B981',
  Reference:        '#F97316',
  FoodGrade:        '#0F766E',
  DrugDelivery:     '#6366F1',
}

/**
 * Heuristic tag derived from the category slug. Returns a translation-key
 * suffix; the rendered label comes from `products.tag.<key>` so each market
 * can localise the chip text.
 */
function tagFor(slug: string): keyof typeof TAG_COLORS {
  if (['apis', 'intermediates', 'excipients', 'impurities'].includes(slug)) return 'Pharmaceutical'
  if (['industrial-chemicals', 'organic-inorganic', 'dyes-and-intermediates'].includes(slug)) return 'Industrial'
  if (['nutraceuticals', 'herbal-extracts'].includes(slug)) return 'Specialty'
  if (slug === 'pellets') return 'DrugDelivery'
  if (slug === 'food-chemicals') return 'FoodGrade'
  return 'Pharmaceutical'
}

export type CategoryCard = {
  slug: string
  label: string
  description: string | null
  productCount: number
}

export default function ProductsClient({ categories }: { categories: CategoryCard[] }) {
  const t = useTranslations()
  return (
    <>
      <ProductPageHeader
        title={t('products.hero.title')}
        subtitle={t('products.hero.subtitle')}
        breadcrumbs={[{ label: t('products.breadcrumb.products') }]}
        variant="gradient"
        tag={t('products.hero.tag')}
      />

      <section className="py-20 bg-bg">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((cat, i) => {
              const tagKey = tagFor(cat.slug)
              const color = TAG_COLORS[tagKey] ?? '#0072CE'
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: i * 0.06 }}
                  viewport={{ once: true, margin: '-30px' }}
                >
                  <Link
                    href={`/products/${cat.slug}`}
                    className="group flex flex-col h-full bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  >
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full self-start mb-4"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {t(`products.tag.${tagKey}`)}
                    </span>
                    <h3 className="font-display font-bold text-xl text-ink mb-2 group-hover:text-primary transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-sm text-primary-light font-semibold mb-4">
                      {t('products.card.product_count', { count: cat.productCount })}
                    </p>
                    {cat.description && (
                      <p className="text-sm text-ink-muted line-clamp-3 mb-4">{cat.description}</p>
                    )}
                    <div className="mt-auto flex items-center gap-1 text-primary text-sm font-bold">
                      {t('products.card.browse_catalog')}
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
              <h3 className="font-display font-bold text-2xl text-ink mb-1">{t('products.cta.cant_find_heading')}</h3>
              <p className="text-ink-muted">{t('products.cta.cant_find_body')}</p>
            </div>
            <Link
              href="/contact-us"
              className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white text-sm font-bold hover:bg-accent-dark active:scale-95 transition-all duration-150"
            >
              {t('products.cta.custom_sourcing')}
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
