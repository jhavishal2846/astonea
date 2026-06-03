import { allProductsByCategory } from '@/lib/products/data'
import { categoryLabel } from '@/lib/products/utils'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export async function generateStaticParams() {
  const params: { category: string; slug: string }[] = []
  for (const [cat, products] of Object.entries(allProductsByCategory)) {
    for (const p of products) {
      params.push({ category: cat, slug: p.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const product = allProductsByCategory[category]?.find(p => p.slug === slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} | ${categoryLabel(category)} | Astonea Labs`,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params
  const products = allProductsByCategory[category]
  const product = products?.find(p => p.slug === slug)
  if (!product) notFound()

  const siblings = (products ?? [])
    .filter(p => p.slug !== slug && p.category === product.category)
    .slice(0, 3)

  return <ProductDetailClient product={product} category={category} siblings={siblings} />
}
