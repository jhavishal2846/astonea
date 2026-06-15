import type { DocumentCategory } from '@/lib/db/schema'

export function documentsTag(category: DocumentCategory) {
  return `documents:${category}`
}

export const DOCUMENTS_ALL_TAG = 'documents:all'

export function entityDocsTag(entityId: string) {
  return `documents:entity:${entityId}`
}
