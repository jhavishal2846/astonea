import { pageMeta } from '@/lib/seo/generate-metadata'
import CareerPage from './CareerClient'

export const generateMetadata = () =>
  pageMeta('/career', {
    title: 'Career',
    description: 'Career opportunities at Astonea Labs Limited.',
  })

export default function Page() {
  return <CareerPage />
}
