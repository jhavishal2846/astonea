/**
 * Per-category attribute schemas. Lives in code (not the DB) so admin forms
 * stay typed and we can iterate on the field shape per category without
 * touching production rows.
 *
 *  - Universal fields (name, description, slug, status, audit, …) are typed
 *    columns on `products` — not declared here.
 *  - Category-specific fields live in `products.attributes` (JSONB) and, when
 *    translatable, also in `product_translations.attributes`. Keys must match.
 *  - Sub-category is stored on the `product_to_categories` pivot, not in
 *    attributes. The list below is the suggested/validated set that drives
 *    filter chips and admin form pickers.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'string-list'
  | 'kv-list'

export interface FieldDef {
  key: string
  label: string
  type: FieldType
  required?: boolean
  /** When true, the field is mirrored into `product_translations.attributes`. */
  translatable?: boolean
  /** For type='select' only. */
  options?: readonly string[]
  /** For 'kv-list': column labels (default 'Size' / 'Type'). */
  kvLabels?: readonly [string, string]
  placeholder?: string
  helpText?: string
}

export interface CategorySchema {
  slug: string
  label: string
  pluralLabel?: string
  description?: string
  /** Suggested sub-category bucket values (e.g. 'Antiviral' under APIs). Stored on the pivot row. */
  subCategories: readonly string[]
  /** Category-specific fields. Spread alongside COMMON_FIELDS as appropriate. */
  attributes: readonly FieldDef[]
  /** Filled in by the migration / admin when the user leaves grade blank. */
  defaultGrade?: string
  /** Filled in by the migration when a listing row doesn't specify a sub-category. */
  defaultSubCategory?: string
  /** Column order for the public listing page. References 'name', 'subCategory', or any attribute key. */
  listingColumns: readonly string[]
  /** Filter UI keys for the listing page. 'subCategory' renders chips; attribute keys render dropdowns. */
  filters: readonly string[]
  /** Attribute keys admin search inputs should match against (in addition to name). */
  searchableAttributes: readonly string[]
  /** Suggested document slots for the admin doc picker quick-add. */
  defaultDocumentSlots?: readonly string[]
}

/**
 * Fields every category includes. Applications and packaging are universal
 * because the detail page renders both sections for every product type.
 */
const COMMON_FIELDS: readonly FieldDef[] = [
  {
    key: 'applications',
    label: 'Applications',
    type: 'string-list',
    translatable: true,
    helpText: 'Ordered list of use cases shown as bullets on the detail page.',
  },
  {
    key: 'packaging',
    label: 'Packaging Options',
    type: 'kv-list',
    kvLabels: ['Size', 'Type'],
    translatable: true,
    helpText: 'Available pack sizes and container types.',
  },
]

/* ────────────────────────────────────────────────────────────────────────── */

export const CATEGORY_SCHEMAS = {
  apis: {
    slug: 'apis',
    label: "API's",
    pluralLabel: 'Active Pharmaceutical Ingredients',
    description:
      'High-purity APIs sourced from GMP-certified manufacturers. Full pharmacopoeial compliance with USP, BP, EP, and JP standards.',
    subCategories: [
      'Analgesic', 'Antibiotic', 'Antiviral', 'Cardiovascular', 'Antidiabetic',
      'GI', 'Respiratory', 'Neurological', 'NSAID', 'Antifungal', 'CNS',
      'Oncology', 'Antihistamine', 'Antiparasitic', 'Vitamin', 'Supplement',
    ],
    defaultGrade: 'USP',
    defaultSubCategory: 'Active Pharmaceutical Ingredient',
    attributes: [
      { key: 'casNumber', label: 'CAS Number', type: 'text' },
      { key: 'grade', label: 'Grade', type: 'text', placeholder: 'USP, BP, EP, JP, …' },
      { key: 'molecularFormula', label: 'Molecular Formula', type: 'text' },
      { key: 'molecularWeight', label: 'Molecular Weight', type: 'text' },
      { key: 'purity', label: 'Purity', type: 'text' },
      { key: 'appearance', label: 'Appearance', type: 'text', translatable: true },
      { key: 'storageConditions', label: 'Storage Conditions', type: 'textarea', translatable: true },
      ...COMMON_FIELDS,
    ],
    listingColumns: ['name', 'casNumber', 'grade', 'subCategory'],
    filters: ['subCategory'],
    searchableAttributes: ['casNumber'],
    defaultDocumentSlots: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },

  intermediates: {
    slug: 'intermediates',
    label: 'Intermediates',
    pluralLabel: 'Pharmaceutical Intermediates',
    description:
      'Key building blocks for API synthesis and downstream chemistry. AR and LR grades available with full QC documentation.',
    subCategories: [
      'Pharmaceutical Intermediate', 'Solvent/Reagent', 'Brominating Reagent',
      'Protecting Reagent', 'Dye Intermediate', 'Amino Acid', 'Reagent',
      'Thiazole', 'Pyridine', 'Aniline', 'Solvent',
    ],
    defaultGrade: 'AR',
    defaultSubCategory: 'Pharmaceutical Intermediate',
    attributes: [
      { key: 'casNumber', label: 'CAS Number', type: 'text' },
      { key: 'grade', label: 'Grade', type: 'text', placeholder: 'AR, LR, USP, …' },
      { key: 'purity', label: 'Purity', type: 'text' },
      { key: 'molecularFormula', label: 'Molecular Formula', type: 'text' },
      { key: 'molecularWeight', label: 'Molecular Weight', type: 'text' },
      { key: 'appearance', label: 'Appearance', type: 'text', translatable: true },
      { key: 'storageConditions', label: 'Storage Conditions', type: 'textarea', translatable: true },
      ...COMMON_FIELDS,
    ],
    listingColumns: ['name', 'casNumber', 'purity', 'subCategory'],
    filters: ['subCategory'],
    searchableAttributes: ['casNumber'],
    defaultDocumentSlots: ['COA', 'MSDS', 'TDS'],
  },

  'industrial-chemicals': {
    slug: 'industrial-chemicals',
    label: 'Industrial Chemicals',
    pluralLabel: 'Industrial & Commodity Chemicals',
    description:
      'Bulk solvents, acids, bases, and oxidising agents for industrial manufacturing and processing.',
    subCategories: [
      'Organic Acid', 'Mineral Acid', 'Strong Base', 'Alcohol Solvent',
      'Ketone Solvent', 'Aromatic Solvent', 'Chlorinated Solvent',
      'Aldehyde', 'Oxidising Agent', 'Industrial Chemical',
    ],
    defaultGrade: 'Industrial',
    defaultSubCategory: 'Industrial Chemical',
    attributes: [
      { key: 'casNumber', label: 'CAS Number', type: 'text' },
      { key: 'grade', label: 'Grade', type: 'text', placeholder: 'Industrial, LR, AR, …' },
      { key: 'molecularFormula', label: 'Molecular Formula', type: 'text' },
      { key: 'molecularWeight', label: 'Molecular Weight', type: 'text' },
      { key: 'purity', label: 'Purity', type: 'text' },
      { key: 'appearance', label: 'Appearance', type: 'text', translatable: true },
      { key: 'storageConditions', label: 'Storage Conditions', type: 'textarea', translatable: true },
      ...COMMON_FIELDS,
    ],
    listingColumns: ['name', 'casNumber', 'grade', 'subCategory'],
    filters: ['subCategory'],
    searchableAttributes: ['casNumber'],
    defaultDocumentSlots: ['COA', 'MSDS', 'TDS'],
  },

  excipients: {
    slug: 'excipients',
    label: 'Excipients',
    pluralLabel: 'Pharmaceutical Excipients',
    description:
      'Binders, diluents, disintegrants, lubricants, and coatings for tablet, capsule, and oral liquid formulations.',
    subCategories: [
      'Diluent/Binder', 'Binder', 'Disintegrant', 'Lubricant',
      'Matrix Former/Film Coat', 'Sweetener', 'Glidant', 'Pharmaceutical Excipient',
    ],
    defaultGrade: 'USP/NF',
    defaultSubCategory: 'Pharmaceutical Excipient',
    attributes: [
      { key: 'casNumber', label: 'CAS Number', type: 'text' },
      { key: 'grade', label: 'Grade', type: 'text', placeholder: 'USP, NF, EP, JP, …' },
      { key: 'use', label: 'Functional Use', type: 'text', translatable: true, placeholder: 'Binder, Disintegrant, …' },
      { key: 'purity', label: 'Purity', type: 'text' },
      { key: 'appearance', label: 'Appearance', type: 'text', translatable: true },
      { key: 'storageConditions', label: 'Storage Conditions', type: 'textarea', translatable: true },
      ...COMMON_FIELDS,
    ],
    listingColumns: ['name', 'casNumber', 'grade', 'use'],
    filters: ['subCategory', 'use'],
    searchableAttributes: ['casNumber', 'use'],
    defaultDocumentSlots: ['COA', 'MSDS', 'TDS'],
  },

  'herbal-extracts': {
    slug: 'herbal-extracts',
    label: 'Herbal Extracts',
    pluralLabel: 'Standardised Herbal Extracts',
    description:
      'Botanically standardised extracts for nutraceutical, Ayurvedic, and pharmaceutical formulations. HPLC-characterised active markers.',
    subCategories: [
      'Adaptogen', 'Anti-inflammatory', 'Antioxidant', 'Hepatoprotective',
      'Laxative', 'Sedative/Sleep Aid', 'Cardiovascular', 'Immune Support',
      'Herbal Extract',
    ],
    defaultGrade: 'Pharma Grade',
    defaultSubCategory: 'Herbal Extract',
    attributes: [
      { key: 'casNumber', label: 'CAS Number', type: 'text', helpText: 'Optional — herbal extracts often have no single CAS.' },
      { key: 'grade', label: 'Grade', type: 'text', placeholder: 'Pharma Grade, Food Grade, …' },
      { key: 'standardisation', label: 'Standardisation', type: 'text', translatable: true, placeholder: 'e.g. ≥5% withanolides by HPLC' },
      { key: 'purity', label: 'Purity', type: 'text' },
      { key: 'appearance', label: 'Appearance', type: 'text', translatable: true },
      { key: 'storageConditions', label: 'Storage Conditions', type: 'textarea', translatable: true },
      ...COMMON_FIELDS,
    ],
    listingColumns: ['name', 'standardisation', 'casNumber', 'subCategory'],
    filters: ['subCategory'],
    searchableAttributes: ['casNumber', 'standardisation'],
    defaultDocumentSlots: ['COA', 'MSDS', 'TDS'],
  },

  nutraceuticals: {
    slug: 'nutraceuticals',
    label: 'Nutraceuticals',
    pluralLabel: 'Nutraceutical Ingredients',
    description:
      'Vitamins, amino acids, coenzymes, and functional ingredients for dietary supplement, sports nutrition, and clinical nutrition products.',
    subCategories: [
      'Fat-Soluble Vitamin', 'Water-Soluble Vitamin', 'Amino Acid',
      'Coenzyme', 'Mineral', 'Probiotic', 'Omega-3', 'Nutraceutical',
    ],
    defaultGrade: 'USP',
    defaultSubCategory: 'Nutraceutical',
    attributes: [
      { key: 'casNumber', label: 'CAS Number', type: 'text' },
      { key: 'grade', label: 'Grade', type: 'text', placeholder: 'USP, Food Grade, Pharma Grade, …' },
      { key: 'molecularFormula', label: 'Molecular Formula', type: 'text' },
      { key: 'molecularWeight', label: 'Molecular Weight', type: 'text' },
      { key: 'purity', label: 'Purity', type: 'text' },
      { key: 'appearance', label: 'Appearance', type: 'text', translatable: true },
      { key: 'storageConditions', label: 'Storage Conditions', type: 'textarea', translatable: true },
      ...COMMON_FIELDS,
    ],
    listingColumns: ['name', 'casNumber', 'grade', 'subCategory'],
    filters: ['subCategory'],
    searchableAttributes: ['casNumber'],
    defaultDocumentSlots: ['COA', 'MSDS', 'TDS'],
  },

  'food-chemicals': {
    slug: 'food-chemicals',
    label: 'Food Chemicals',
    pluralLabel: 'Food-Grade Ingredients',
    description:
      'FSSAI-compliant food additives — preservatives, sweeteners, acidulants, colourants, and hydrocolloids for the F&B industry.',
    subCategories: [
      'Sweetener', 'Preservative', 'Acidulant', 'Antioxidant',
      'Hydrocolloid', 'Colourant', 'Flavour Enhancer', 'Emulsifier',
      'Food Additive',
    ],
    defaultGrade: 'Food Grade',
    defaultSubCategory: 'Food Additive',
    attributes: [
      { key: 'casNumber', label: 'CAS Number', type: 'text' },
      { key: 'grade', label: 'Grade', type: 'text', placeholder: 'Food Grade, FCC, …' },
      { key: 'eNumber', label: 'E-Number', type: 'text', placeholder: 'E211, E330, …' },
      { key: 'use', label: 'Functional Use', type: 'text', translatable: true },
      { key: 'molecularFormula', label: 'Molecular Formula', type: 'text' },
      { key: 'molecularWeight', label: 'Molecular Weight', type: 'text' },
      { key: 'purity', label: 'Purity', type: 'text' },
      { key: 'appearance', label: 'Appearance', type: 'text', translatable: true },
      { key: 'storageConditions', label: 'Storage Conditions', type: 'textarea', translatable: true },
      ...COMMON_FIELDS,
    ],
    listingColumns: ['name', 'casNumber', 'eNumber', 'subCategory'],
    filters: ['subCategory'],
    searchableAttributes: ['casNumber', 'eNumber'],
    defaultDocumentSlots: ['COA', 'MSDS', 'FSSAI', 'TDS'],
  },

  'dyes-and-intermediates': {
    slug: 'dyes-and-intermediates',
    label: 'Dyes & Intermediates',
    pluralLabel: 'Dyes, Pigments & Dye Intermediates',
    description:
      'Textile, food, and pharmaceutical dyes plus key dye intermediates. Available in commercial and pharma/BP grades.',
    subCategories: [
      'Azo Dye', 'Indigoid Dye', 'Thiazine Dye', 'Triphenylmethane Dye',
      'Reactive Dye', 'Acid Dye', 'Dye Intermediate', 'Dye / Colourant',
    ],
    defaultGrade: 'Commercial',
    defaultSubCategory: 'Dye / Colourant',
    attributes: [
      { key: 'casNumber', label: 'CAS Number', type: 'text' },
      { key: 'grade', label: 'Grade', type: 'text', placeholder: 'Commercial, Food Grade, BP, …' },
      { key: 'colourIndex', label: 'Colour Index (C.I.)', type: 'text', placeholder: 'C.I. 18050, …' },
      { key: 'use', label: 'Functional Use', type: 'text', translatable: true },
      { key: 'molecularFormula', label: 'Molecular Formula', type: 'text' },
      { key: 'molecularWeight', label: 'Molecular Weight', type: 'text' },
      { key: 'purity', label: 'Purity', type: 'text' },
      { key: 'appearance', label: 'Appearance', type: 'text', translatable: true },
      { key: 'storageConditions', label: 'Storage Conditions', type: 'textarea', translatable: true },
      ...COMMON_FIELDS,
    ],
    listingColumns: ['name', 'casNumber', 'colourIndex', 'subCategory'],
    filters: ['subCategory'],
    searchableAttributes: ['casNumber', 'colourIndex'],
    defaultDocumentSlots: ['COA', 'MSDS', 'TDS'],
  },

  impurities: {
    slug: 'impurities',
    label: 'Impurities & Reference Standards',
    pluralLabel: 'Impurities & Reference Standards',
    description:
      'Certified reference standards for ICH Q3A/Q3B impurity profiling and pharmacopoeial-monograph related-substance testing.',
    subCategories: [
      'Process Impurity', 'Degradation Impurity', 'Metabolite/Impurity',
      'Genotoxic Impurity', 'Reference Standard',
    ],
    defaultGrade: 'Reference Standard',
    defaultSubCategory: 'Reference Standard',
    attributes: [
      { key: 'casNumber', label: 'CAS Number', type: 'text' },
      { key: 'grade', label: 'Grade', type: 'text', placeholder: 'Reference Standard, …' },
      { key: 'parentApi', label: 'Parent API', type: 'text', placeholder: 'e.g. Paracetamol' },
      { key: 'purity', label: 'Purity', type: 'text' },
      { key: 'molecularFormula', label: 'Molecular Formula', type: 'text' },
      { key: 'molecularWeight', label: 'Molecular Weight', type: 'text' },
      { key: 'appearance', label: 'Appearance', type: 'text', translatable: true },
      { key: 'storageConditions', label: 'Storage Conditions', type: 'textarea', translatable: true },
      ...COMMON_FIELDS,
    ],
    listingColumns: ['name', 'casNumber', 'parentApi', 'subCategory'],
    filters: ['subCategory', 'parentApi'],
    searchableAttributes: ['casNumber', 'parentApi'],
    defaultDocumentSlots: ['COA', 'MSDS', 'TDS'],
  },

  'organic-inorganic': {
    slug: 'organic-inorganic',
    label: 'Organic & Inorganic',
    pluralLabel: 'Organic & Inorganic Lab Chemicals',
    description:
      'Laboratory and analytical reagents — AR, HPLC, and ACS grades for research, QC, and analytical chemistry.',
    subCategories: [
      'Organic Solvent/Reagent', 'Inorganic Salt/Reagent', 'Acid', 'Base',
      'Oxidising Agent', 'Reducing Agent', 'Indicator', 'Lab Chemical',
    ],
    defaultGrade: 'AR',
    defaultSubCategory: 'Lab Chemical',
    attributes: [
      { key: 'casNumber', label: 'CAS Number', type: 'text' },
      { key: 'grade', label: 'Grade', type: 'text', placeholder: 'AR, HPLC, ACS, LR, …' },
      {
        key: 'type',
        label: 'Type',
        type: 'select',
        options: ['Organic', 'Inorganic'],
        required: true,
      },
      { key: 'molecularFormula', label: 'Molecular Formula', type: 'text' },
      { key: 'molecularWeight', label: 'Molecular Weight', type: 'text' },
      { key: 'purity', label: 'Purity', type: 'text' },
      { key: 'appearance', label: 'Appearance', type: 'text', translatable: true },
      { key: 'storageConditions', label: 'Storage Conditions', type: 'textarea', translatable: true },
      ...COMMON_FIELDS,
    ],
    listingColumns: ['name', 'casNumber', 'grade', 'type'],
    filters: ['type', 'subCategory'],
    searchableAttributes: ['casNumber'],
    defaultDocumentSlots: ['COA', 'MSDS', 'TDS'],
  },

  pellets: {
    slug: 'pellets',
    label: 'Pellets',
    pluralLabel: 'Multi-Particulate Pellet Systems',
    description:
      'MCC and sugar-sphere starter pellets, drug-layered pellets, and modified-release multi-particulate systems for capsule formulations.',
    subCategories: [
      'Starter Pellets', 'Enteric Coated', 'ER Pellets', 'SR Pellets',
      'IR Pellets', 'Drug-Layered Pellets', 'Pellet System',
    ],
    defaultGrade: 'Pharma Grade',
    defaultSubCategory: 'Pellet System',
    attributes: [
      { key: 'casNumber', label: 'CAS Number', type: 'text', helpText: 'Optional — some pellet systems are multi-component.' },
      { key: 'grade', label: 'Grade', type: 'text', placeholder: 'Pharma Grade, NF, …' },
      { key: 'pelletSize', label: 'Pellet Size', type: 'text', placeholder: 'e.g. 90–150 µm' },
      { key: 'pelletType', label: 'Pellet Type', type: 'text', translatable: true, placeholder: 'Starter, Enteric Coated, SR, …' },
      { key: 'use', label: 'Functional Use', type: 'text', translatable: true, placeholder: 'Substrate for drug layering, etc.' },
      { key: 'molecularFormula', label: 'Molecular Formula', type: 'text' },
      { key: 'molecularWeight', label: 'Molecular Weight', type: 'text' },
      { key: 'purity', label: 'Purity', type: 'text' },
      { key: 'appearance', label: 'Appearance', type: 'text', translatable: true },
      { key: 'storageConditions', label: 'Storage Conditions', type: 'textarea', translatable: true },
      ...COMMON_FIELDS,
    ],
    listingColumns: ['name', 'pelletSize', 'pelletType', 'use'],
    filters: ['subCategory', 'pelletType'],
    searchableAttributes: ['casNumber', 'pelletType'],
    defaultDocumentSlots: ['COA', 'MSDS', 'TDS', 'DMF'],
  },
} as const satisfies Record<string, CategorySchema>

export type CategorySlug = keyof typeof CATEGORY_SCHEMAS

export const ALL_CATEGORY_SLUGS = Object.keys(CATEGORY_SCHEMAS) as readonly CategorySlug[]

export function getCategorySchema(slug: string): CategorySchema | undefined {
  return (CATEGORY_SCHEMAS as Record<string, CategorySchema>)[slug]
}

/**
 * Set of attribute keys flagged translatable for a given category. Used by the
 * admin save path to split incoming form values between
 * `products.attributes` (canonical) and `product_translations.attributes`.
 */
export function translatableKeys(schema: CategorySchema): Set<string> {
  return new Set(schema.attributes.filter((f) => f.translatable).map((f) => f.key))
}
