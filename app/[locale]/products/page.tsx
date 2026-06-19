import { pageMeta } from '@/lib/seo/generate-metadata'
import ProductsPage from './ProductsClient'

export const generateMetadata = () =>
  pageMeta('/products', {
    title: 'Products',
    description: 'Astonea Labs product portfolio across APIs, excipients and specialty chemicals.',
  })

export default function Page() {
  return <ProductsPage />
}
