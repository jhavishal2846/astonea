import { pageMeta } from '@/lib/seo/generate-metadata'
import ContactUsPage from './ContactClient'

export const generateMetadata = () =>
  pageMeta('/contact-us', {
    title: 'Contact Us',
    description: 'Get in touch with Astonea Labs Limited.',
  })

export default function Page() {
  return <ContactUsPage />
}
