import { pageMeta } from '@/lib/seo/generate-metadata'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ticketCategories, ticketCategoryTranslations } from '@/lib/db/schema'
import ContactUsPage from './ContactClient'

export const dynamic = 'force-dynamic'

export const generateMetadata = () =>
  pageMeta('/contact-us', {
    title: 'Contact Us',
    description: 'Get in touch with Astonea Labs Limited.',
  })

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const rows = await db
    .select({
      slug: ticketCategories.slug,
      name: ticketCategoryTranslations.name,
      translationLocale: ticketCategoryTranslations.locale,
    })
    .from(ticketCategories)
    .leftJoin(
      ticketCategoryTranslations,
      eq(ticketCategoryTranslations.categoryId, ticketCategories.id),
    )
    .where(eq(ticketCategories.isActive, true))
    .orderBy(asc(ticketCategories.sortOrder), asc(ticketCategories.slug))

  const bySlug = new Map<string, string>()
  for (const r of rows) {
    if (r.translationLocale === locale && r.name) {
      bySlug.set(r.slug, r.name)
    } else if (!bySlug.has(r.slug)) {
      bySlug.set(r.slug, r.name ?? r.slug)
    }
  }
  const categoryOptions = Array.from(bySlug.entries()).map(([slug, label]) => ({ slug, label }))

  return <ContactUsPage categoryOptions={categoryOptions} />
}
