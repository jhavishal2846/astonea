import { pageMeta } from '@/lib/seo/generate-metadata'
import { getActiveCategories } from '@/lib/products/public-queries'
import ProductsClient from './ProductsClient'

export const revalidate = 300

export const generateMetadata = () =>
  pageMeta('/products', {
    title: 'Products',
    description: 'Astonea Labs product portfolio across APIs, excipients and specialty chemicals.',
  })

export default async function Page() {
  const categories = await getActiveCategories()
  return (
    <ProductsClient
      categories={categories.map((c) => ({
        slug: c.slug,
        label: c.label,
        description: c.description,
        productCount: c.productCount,
      }))}
    />
  )
}
