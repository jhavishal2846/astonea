import { notFound, redirect } from 'next/navigation'
import { pageMeta } from '@/lib/seo/generate-metadata'
import {
  getProductByCategoryAndSlug,
  getRelatedProducts,
  lookupAliasRedirect,
  type PublicProduct,
  type RelatedProduct,
} from '@/lib/products/public-queries'
import { getCategorySchema } from '@/lib/products/category-schemas'
import type { DocumentType, ProductDetail } from '@/lib/products/types'
import ProductDetailClient from './ProductDetailClient'

// Refresh hourly. Admin saves invalidate via updateTag() in _actions.ts, so
// stale detail pages only persist until the next save or this window expires.
export const revalidate = 3600

type Params = { locale: string; category: string; slug: string }

const DOCUMENT_TYPES = new Set<DocumentType>([
  'COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS', 'COPP', 'FSSAI', 'WHO-GMP',
])

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { category, slug } = await params
  const product = await getProductByCategoryAndSlug(category, slug)
  if (!product) return { title: 'Product Not Found' }
  return pageMeta(`/products/${category}/${slug}`, {
    title: `${product.name} | ${product.categoryLabel} | Astonea Labs`,
    description: product.description?.slice(0, 160) ?? undefined,
  })
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { locale, category, slug } = await params

  const product = await getProductByCategoryAndSlug(category, slug)
  if (!product) {
    const alias = await lookupAliasRedirect(locale, category, slug)
    if (alias) {
      redirect(`/${locale}/products/${alias.categorySlug}/${alias.productSlug}`)
    }
    notFound()
  }

  const related = await getRelatedProducts(product.id, category, 3)
  const schema = getCategorySchema(category)

  const adapted = adaptToLegacyShape(product, schema?.defaultDocumentSlots ?? [])
  const adaptedSiblings = related.map((r) => relatedToLegacyShape(r))

  return (
    <ProductDetailClient
      product={adapted}
      category={category}
      siblings={adaptedSiblings}
      categoryLabelOverride={product.categoryLabel}
    />
  )
}

/* ─── Adapters ──────────────────────────────────────────────────────────── */

function attr(p: PublicProduct, key: string): string | undefined {
  const v = p.attributes[key]
  if (typeof v === 'string') return v.trim() || undefined
  if (typeof v === 'number') return String(v)
  return undefined
}

function adaptToLegacyShape(
  p: PublicProduct,
  defaultSlots: readonly string[],
): ProductDetail {  
  const applicationsRaw = p.attributes.applications
  const applications = Array.isArray(applicationsRaw)
    ? applicationsRaw.filter((x): x is string => typeof x === 'string')
    : []

  const packagingRaw = p.attributes.packaging
  const packaging = Array.isArray(packagingRaw)
    ? packagingRaw.filter(
        (x): x is { size: string; type: string } =>
          !!x && typeof x === 'object' && 'size' in x && 'type' in x,
      )
    : []

  const documents = defaultSlots
    .filter((s): s is DocumentType => DOCUMENT_TYPES.has(s as DocumentType))

  return {
    name: p.name,
    slug: p.slug,
    cas: attr(p, 'casNumber') ?? '—',
    grade: attr(p, 'grade') ?? '',
    category: p.subCategory ?? '',
    type: attr(p, 'type'),
    molecularFormula: attr(p, 'molecularFormula'),
    molecularWeight: attr(p, 'molecularWeight'),
    purity: attr(p, 'purity'),
    appearance: attr(p, 'appearance'),
    storageConditions: attr(p, 'storageConditions'),
    description: p.description ?? '',
    applications,
    packaging,
    documents,
  }
}

function relatedToLegacyShape(r: RelatedProduct): ProductDetail {
  return {
    name: r.name,
    slug: r.slug,
    cas: r.cas ?? '—',
    grade: r.grade ?? '',
    category: '',
    description: '',
    applications: [],
    packaging: [],
    documents: [],
  }
}
