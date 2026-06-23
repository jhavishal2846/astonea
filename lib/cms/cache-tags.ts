import type { DocumentCategory } from '@/lib/db/schema'

export function documentsTag(category: DocumentCategory) {
  return `documents:${category}`
}

export const DOCUMENTS_ALL_TAG = 'documents:all'

export function entityDocsTag(entityId: string) {
  return `documents:entity:${entityId}`
}

export function productsTag(categorySlug: string) {
  return `products:${categorySlug}`
}

export const PRODUCTS_ALL_TAG = 'products:all'

export function productTag(productId: string) {
  return `product:${productId}`
}

export function productCategoriesTag() {
  return 'product-categories:all'
}
