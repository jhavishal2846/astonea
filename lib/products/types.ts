export type DocumentType = 'COA' | 'MSDS' | 'DMF' | 'CEP/COS' | 'TDS' | 'COPP' | 'FSSAI' | 'WHO-GMP'

export interface PackagingOption {
  size: string
  type: string
}

export interface ProductDetail {
  name: string
  slug: string
  cas: string
  grade: string
  category: string
  type?: string
  molecularFormula?: string
  molecularWeight?: string
  purity?: string
  appearance?: string
  storageConditions?: string
  description: string
  applications: string[]
  packaging: PackagingOption[]
  documents: DocumentType[]
}

export interface ProductsByCategory {
  [categorySlug: string]: ProductDetail[]
}
