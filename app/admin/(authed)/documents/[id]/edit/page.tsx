import { notFound } from 'next/navigation'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { documents, groupCompanies, type DocumentCategory } from '@/lib/db/schema'
import DocumentForm from '../../DocumentForm'
import { updateDocument, type ActionState } from '../../_actions'
import AdminPageHeader from '@/app/admin/_components/PageHeader'

export const dynamic = 'force-dynamic'

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const row = (await db.select().from(documents).where(eq(documents.id, id)).limit(1))[0]
  if (!row) notFound()

  const [companies, subcatRows] = await Promise.all([
    db
      .select({ id: groupCompanies.id, name: groupCompanies.name })
      .from(groupCompanies)
      .orderBy(asc(groupCompanies.displayOrder)),
    db
      .selectDistinct({
        category: documents.category,
        subcategory: documents.subcategory,
      })
      .from(documents),
  ])

  const existingSubcategoriesByCategory = subcatRows.reduce<Partial<Record<DocumentCategory, string[]>>>(
    (acc, r) => {
      if (!r.subcategory) return acc
      const bucket = acc[r.category] ?? []
      if (!bucket.includes(r.subcategory)) bucket.push(r.subcategory)
      acc[r.category] = bucket
      return acc
    },
    {},
  )

  const boundUpdate = async (prev: ActionState, formData: FormData) => {
    'use server'
    return updateDocument(id, prev, formData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AdminPageHeader
        title="Edit document"
        description={row.title}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Documents', href: '/admin/documents' },
          { label: 'Edit' },
        ]}
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
        <DocumentForm
          action={boundUpdate}
          initialValue={{
            id: row.id,
            category: row.category,
            subcategory: row.subcategory,
            title: row.title,
            description: row.description,
            fileUrl: row.fileUrl,
            period: row.period,
            eventDate: row.eventDate,
            entityId: row.entityId,
            externalLink: row.externalLink,
            displayOrder: row.displayOrder,
            isPublished: row.isPublished,
          }}
          groupCompanies={companies}
          existingSubcategoriesByCategory={existingSubcategoriesByCategory}
          submitLabel="Save changes"
        />
      </div>
    </div>
  )
}
