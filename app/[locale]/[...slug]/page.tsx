import { notFound } from 'next/navigation'
import { getResolvedPage } from '@/lib/cms/pages'
import { BlockRenderer } from '@/components/cms/BlockRenderer'
import { pageMeta } from '@/lib/seo/generate-metadata'

function pathFromSlug(slug: string[] | undefined): string {
  if (!slug || slug.length === 0) return '/'
  return '/' + slug.join('/')
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  return pageMeta(pathFromSlug(slug))
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}) {
  const { locale, slug } = await params
  const path = pathFromSlug(slug)
  const resolved = await getResolvedPage(path, locale)
  if (!resolved || !resolved.page.isPublished) notFound()

  return (
    <div className="flex-1 flex flex-col">
      <BlockRenderer blocks={resolved.blocks} />
    </div>
  )
}
