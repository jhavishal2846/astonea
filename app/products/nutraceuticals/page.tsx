'use client'

import ProductPageHeader from '@/components/ProductPageHeader'
import Pagination from '@/components/Pagination'
import { motion, AnimatePresence } from 'framer-motion'
import { toSlug } from '@/lib/products/utils'
import { nutraceuticalListing as products } from '@/lib/products/listings'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const categories = ['All', 'Vitamins', 'Minerals', 'Amino Acids', 'Antioxidants', 'Fatty Acids', 'Carotenoids', 'Joint Health']
const PER_PAGE = 15
const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.04 } }, exit: {} }
const rowVariants  = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit:   { opacity: 0, y: -4, transition: { duration: 0.12 } },
}

export default function NutraceuticalsPage() {
  const [search, setSearch]     = useState('')
  const [selectedCat, setCat]   = useState('All')
  const [page, setPage]         = useState(1)

  const filtered = products.filter(p =>
    (selectedCat === 'All' || p.category === selectedCat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.cas.includes(search))
  )
  useEffect(() => { setPage(1) }, [search, selectedCat])
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const router = useRouter()
  return (
    <>
      <ProductPageHeader
        title="Nutraceuticals"
        subtitle="Premium vitamins, minerals, amino acids, and functional ingredients for dietary supplements, health foods, and nutraceutical formulations."
        breadcrumbs={[{ label: 'Products', href: '/products' }, { label: 'Nutraceuticals' }]}
        variant="dark"
        tag="Vitamins & Supplements"
      />
      <section className="py-20 bg-bg">
        <div className="container-wide">
          <div className="mb-6 relative max-w-sm">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="search" placeholder="Search by name or CAS…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow] duration-150" />
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <motion.button key={cat} whileTap={{ scale: 0.94 }} onClick={() => setCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  selectedCat === cat ? 'bg-primary text-white shadow-sm' : 'bg-surface border border-border text-ink-muted hover:border-primary hover:text-primary'
                }`}>
                {cat}
              </motion.button>
            ))}
          </div>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-raised">
                    <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-widest text-ink-subtle">Product Name</th>
                    <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-widest text-ink-subtle">CAS Number</th>
                    <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-widest text-ink-subtle">Grade</th>
                    <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-widest text-ink-subtle">Category</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <AnimatePresence mode="wait">
                  <motion.tbody key={`${selectedCat}-${page}`} variants={listVariants} initial="hidden" animate="show" exit="exit">
                    {paged.map(p => (
                      <motion.tr
                        key={p.cas + p.name}
                        variants={rowVariants}
                        onClick={() => router.push(`/products/nutraceuticals/${toSlug(p.name)}`)}
                        onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/products/nutraceuticals/${toSlug(p.name)}`) }}
                        tabIndex={0}
                        role="link"
                        className="border-b border-border last:border-0 cursor-pointer group transition-colors hover:bg-primary-xlight"
                      >
                        <td className="px-6 py-4 font-medium text-ink">{p.name}</td>
                        <td className="px-6 py-4 font-mono text-xs text-ink-muted">{p.cas}</td>
                        <td className="px-6 py-4"><span className="px-2.5 py-0.5 text-xs font-semibold bg-primary-xlight text-primary rounded-full">{p.grade}</span></td>
                        <td className="px-6 py-4 text-xs text-ink-subtle">{p.category}</td>
                        <td className="px-6 py-4 text-right">
                          <svg className="w-4 h-4 inline-block text-ink-subtle opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </AnimatePresence>
              </table>
            </div>
          </div>
          <Pagination total={filtered.length} perPage={PER_PAGE} current={page} onChange={setPage} />
        </div>
      </section>
    </>
  )
}
