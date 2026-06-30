/**
 * Single source of truth for every admin-editable string on the public site.
 *
 * Two consumers:
 *   1. Public pages — import these as defaults and pass them to the `t()`
 *      lookup so the override (if any) wins, else the default renders.
 *   2. Admin content editor — reads this registry to pre-fill the form with
 *      the EXACT string currently visible on the page.
 *
 * When the hardcoded copy on a page changes, only this file needs updating.
 */

export type EditableSlot = {
  /** Stable key the admin form/Override table uses. */
  key: string
  /** Label shown in the admin form. */
  label: string
  /** Optional help text under the input. */
  help?: string
  /** Widget type. `textarea` for longer body copy. */
  widget: 'text' | 'textarea'
  /** Exact string as currently rendered on the page. */
  defaultValue: string
  /** Optional group label so the admin form can section-divide. */
  group?: string
}

export type PageDefaults = {
  path: string
  slots: EditableSlot[]
}

/* ─── Common hero slot builder ─────────────────────────────────────────── */

function hero(
  eyebrow: string,
  title: string,
  description: string,
): EditableSlot[] {
  return [
    {
      key: 'header.eyebrow',
      label: 'Hero eyebrow',
      help: 'Small uppercase line above the page title.',
      widget: 'text',
      defaultValue: eyebrow,
      group: 'Hero',
    },
    {
      key: 'header.title',
      label: 'Hero title',
      widget: 'text',
      defaultValue: title,
      group: 'Hero',
    },
    {
      key: 'header.description',
      label: 'Hero description',
      widget: 'textarea',
      defaultValue: description,
      group: 'Hero',
    },
  ]
}

/* ─── Page registry ───────────────────────────────────────────────────────
 *
 * Heroes are filled in literally from the current static pages. Body slots
 * are added for the flagship pages that have substantial editorial content.
 * Add more slots/pages over time as needed.
 */

const HOME: PageDefaults = {
  path: '/',
  slots: [
    /* ── Hero ─────────────────────────────────────────────────────── */
    { key: 'home.hero.kicker', label: 'Hero kicker chip', widget: 'text', defaultValue: 'Inside Astonea Labs · Chandigarh', group: 'Hero' },
    { key: 'home.hero.chapter', label: 'Hero chapter line', widget: 'text', defaultValue: '01 / Manufacturing', group: 'Hero' },
    { key: 'home.hero.headline', label: 'Hero headline', widget: 'text', defaultValue: 'Trusted Pharmaceutical Manufacturing for Brands Ready to Scale.', group: 'Hero' },
    { key: 'home.hero.supporting', label: 'Hero supporting paragraph', widget: 'textarea', defaultValue: 'WHO-GMP certified manufacturer of tablets, capsules, syrups, topical formulations, and cosmetics. Helping healthcare, nutraceutical, and personal care brands launch faster with consistent quality.', group: 'Hero' },
    { key: 'home.hero.cta_primary', label: 'Hero primary CTA', widget: 'text', defaultValue: 'Explore Capabilities', group: 'Hero' },
    { key: 'home.hero.cta_secondary', label: 'Hero secondary CTA', widget: 'text', defaultValue: 'Enquire Now', group: 'Hero' },
    { key: 'home.hero.tag_0', label: 'Hero tag 1', widget: 'text', defaultValue: 'EST. 2017', group: 'Hero tags' },
    { key: 'home.hero.tag_1', label: 'Hero tag 2', widget: 'text', defaultValue: 'BSE-SME LISTED', group: 'Hero tags' },
    { key: 'home.hero.tag_2', label: 'Hero tag 3', widget: 'text', defaultValue: 'WHO-GMP', group: 'Hero tags' },
    { key: 'home.hero.tag_3', label: 'Hero tag 4', widget: 'text', defaultValue: 'ISO 9001:2015', group: 'Hero tags' },
    { key: 'home.hero.caption_primary', label: 'Hero primary image caption', widget: 'text', defaultValue: 'Analytical Bench / QC Release', group: 'Hero' },
    { key: 'home.hero.caption_secondary', label: 'Hero secondary image caption', widget: 'text', defaultValue: 'Finished Dosage', group: 'Hero' },
    { key: 'home.hero.scroll_cue', label: 'Hero scroll cue', widget: 'text', defaultValue: 'Scroll', group: 'Hero' },

    /* ── Proof / "Built for brands" ──────────────────────────────── */
    { key: 'home.proof.label', label: 'Proof section label', widget: 'text', defaultValue: 'Manufacturing Partner', group: 'Proof section' },
    { key: 'home.proof.heading', label: 'Proof heading', widget: 'textarea', defaultValue: 'Built for brands that need science, speed, and steady supply.', group: 'Proof section' },
    { key: 'home.proof.description', label: 'Proof description', widget: 'textarea', defaultValue: 'Astonea Labs Limited is a BSE-SME pharma and cosmetics manufacturer serving founders, exporters, and established labels with GMP-led production and practical launch support.', group: 'Proof section' },
    { key: 'home.proof.cta_primary', label: 'Proof primary CTA', widget: 'text', defaultValue: 'Our Story', group: 'Proof section' },
    { key: 'home.proof.cta_secondary', label: 'Proof secondary CTA', widget: 'text', defaultValue: 'Certifications', group: 'Proof section' },

    { key: 'home.proof.stat_0.value', label: 'Stat 1 value', help: 'Number for animated counter (digits only) — leave blank for non-numeric.', widget: 'text', defaultValue: '2000', group: 'Proof stats' },
    { key: 'home.proof.stat_0.suffix', label: 'Stat 1 suffix', widget: 'text', defaultValue: '+', group: 'Proof stats' },
    { key: 'home.proof.stat_0.label', label: 'Stat 1 label', widget: 'text', defaultValue: 'Client Brands', group: 'Proof stats' },
    { key: 'home.proof.stat_0.detail', label: 'Stat 1 detail', widget: 'textarea', defaultValue: 'Across pharma, wellness, and personal care.', group: 'Proof stats' },

    { key: 'home.proof.stat_1.value', label: 'Stat 2 value', widget: 'text', defaultValue: '1500', group: 'Proof stats' },
    { key: 'home.proof.stat_1.suffix', label: 'Stat 2 suffix', widget: 'text', defaultValue: '+', group: 'Proof stats' },
    { key: 'home.proof.stat_1.label', label: 'Stat 2 label', widget: 'text', defaultValue: 'Product Approvals', group: 'Proof stats' },
    { key: 'home.proof.stat_1.detail', label: 'Stat 2 detail', widget: 'textarea', defaultValue: 'Formulations cleared for commercial launch.', group: 'Proof stats' },

    { key: 'home.proof.stat_2.value', label: 'Stat 3 value', widget: 'text', defaultValue: '7', group: 'Proof stats' },
    { key: 'home.proof.stat_2.suffix', label: 'Stat 3 suffix', widget: 'text', defaultValue: '+', group: 'Proof stats' },
    { key: 'home.proof.stat_2.label', label: 'Stat 3 label', widget: 'text', defaultValue: 'Years of Excellence', group: 'Proof stats' },
    { key: 'home.proof.stat_2.detail', label: 'Stat 3 detail', widget: 'textarea', defaultValue: 'Manufacturing since 2017 in Chandigarh.', group: 'Proof stats' },

    { key: 'home.proof.stat_3.value', label: 'Stat 4 value', help: 'Non-numeric — renders as text directly.', widget: 'text', defaultValue: 'Pan-India', group: 'Proof stats' },
    { key: 'home.proof.stat_3.suffix', label: 'Stat 4 suffix', widget: 'text', defaultValue: '', group: 'Proof stats' },
    { key: 'home.proof.stat_3.label', label: 'Stat 4 label', widget: 'text', defaultValue: 'Market Reach', group: 'Proof stats' },
    { key: 'home.proof.stat_3.detail', label: 'Stat 4 detail', widget: 'textarea', defaultValue: 'Distributor and export-ready operations.', group: 'Proof stats' },

    /* ── Capabilities ─────────────────────────────────────────────── */
    { key: 'home.capabilities.label', label: 'Capabilities label', widget: 'text', defaultValue: 'Capabilities', group: 'Capabilities section' },
    { key: 'home.capabilities.heading', label: 'Capabilities heading', widget: 'text', defaultValue: 'One manufacturing floor. Many routes to market.', group: 'Capabilities section' },
    { key: 'home.capabilities.subtext', label: 'Capabilities sub-text', widget: 'textarea', defaultValue: 'From formulation through packaging and paperwork, the work stays connected: facilities, lab discipline, product handling, and regulatory follow-through all move in one rhythm.', group: 'Capabilities section' },
    { key: 'home.capabilities.cta', label: 'Capability card "Learn more" link label', widget: 'text', defaultValue: 'Learn More', group: 'Capabilities section' },

    { key: 'home.capabilities.card_0.kicker', label: 'Card 1 kicker', widget: 'text', defaultValue: 'Solid dosage', group: 'Capability cards' },
    { key: 'home.capabilities.card_0.title', label: 'Card 1 title', widget: 'text', defaultValue: 'Pharma tablets and capsules', group: 'Capability cards' },
    { key: 'home.capabilities.card_0.desc', label: 'Card 1 description', widget: 'textarea', defaultValue: 'Conventional, coated, enteric, and extended-release dosage formats for dependable batch output.', group: 'Capability cards' },

    { key: 'home.capabilities.card_1.kicker', label: 'Card 2 kicker', widget: 'text', defaultValue: 'Formulation breadth', group: 'Capability cards' },
    { key: 'home.capabilities.card_1.title', label: 'Card 2 title', widget: 'text', defaultValue: 'Liquid and topical lines', group: 'Capability cards' },
    { key: 'home.capabilities.card_1.desc', label: 'Card 2 description', widget: 'textarea', defaultValue: 'Syrups, suspensions, drops, creams, ointments, and gels with controlled stability and texture.', group: 'Capability cards' },

    { key: 'home.capabilities.card_2.kicker', label: 'Card 3 kicker', widget: 'text', defaultValue: 'Brand-ready SKUs', group: 'Capability cards' },
    { key: 'home.capabilities.card_2.title', label: 'Card 3 title', widget: 'text', defaultValue: 'Cosmetics and personal care', group: 'Capability cards' },
    { key: 'home.capabilities.card_2.desc', label: 'Card 3 description', widget: 'textarea', defaultValue: 'Serums, face wash, lotions, hair care, and white-label launches built around your market position.', group: 'Capability cards' },

    { key: 'home.capabilities.card_3.kicker', label: 'Card 4 kicker', widget: 'text', defaultValue: 'Regulatory support', group: 'Capability cards' },
    { key: 'home.capabilities.card_3.title', label: 'Card 4 title', widget: 'text', defaultValue: 'Compliance and documentation', group: 'Capability cards' },
    { key: 'home.capabilities.card_3.desc', label: 'Card 4 description', widget: 'textarea', defaultValue: 'Dossiers, labels, export documentation, certificates, and release discipline handled end to end.', group: 'Capability cards' },

    /* ── Industries ──────────────────────────────────────────────── */
    { key: 'home.industries.label', label: 'Industries label', widget: 'text', defaultValue: 'Industries We Serve', group: 'Industries section' },
    { key: 'home.industries.heading', label: 'Industries heading', widget: 'text', defaultValue: 'One floor, six product worlds.', group: 'Industries section' },
    { key: 'home.industries.subtext', label: 'Industries sub-text', widget: 'textarea', defaultValue: 'Pharma, nutraceutical, cosmetic, and wellness brands share the same GMP-graded production floor — separated by process, joined by the same discipline around batch records, release, and traceability.', group: 'Industries section' },

    { key: 'home.industries.item_0.name', label: 'Industry 1 name', widget: 'text', defaultValue: 'Pharmaceuticals', group: 'Industries list' },
    { key: 'home.industries.item_0.desc', label: 'Industry 1 description', widget: 'textarea', defaultValue: 'Tablets, capsules, syrups, dry syrups, and topicals across acute and chronic categories.', group: 'Industries list' },
    { key: 'home.industries.item_1.name', label: 'Industry 2 name', widget: 'text', defaultValue: 'Nutraceuticals', group: 'Industries list' },
    { key: 'home.industries.item_1.desc', label: 'Industry 2 description', widget: 'textarea', defaultValue: 'Vitamins, minerals, protein, and functional supplements built for retail and DTC launches.', group: 'Industries list' },
    { key: 'home.industries.item_2.name', label: 'Industry 3 name', widget: 'text', defaultValue: 'Cosmetics', group: 'Industries list' },
    { key: 'home.industries.item_2.desc', label: 'Industry 3 description', widget: 'textarea', defaultValue: 'Serums, lotions, creams, face wash, and hair care formulated for sensorial brand experience.', group: 'Industries list' },
    { key: 'home.industries.item_3.name', label: 'Industry 4 name', widget: 'text', defaultValue: 'Ayurveda & Herbal', group: 'Industries list' },
    { key: 'home.industries.item_3.desc', label: 'Industry 4 description', widget: 'textarea', defaultValue: 'AYUSH-licensed botanicals, classical formulations, and modern phyto-pharma launches.', group: 'Industries list' },
    { key: 'home.industries.item_4.name', label: 'Industry 5 name', widget: 'text', defaultValue: 'Veterinary', group: 'Industries list' },
    { key: 'home.industries.item_4.desc', label: 'Industry 5 description', widget: 'textarea', defaultValue: 'Animal health tablets, oral suspensions, and feed-grade premixes manufactured to GMP norms.', group: 'Industries list' },
    { key: 'home.industries.item_5.name', label: 'Industry 6 name', widget: 'text', defaultValue: 'OTC & Wellness', group: 'Industries list' },
    { key: 'home.industries.item_5.desc', label: 'Industry 6 description', widget: 'textarea', defaultValue: 'Pain relief, digestives, immunity boosters, and lifestyle SKUs ready for distribution at scale.', group: 'Industries list' },

    /* ── Fade chapters ────────────────────────────────────────────── */
    { key: 'home.fade.chapter_0.kicker', label: 'Chapter 1 kicker', widget: 'text', defaultValue: 'Chapter 01', group: 'Fade chapters' },
    { key: 'home.fade.chapter_0.label', label: 'Chapter 1 label', widget: 'text', defaultValue: 'Analytical Lab', group: 'Fade chapters' },
    { key: 'home.fade.chapter_1.kicker', label: 'Chapter 2 kicker', widget: 'text', defaultValue: 'Chapter 02', group: 'Fade chapters' },
    { key: 'home.fade.chapter_1.label', label: 'Chapter 2 label', widget: 'text', defaultValue: 'Raw Material QC', group: 'Fade chapters' },
    { key: 'home.fade.chapter_2.kicker', label: 'Chapter 3 kicker', widget: 'text', defaultValue: 'Chapter 03', group: 'Fade chapters' },
    { key: 'home.fade.chapter_2.label', label: 'Chapter 3 label', widget: 'text', defaultValue: 'Sterile Fill', group: 'Fade chapters' },
    { key: 'home.fade.chapter_3.kicker', label: 'Chapter 4 kicker', widget: 'text', defaultValue: 'Chapter 04', group: 'Fade chapters' },
    { key: 'home.fade.chapter_3.label', label: 'Chapter 4 label', widget: 'text', defaultValue: 'Finished Goods', group: 'Fade chapters' },

    /* ── Lab gallery ─────────────────────────────────────────────── */
    { key: 'home.lab.label', label: 'Lab gallery label', widget: 'text', defaultValue: 'Inside the Lab', group: 'Lab gallery' },
    { key: 'home.lab.heading', label: 'Lab gallery heading', widget: 'text', defaultValue: 'Where every batch earns its release.', group: 'Lab gallery' },
    { key: 'home.lab.subtext', label: 'Lab gallery sub-text', widget: 'textarea', defaultValue: "Walking through the floor — from raw-material assay to sterile fill, sampling, and finished-goods checks. Quality isn't a stamp at the end, it's the discipline you can see at every station.", group: 'Lab gallery' },
    { key: 'home.lab.caption_0', label: 'Caption 1', widget: 'text', defaultValue: 'Analytical bench, QC release', group: 'Lab gallery' },
    { key: 'home.lab.caption_1', label: 'Caption 2', widget: 'text', defaultValue: 'Raw material assay', group: 'Lab gallery' },
    { key: 'home.lab.caption_2', label: 'Caption 3', widget: 'text', defaultValue: 'Finished dosage check', group: 'Lab gallery' },
    { key: 'home.lab.caption_3', label: 'Caption 4', widget: 'text', defaultValue: 'Sterile fill line', group: 'Lab gallery' },
    { key: 'home.lab.caption_4', label: 'Caption 5', widget: 'text', defaultValue: 'Liquid injectables', group: 'Lab gallery' },
    { key: 'home.lab.caption_5', label: 'Caption 6', widget: 'text', defaultValue: 'Stability sampling', group: 'Lab gallery' },

    /* ── Quality ─────────────────────────────────────────────────── */
    { key: 'home.quality.label', label: 'Quality label', widget: 'text', defaultValue: 'Quality System', group: 'Quality section' },
    { key: 'home.quality.heading', label: 'Quality heading', widget: 'text', defaultValue: 'Digital ambition with GMP discipline underneath.', group: 'Quality section' },
    { key: 'home.quality.subtext', label: 'Quality sub-text', widget: 'textarea', defaultValue: 'Clean-room proof meets forward-looking biotech systems, helping each product move from idea to validated output with control.', group: 'Quality section' },
    { key: 'home.quality.badge_0', label: 'Badge 1', widget: 'text', defaultValue: 'WHO-GMP', group: 'Quality section' },
    { key: 'home.quality.badge_1', label: 'Badge 2', widget: 'text', defaultValue: 'ISO 9001:2015', group: 'Quality section' },
    { key: 'home.quality.badge_2', label: 'Badge 3', widget: 'text', defaultValue: 'AYUSH', group: 'Quality section' },
    { key: 'home.quality.badge_3', label: 'Badge 4', widget: 'text', defaultValue: 'FSSAI', group: 'Quality section' },

    { key: 'home.process.step_0.title', label: 'Process step 1 title', widget: 'text', defaultValue: 'Brief and formulation', group: 'Process steps' },
    { key: 'home.process.step_0.detail', label: 'Process step 1 detail', widget: 'textarea', defaultValue: 'We shape the product spec, claims, ingredients, packaging route, and commercial target.', group: 'Process steps' },
    { key: 'home.process.step_1.title', label: 'Process step 2 title', widget: 'text', defaultValue: 'Pilot and validation', group: 'Process steps' },
    { key: 'home.process.step_1.detail', label: 'Process step 2 detail', widget: 'textarea', defaultValue: 'Trial batches, stability checks, quality controls, and documentation tighten the formula before scale.', group: 'Process steps' },
    { key: 'home.process.step_2.title', label: 'Process step 3 title', widget: 'text', defaultValue: 'GMP manufacturing', group: 'Process steps' },
    { key: 'home.process.step_2.detail', label: 'Process step 3 detail', widget: 'textarea', defaultValue: 'Controlled rooms, trained operators, and batch records keep production repeatable and audit-ready.', group: 'Process steps' },
    { key: 'home.process.step_3.title', label: 'Process step 4 title', widget: 'text', defaultValue: 'Dispatch and support', group: 'Process steps' },
    { key: 'home.process.step_3.detail', label: 'Process step 4 detail', widget: 'textarea', defaultValue: 'Finished goods move with the paperwork, batch traceability, and follow-through your team needs.', group: 'Process steps' },

    /* ── Investor ────────────────────────────────────────────────── */
    { key: 'home.investor.label', label: 'Investor label', widget: 'text', defaultValue: 'Investor Relations', group: 'Investor section' },
    { key: 'home.investor.heading', label: 'Investor heading', widget: 'text', defaultValue: 'Listed, documented, and easy to evaluate.', group: 'Investor section' },
    { key: 'home.investor.subtext', label: 'Investor sub-text', widget: 'textarea', defaultValue: 'Financial results, annual reports, SEBI disclosures, and governance documents stay accessible for shareholders and market watchers.', group: 'Investor section' },
    { key: 'home.investor.fact_0.label', label: 'Fact 1 label', widget: 'text', defaultValue: 'CIN', group: 'Investor facts' },
    { key: 'home.investor.fact_0.value', label: 'Fact 1 value', widget: 'text', defaultValue: 'L24304CH2017PLC041482', group: 'Investor facts' },
    { key: 'home.investor.fact_1.label', label: 'Fact 2 label', widget: 'text', defaultValue: 'Listing', group: 'Investor facts' },
    { key: 'home.investor.fact_1.value', label: 'Fact 2 value', widget: 'text', defaultValue: 'BSE', group: 'Investor facts' },
    { key: 'home.investor.fact_2.label', label: 'Fact 3 label', widget: 'text', defaultValue: 'Sector', group: 'Investor facts' },
    { key: 'home.investor.fact_2.value', label: 'Fact 3 value', widget: 'text', defaultValue: 'Pharma and cosmetics', group: 'Investor facts' },
    { key: 'home.investor.cta_primary', label: 'Investor primary CTA', widget: 'text', defaultValue: 'Financial Results', group: 'Investor section' },
    { key: 'home.investor.cta_secondary', label: 'Investor secondary CTA', widget: 'text', defaultValue: 'Annual Reports', group: 'Investor section' },
    { key: 'home.investor.cta_tertiary', label: 'Investor tertiary CTA', widget: 'text', defaultValue: 'SEBI Disclosures', group: 'Investor section' },

    /* ── CTA ─────────────────────────────────────────────────────── */
    { key: 'home.cta.label', label: 'CTA label', widget: 'text', defaultValue: 'Start With Astonea', group: 'Final CTA' },
    { key: 'home.cta.heading', label: 'CTA heading', widget: 'text', defaultValue: 'Your formulation deserves a sharper manufacturing partner.', group: 'Final CTA' },
    { key: 'home.cta.subtext', label: 'CTA sub-text', widget: 'textarea', defaultValue: 'Share the product you want to build, the market you want to enter, and the timeline you are working toward. We will help shape the route from formulation to dispatch.', group: 'Final CTA' },
    { key: 'home.cta.primary', label: 'CTA primary button', widget: 'text', defaultValue: 'Start a Conversation', group: 'Final CTA' },
    { key: 'home.cta.secondary', label: 'CTA secondary button', widget: 'text', defaultValue: 'View Facility', group: 'Final CTA' },
  ],
}

const ABOUT_US: PageDefaults = {
  path: '/about-us',
  slots: [
    ...hero(
      'Our Company',
      'Inspiring Trust in Healthcare, Elevating Beauty with Elegance',
      "Astonea Labs Limited is a GMP-certified, BSE-SME listed pharmaceutical and cosmetic contract manufacturer headquartered in Chandigarh — delivering quality, regulatory confidence, and supply-chain reliability since 2017.",
    ),
    {
      key: 'about.certifications.label',
      label: 'Certifications strip label',
      widget: 'text',
      defaultValue: 'Regulatory & Compliance Credentials',
      group: 'Certifications strip',
    },
    {
      key: 'about.who_we_are.label',
      label: '"Who We Are" — label',
      widget: 'text',
      defaultValue: 'Who We Are',
      group: 'Who We Are',
    },
    {
      key: 'about.who_we_are.heading',
      label: '"Who We Are" — heading',
      widget: 'textarea',
      defaultValue:
        "India's trusted name in third-party pharmaceutical & cosmetic manufacturing",
      group: 'Who We Are',
    },
    {
      key: 'about.who_we_are.body',
      label: '"Who We Are" — body',
      widget: 'textarea',
      defaultValue:
        'From a single facility in Haryana to serving over 3,200 brands across India and abroad — we have grown by keeping one principle constant: that quality is not a department, it is the entire operation.',
      group: 'Who We Are',
    },
    {
      key: 'about.foundation.label',
      label: '"Our Foundation" — label',
      widget: 'text',
      defaultValue: 'Our Foundation',
      group: 'Our Foundation',
    },
    {
      key: 'about.foundation.heading',
      label: '"Our Foundation" — heading',
      widget: 'textarea',
      defaultValue: 'GMP-compliant, BSE-SME, and built for scale',
      group: 'Our Foundation',
    },
    {
      key: 'about.foundation.body_1',
      label: '"Our Foundation" — paragraph 1',
      widget: 'textarea',
      defaultValue:
        'Astonea Labs Limited is incorporated in Chandigarh with our manufacturing facility in Village Haripur, Tehsil Raipur Rani, District Panchkula, Haryana — within a well-connected industrial belt with strong logistics access across North India.',
      group: 'Our Foundation',
    },
    {
      key: 'about.foundation.body_2',
      label: '"Our Foundation" — paragraph 2',
      widget: 'textarea',
      defaultValue:
        'Since 2017, we have grown to serve emerging startups, established domestic brands, and international exporters — delivering formulation precision, regulatory confidence, and supply-chain reliability across pharmaceutical and cosmetic segments.',
      group: 'Our Foundation',
    },
    {
      key: 'about.paths.label',
      label: '"Who Are You?" — label',
      widget: 'text',
      defaultValue: 'Who Are You?',
      group: 'Find your path',
    },
    {
      key: 'about.paths.heading',
      label: '"Find your path" — heading',
      widget: 'text',
      defaultValue: 'Find your path with Astonea Labs',
      group: 'Find your path',
    },
    {
      key: 'about.founder.label',
      label: 'Founder section label',
      widget: 'text',
      defaultValue: 'Founder & Managing Director',
      group: 'Founder',
    },
    {
      key: 'about.founder.title',
      label: 'Founder title line',
      widget: 'text',
      defaultValue: 'Founder & Managing Director, Astonea Labs Limited',
      group: 'Founder',
    },
    {
      key: 'about.founder.quote',
      label: 'Founder quote',
      widget: 'textarea',
      defaultValue:
        'Our commitment is not to manufacture products — it is to manufacture trust, batch after batch, for every brand that puts their name on what we make.',
      group: 'Founder',
    },
    {
      key: 'about.founder.name',
      label: 'Founder name',
      widget: 'text',
      defaultValue: 'Mr. Ashish Gulati',
      group: 'Founder',
    },
    {
      key: 'about.founder.bio',
      label: 'Founder bio',
      widget: 'textarea',
      defaultValue:
        "A visionary entrepreneur driving the company's evolution into a global hub for pharmaceutical and cosmetic manufacturing. Educated at Hansraj Public School and Oxford Brookes University (Motorsport Engineering), Mr. Gulati combines exceptional business acumen with strong organisational leadership. Under his direction, Astonea Labs became BSE-SME and has expanded its client base across India's most competitive pharmaceutical and cosmetic markets.",
      group: 'Founder',
    },
    {
      key: 'about.pillars.heading',
      label: '"Our Pillars" — heading',
      widget: 'text',
      defaultValue: 'What drives everything we do',
      group: 'Our Pillars',
    },
    {
      key: 'about.pillars.subtext',
      label: '"Our Pillars" — sub-text',
      widget: 'textarea',
      defaultValue:
        'Four non-negotiable commitments informing every decision from factory floor to client delivery.',
      group: 'Our Pillars',
    },
    {
      key: 'about.sectors.label',
      label: '"Sectors We Serve" — label',
      widget: 'text',
      defaultValue: 'Sectors We Serve',
      group: 'Sectors',
    },
    {
      key: 'about.sectors.heading',
      label: '"Sectors We Serve" — heading',
      widget: 'text',
      defaultValue: 'Dual-sector expertise, one trusted partner',
      group: 'Sectors',
    },
    {
      key: 'about.cta.heading',
      label: 'CTA heading',
      widget: 'text',
      defaultValue: 'Ready to bring your product to market?',
      group: 'CTA',
    },
    {
      key: 'about.cta.body',
      label: 'CTA body',
      widget: 'textarea',
      defaultValue:
        "Whether you're a brand owner, a startup entering pharma, or an investor — we're ready to build something together.",
      group: 'CTA',
    },
    { key: 'about.cta.primary', label: 'CTA primary button', widget: 'text', defaultValue: 'Get in Touch', group: 'CTA' },
    { key: 'about.cta.secondary', label: 'CTA secondary button', widget: 'text', defaultValue: 'Our Services', group: 'CTA' },

    /* ── Trust metrics bar ───────────────────────────────────────── */
    { key: 'about.metric_0.value', label: 'Metric 1 value', widget: 'text', defaultValue: '3,200+', group: 'Trust metrics' },
    { key: 'about.metric_0.label', label: 'Metric 1 label', widget: 'text', defaultValue: 'Brands Served', group: 'Trust metrics' },
    { key: 'about.metric_0.sub', label: 'Metric 1 sub-text', widget: 'text', defaultValue: 'Pharma & cosmetics', group: 'Trust metrics' },
    { key: 'about.metric_1.value', label: 'Metric 2 value', widget: 'text', defaultValue: '2,500+', group: 'Trust metrics' },
    { key: 'about.metric_1.label', label: 'Metric 2 label', widget: 'text', defaultValue: 'Product Approvals', group: 'Trust metrics' },
    { key: 'about.metric_1.sub', label: 'Metric 2 sub-text', widget: 'text', defaultValue: 'Formulations cleared', group: 'Trust metrics' },
    { key: 'about.metric_2.value', label: 'Metric 3 value', widget: 'text', defaultValue: '9+', group: 'Trust metrics' },
    { key: 'about.metric_2.label', label: 'Metric 3 label', widget: 'text', defaultValue: 'Years of Excellence', group: 'Trust metrics' },
    { key: 'about.metric_2.sub', label: 'Metric 3 sub-text', widget: 'text', defaultValue: 'Founded 2017', group: 'Trust metrics' },
    { key: 'about.metric_3.value', label: 'Metric 4 value', widget: 'text', defaultValue: 'Pan-India', group: 'Trust metrics' },
    { key: 'about.metric_3.label', label: 'Metric 4 label', widget: 'text', defaultValue: 'Export Reach', group: 'Trust metrics' },
    { key: 'about.metric_3.sub', label: 'Metric 4 sub-text', widget: 'text', defaultValue: '& international', group: 'Trust metrics' },

    /* ── Certifications strip ────────────────────────────────────── */
    { key: 'about.cert_0.code', label: 'Cert 1 code', widget: 'text', defaultValue: 'GMP', group: 'Certifications' },
    { key: 'about.cert_0.label', label: 'Cert 1 label', widget: 'text', defaultValue: 'Good Manufacturing Practice', group: 'Certifications' },
    { key: 'about.cert_0.desc', label: 'Cert 1 description', widget: 'text', defaultValue: 'WHO-GMP compliant facility', group: 'Certifications' },
    { key: 'about.cert_1.code', label: 'Cert 2 code', widget: 'text', defaultValue: 'BSE-SME', group: 'Certifications' },
    { key: 'about.cert_1.label', label: 'Cert 2 label', widget: 'text', defaultValue: 'Listed Company', group: 'Certifications' },
    { key: 'about.cert_1.desc', label: 'Cert 2 description', widget: 'text', defaultValue: 'CIN: L24304CH2017PLC041482', group: 'Certifications' },
    { key: 'about.cert_2.code', label: 'Cert 3 code', widget: 'text', defaultValue: 'ISO', group: 'Certifications' },
    { key: 'about.cert_2.label', label: 'Cert 3 label', widget: 'text', defaultValue: 'Quality Systems', group: 'Certifications' },
    { key: 'about.cert_2.desc', label: 'Cert 3 description', widget: 'text', defaultValue: 'Documented quality standards', group: 'Certifications' },
    { key: 'about.cert_3.code', label: 'Cert 4 code', widget: 'text', defaultValue: 'FSSAI', group: 'Certifications' },
    { key: 'about.cert_3.label', label: 'Cert 4 label', widget: 'text', defaultValue: 'Food Safety', group: 'Certifications' },
    { key: 'about.cert_3.desc', label: 'Cert 4 description', widget: 'text', defaultValue: 'Nutraceuticals approved', group: 'Certifications' },

    /* ── Foundation facts ────────────────────────────────────────── */
    { key: 'about.fact_0.label', label: 'Fact 1 label', widget: 'text', defaultValue: 'Incorporation', group: 'Foundation facts' },
    { key: 'about.fact_0.value', label: 'Fact 1 value', widget: 'text', defaultValue: '11-04-2017 — Chandigarh, India', group: 'Foundation facts' },
    { key: 'about.fact_1.label', label: 'Fact 2 label', widget: 'text', defaultValue: 'CIN', group: 'Foundation facts' },
    { key: 'about.fact_1.value', label: 'Fact 2 value', widget: 'text', defaultValue: 'L24304CH2017PLC041482', group: 'Foundation facts' },
    { key: 'about.fact_2.label', label: 'Fact 3 label', widget: 'text', defaultValue: 'Facility', group: 'Foundation facts' },
    { key: 'about.fact_2.value', label: 'Fact 3 value', widget: 'text', defaultValue: 'Village Haripur, Panchkula, Haryana', group: 'Foundation facts' },
    { key: 'about.fact_3.label', label: 'Fact 4 label', widget: 'text', defaultValue: 'Compliance', group: 'Foundation facts' },
    { key: 'about.fact_3.value', label: 'Fact 4 value', widget: 'text', defaultValue: 'WHO-GMP Certified', group: 'Foundation facts' },
    { key: 'about.fact_4.label', label: 'Fact 5 label', widget: 'text', defaultValue: 'Market Status', group: 'Foundation facts' },
    { key: 'about.fact_4.value', label: 'Fact 5 value', widget: 'text', defaultValue: 'BSE-SME Limited Company', group: 'Foundation facts' },
    { key: 'about.fact_5.label', label: 'Fact 6 label', widget: 'text', defaultValue: 'Segments', group: 'Foundation facts' },
    { key: 'about.fact_5.value', label: 'Fact 6 value', widget: 'text', defaultValue: 'Pharmaceutical & Cosmetics', group: 'Foundation facts' },

    /* ── Path cards ─────────────────────────────────────────────── */
    { key: 'about.path_kicker', label: 'Path-card kicker ("I am a")', widget: 'text', defaultValue: 'I am a', group: 'Path cards' },
    { key: 'about.path_0.role', label: 'Path 1 role', widget: 'text', defaultValue: 'Brand Owner', group: 'Path cards' },
    { key: 'about.path_0.desc', label: 'Path 1 description', widget: 'textarea', defaultValue: 'Launch or scale your pharma or cosmetic brand with a fully compliant, GMP-certified manufacturing partner.', group: 'Path cards' },
    { key: 'about.path_0.cta', label: 'Path 1 CTA', widget: 'text', defaultValue: 'See Manufacturing Services', group: 'Path cards' },
    { key: 'about.path_1.role', label: 'Path 2 role', widget: 'text', defaultValue: 'Startup / New Entrant', group: 'Path cards' },
    { key: 'about.path_1.desc', label: 'Path 2 description', widget: 'textarea', defaultValue: 'Enter the pharma or cosmetics market without building your own facility — from formulation to delivery.', group: 'Path cards' },
    { key: 'about.path_1.cta', label: 'Path 2 CTA', widget: 'text', defaultValue: 'Start a Conversation', group: 'Path cards' },
    { key: 'about.path_2.role', label: 'Path 3 role', widget: 'text', defaultValue: 'Investor', group: 'Path cards' },
    { key: 'about.path_2.desc', label: 'Path 3 description', widget: 'textarea', defaultValue: 'Explore our BSE-SME disclosures, financial reports, and governance structure.', group: 'Path cards' },
    { key: 'about.path_2.cta', label: 'Path 3 CTA', widget: 'text', defaultValue: 'Investor Relations', group: 'Path cards' },

    /* ── Founder ─────────────────────────────────────────────────── */
    { key: 'about.founder.initials', label: 'Founder initials avatar', widget: 'text', defaultValue: 'AG', group: 'Founder' },
    { key: 'about.founder.cta', label: 'Founder CTA', widget: 'text', defaultValue: 'Meet the Full Leadership Team', group: 'Founder' },

    /* ── Pillars ─────────────────────────────────────────────────── */
    { key: 'about.pillars.label', label: 'Pillars label', widget: 'text', defaultValue: 'Our Pillars', group: 'Our Pillars' },
    { key: 'about.pillar_0.num', label: 'Pillar 1 number', widget: 'text', defaultValue: '01', group: 'Our Pillars' },
    { key: 'about.pillar_0.title', label: 'Pillar 1 title', widget: 'text', defaultValue: 'Innovation', group: 'Our Pillars' },
    { key: 'about.pillar_0.desc', label: 'Pillar 1 description', widget: 'textarea', defaultValue: 'Advancing R&D and technology-enabled manufacturing to stay ahead of industry demands.', group: 'Our Pillars' },
    { key: 'about.pillar_1.num', label: 'Pillar 2 number', widget: 'text', defaultValue: '02', group: 'Our Pillars' },
    { key: 'about.pillar_1.title', label: 'Pillar 2 title', widget: 'text', defaultValue: 'Quality', group: 'Our Pillars' },
    { key: 'about.pillar_1.desc', label: 'Pillar 2 description', widget: 'textarea', defaultValue: 'Stringent regulatory standards and robust quality systems across every batch we produce.', group: 'Our Pillars' },
    { key: 'about.pillar_2.num', label: 'Pillar 3 number', widget: 'text', defaultValue: '03', group: 'Our Pillars' },
    { key: 'about.pillar_2.title', label: 'Pillar 3 title', widget: 'text', defaultValue: 'Sustainability', group: 'Our Pillars' },
    { key: 'about.pillar_2.desc', label: 'Pillar 3 description', widget: 'textarea', defaultValue: 'Eco-conscious and responsible manufacturing practices for a healthier planet.', group: 'Our Pillars' },
    { key: 'about.pillar_3.num', label: 'Pillar 4 number', widget: 'text', defaultValue: '04', group: 'Our Pillars' },
    { key: 'about.pillar_3.title', label: 'Pillar 4 title', widget: 'text', defaultValue: 'People', group: 'Our Pillars' },
    { key: 'about.pillar_3.desc', label: 'Pillar 4 description', widget: 'textarea', defaultValue: 'Empowering teams through knowledge, skill development, and a culture of growth.', group: 'Our Pillars' },

    /* ── Sectors lists ───────────────────────────────────────────── */
    { key: 'about.pharma.tag', label: 'Pharma sector tag', widget: 'text', defaultValue: 'Pharmaceutical', group: 'Sectors' },
    { key: 'about.pharma_0', label: 'Pharma item 1', widget: 'text', defaultValue: 'Tablets & Capsules', group: 'Sectors' },
    { key: 'about.pharma_1', label: 'Pharma item 2', widget: 'text', defaultValue: 'Syrups & Liquids', group: 'Sectors' },
    { key: 'about.pharma_2', label: 'Pharma item 3', widget: 'text', defaultValue: 'Nutraceuticals', group: 'Sectors' },
    { key: 'about.pharma_3', label: 'Pharma item 4', widget: 'text', defaultValue: 'Ointments & Topicals', group: 'Sectors' },
    { key: 'about.cosmetics.tag', label: 'Cosmetics sector tag', widget: 'text', defaultValue: 'Cosmetics', group: 'Sectors' },
    { key: 'about.cosmetics_0', label: 'Cosmetic item 1', widget: 'text', defaultValue: 'Skincare Formulations', group: 'Sectors' },
    { key: 'about.cosmetics_1', label: 'Cosmetic item 2', widget: 'text', defaultValue: 'Hair Care Products', group: 'Sectors' },
    { key: 'about.cosmetics_2', label: 'Cosmetic item 3', widget: 'text', defaultValue: 'Personal Care', group: 'Sectors' },
    { key: 'about.cosmetics_3', label: 'Cosmetic item 4', widget: 'text', defaultValue: 'Beauty Preparations', group: 'Sectors' },

    { key: 'about.why.label', label: '"Why Clients Choose Us" label', widget: 'text', defaultValue: 'Why Clients Choose Us', group: 'Why us' },
    { key: 'about.why_0', label: 'Why 1', widget: 'text', defaultValue: 'Quality-first culture with zero-compromise manufacturing', group: 'Why us' },
    { key: 'about.why_1', label: 'Why 2', widget: 'text', defaultValue: 'Flexible, client-centric production solutions', group: 'Why us' },
    { key: 'about.why_2', label: 'Why 3', widget: 'text', defaultValue: 'In-house R&D and formulation capabilities', group: 'Why us' },
    { key: 'about.why_3', label: 'Why 4', widget: 'text', defaultValue: 'Dual-sector expertise in pharma and cosmetics', group: 'Why us' },
    { key: 'about.why_4', label: 'Why 5', widget: 'text', defaultValue: 'BSE-SME with full governance transparency', group: 'Why us' },
    { key: 'about.why_5', label: 'Why 6', widget: 'text', defaultValue: 'Domestic and international export capabilities', group: 'Why us' },
  ],
}

const VISION_AND_MISSION: PageDefaults = {
  path: '/vision-and-mission',
  slots: [
    ...hero(
      'Our Purpose',
      'Vision & Mission',
      'The beliefs and ambitions that guide every decision at Astonea Labs Limited.',
    ),
    {
      key: 'vision.label',
      label: 'Vision section label',
      widget: 'text',
      defaultValue: 'Our Vision',
      group: 'Vision',
    },
    {
      key: 'vision.quote',
      label: 'Vision quote',
      widget: 'textarea',
      defaultValue:
        "To build sustainable brands that have global reach and make a lasting impact on people's life.",
      group: 'Vision',
    },
    {
      key: 'vision.body',
      label: 'Vision body',
      widget: 'textarea',
      defaultValue:
        'To connect with global masses with our best-researched portfolio of products — delivering both wellbeing and beauty to consumers around the world.',
      group: 'Vision',
    },
    {
      key: 'mission.label',
      label: 'Mission section label',
      widget: 'text',
      defaultValue: 'Our Mission',
      group: 'Mission',
    },
    {
      key: 'mission.quote',
      label: 'Mission quote',
      widget: 'textarea',
      defaultValue:
        'To reach our wings across the globe with our own brands and also be a preferred supplier globally.',
      group: 'Mission',
    },
    {
      key: 'mission.body',
      label: 'Mission body',
      widget: 'textarea',
      defaultValue:
        'We are building a globally recognized pharmaceutical and cosmetic enterprise — one that creates lasting brand equity while remaining the partner of choice for contract manufacturing worldwide.',
      group: 'Mission',
    },
    {
      key: 'promise.label',
      label: 'Promise label',
      widget: 'text',
      defaultValue: 'Our Promise',
      group: 'Promise',
    },
    {
      key: 'promise.heading',
      label: 'Promise heading',
      widget: 'text',
      defaultValue: 'Inspiring trust in healthcare, elevating beauty with elegance.',
      group: 'Promise',
    },
    {
      key: 'values.label',
      label: 'Core values label',
      widget: 'text',
      defaultValue: 'Core Values',
      group: 'Core values',
    },
    {
      key: 'values.heading',
      label: 'Core values heading',
      widget: 'text',
      defaultValue: 'The principles behind our purpose',
      group: 'Core values',
    },
    /* ── Core values list ──────────────────────────────────────── */
    { key: 'value_0.num', label: 'Value 1 number', widget: 'text', defaultValue: '01', group: 'Core values list' },
    { key: 'value_0.title', label: 'Value 1 title', widget: 'text', defaultValue: 'Global Ambition', group: 'Core values list' },
    { key: 'value_0.desc', label: 'Value 1 description', widget: 'textarea', defaultValue: 'We pursue international markets through both our own brand portfolio and as a preferred supplier to global partners.', group: 'Core values list' },
    { key: 'value_1.num', label: 'Value 2 number', widget: 'text', defaultValue: '02', group: 'Core values list' },
    { key: 'value_1.title', label: 'Value 2 title', widget: 'text', defaultValue: 'Sustainability', group: 'Core values list' },
    { key: 'value_1.desc', label: 'Value 2 description', widget: 'textarea', defaultValue: 'Every brand we build and every partnership we form is designed for long-term, sustainable impact.', group: 'Core values list' },
    { key: 'value_2.num', label: 'Value 3 number', widget: 'text', defaultValue: '03', group: 'Core values list' },
    { key: 'value_2.title', label: 'Value 3 title', widget: 'text', defaultValue: 'Scientific Excellence', group: 'Core values list' },
    { key: 'value_2.desc', label: 'Value 3 description', widget: 'textarea', defaultValue: 'Our portfolio is backed by rigorous R&D, GMP compliance, and formulation expertise spanning pharma and cosmetics.', group: 'Core values list' },
    { key: 'value_3.num', label: 'Value 4 number', widget: 'text', defaultValue: '04', group: 'Core values list' },
    { key: 'value_3.title', label: 'Value 4 title', widget: 'text', defaultValue: 'Consumer Impact', group: 'Core values list' },
    { key: 'value_3.desc', label: 'Value 4 description', widget: 'textarea', defaultValue: 'We connect with global consumers through products that genuinely improve wellbeing and inspire confidence.', group: 'Core values list' },
    { key: 'value_4.num', label: 'Value 5 number', widget: 'text', defaultValue: '05', group: 'Core values list' },
    { key: 'value_4.title', label: 'Value 5 title', widget: 'text', defaultValue: 'Integrity', group: 'Core values list' },
    { key: 'value_4.desc', label: 'Value 5 description', widget: 'textarea', defaultValue: 'Transparent governance, regulatory compliance, and ethical manufacturing are non-negotiable at Astonea.', group: 'Core values list' },
    { key: 'value_5.num', label: 'Value 6 number', widget: 'text', defaultValue: '06', group: 'Core values list' },
    { key: 'value_5.title', label: 'Value 6 title', widget: 'text', defaultValue: 'Innovation', group: 'Core values list' },
    { key: 'value_5.desc', label: 'Value 6 description', widget: 'textarea', defaultValue: 'We continuously invest in technology-enabled manufacturing and best-researched product portfolios.', group: 'Core values list' },
  ],
}

const WHAT_WE_DO: PageDefaults = {
  path: '/what-we-do',
  slots: [
    ...hero(
      'Capabilities',
      'What We Do',
      'A diversified, innovation-driven enterprise specialising in the manufacturing, marketing, and global distribution of pharmaceutical and cosmetic products.',
    ),
    {
      key: 'wwd.services.label',
      label: 'Services section label',
      widget: 'text',
      defaultValue: 'Services',
      group: 'Services',
    },
    {
      key: 'wwd.services.heading',
      label: 'Services heading',
      widget: 'text',
      defaultValue: 'End-to-end manufacturing — tailored to your brand',
      group: 'Services',
    },
    {
      key: 'wwd.pharma.label',
      label: 'Pharmaceutical section label',
      widget: 'text',
      defaultValue: 'Pharmaceutical',
      group: 'Pharma',
    },
    {
      key: 'wwd.pharma.heading',
      label: 'Pharmaceutical section heading',
      widget: 'text',
      defaultValue: 'Therapeutic formulations across every major category',
      group: 'Pharma',
    },
    {
      key: 'wwd.pharma.body',
      label: 'Pharmaceutical section body',
      widget: 'textarea',
      defaultValue:
        'All products comply with rigorous precision, ensuring compliance with stringent quality protocols, regulatory standards, and Good Manufacturing Practices (GMP).',
      group: 'Pharma',
    },
    {
      key: 'wwd.cosmetics.label',
      label: 'Cosmetics section label',
      widget: 'text',
      defaultValue: 'Cosmetics & Personal Care',
      group: 'Cosmetics',
    },
    {
      key: 'wwd.cosmetics.heading',
      label: 'Cosmetics section heading',
      widget: 'text',
      defaultValue: 'Beauty and personal care with safety at the core',
      group: 'Cosmetics',
    },
    {
      key: 'wwd.cosmetics.body',
      label: 'Cosmetics section body',
      widget: 'textarea',
      defaultValue:
        'Our cosmetic and personal care line encompasses skin care, oral care, and hair care solutions available across multiple delivery formats — manufactured to the same GMP standards as our pharmaceutical products.',
      group: 'Cosmetics',
    },
    {
      key: 'wwd.brands.label',
      label: 'Brands section label',
      widget: 'text',
      defaultValue: 'Brand Portfolio',
      group: 'Brands',
    },
    {
      key: 'wwd.brands.heading',
      label: 'Brands section heading',
      widget: 'text',
      defaultValue: 'Our own consumer brands',
      group: 'Brands',
    },
    {
      key: 'wwd.cta.heading',
      label: 'CTA heading',
      widget: 'text',
      defaultValue: 'Have a formulation in mind?',
      group: 'CTA',
    },
    {
      key: 'wwd.cta.body',
      label: 'CTA body',
      widget: 'textarea',
      defaultValue:
        'Our team is ready to discuss your requirements and bring your product to market.',
      group: 'CTA',
    },
    { key: 'wwd.cta.primary', label: 'CTA primary button', widget: 'text', defaultValue: 'Start a Conversation', group: 'CTA' },
    { key: 'wwd.cta.secondary', label: 'CTA secondary button', widget: 'text', defaultValue: 'View Facility', group: 'CTA' },

    /* ── Metrics strip ───────────────────────────────────────────── */
    { key: 'wwd.metric_0.value', label: 'Metric 1 value', widget: 'text', defaultValue: '9+', group: 'Metrics' },
    { key: 'wwd.metric_0.label', label: 'Metric 1 label', widget: 'text', defaultValue: 'Therapeutic categories', group: 'Metrics' },
    { key: 'wwd.metric_1.value', label: 'Metric 2 value', widget: 'text', defaultValue: '6', group: 'Metrics' },
    { key: 'wwd.metric_1.label', label: 'Metric 2 label', widget: 'text', defaultValue: 'Dosage form formats', group: 'Metrics' },
    { key: 'wwd.metric_2.value', label: 'Metric 3 value', widget: 'text', defaultValue: '3', group: 'Metrics' },
    { key: 'wwd.metric_2.label', label: 'Metric 3 label', widget: 'text', defaultValue: 'Own consumer brands', group: 'Metrics' },
    { key: 'wwd.metric_3.value', label: 'Metric 4 value', widget: 'text', defaultValue: 'USFDA', group: 'Metrics' },
    { key: 'wwd.metric_3.label', label: 'Metric 4 label', widget: 'text', defaultValue: 'OTC audit completed', group: 'Metrics' },

    /* ── Services ────────────────────────────────────────────────── */
    { key: 'wwd.service_0.num', label: 'Service 1 number', widget: 'text', defaultValue: '01', group: 'Services list' },
    { key: 'wwd.service_0.title', label: 'Service 1 title', widget: 'text', defaultValue: 'Contract Manufacturing', group: 'Services list' },
    { key: 'wwd.service_0.desc', label: 'Service 1 description', widget: 'textarea', defaultValue: 'End-to-end third-party manufacturing for pharma and cosmetic brands — domestic and international clients.', group: 'Services list' },
    { key: 'wwd.service_1.num', label: 'Service 2 number', widget: 'text', defaultValue: '02', group: 'Services list' },
    { key: 'wwd.service_1.title', label: 'Service 2 title', widget: 'text', defaultValue: 'Formulation Development', group: 'Services list' },
    { key: 'wwd.service_1.desc', label: 'Service 2 description', widget: 'textarea', defaultValue: 'In-house R&D support for new formulations from concept through regulatory clearance.', group: 'Services list' },
    { key: 'wwd.service_2.num', label: 'Service 3 number', widget: 'text', defaultValue: '03', group: 'Services list' },
    { key: 'wwd.service_2.title', label: 'Service 3 title', widget: 'text', defaultValue: 'Packaging Material Procurement', group: 'Services list' },
    { key: 'wwd.service_2.desc', label: 'Service 3 description', widget: 'textarea', defaultValue: 'Sourcing and supply of primary and secondary packaging materials to complement production.', group: 'Services list' },
    { key: 'wwd.service_3.num', label: 'Service 4 number', widget: 'text', defaultValue: '04', group: 'Services list' },
    { key: 'wwd.service_3.title', label: 'Service 4 title', widget: 'text', defaultValue: 'Product Export', group: 'Services list' },
    { key: 'wwd.service_3.desc', label: 'Service 4 description', widget: 'textarea', defaultValue: 'Active exporter to markets including Iraq, Yemen, and beyond. USFDA OTC audit completed.', group: 'Services list' },
    { key: 'wwd.service_4.num', label: 'Service 5 number', widget: 'text', defaultValue: '05', group: 'Services list' },
    { key: 'wwd.service_4.title', label: 'Service 5 title', widget: 'text', defaultValue: 'Quality Assurance', group: 'Services list' },
    { key: 'wwd.service_4.desc', label: 'Service 5 description', widget: 'textarea', defaultValue: 'Multi-tier QMS with in-process checks, stability studies, and NABL-accredited third-party audits.', group: 'Services list' },
    { key: 'wwd.service_5.num', label: 'Service 6 number', widget: 'text', defaultValue: '06', group: 'Services list' },
    { key: 'wwd.service_5.title', label: 'Service 6 title', widget: 'text', defaultValue: 'Regulatory Affairs', group: 'Services list' },
    { key: 'wwd.service_5.desc', label: 'Service 6 description', widget: 'textarea', defaultValue: 'Complete dossier preparation, labelling compliance, and export documentation support.', group: 'Services list' },

    /* ── Pharma categories ───────────────────────────────────────── */
    { key: 'wwd.pcat_0.label', label: 'Pharma cat 1 label', widget: 'text', defaultValue: 'Antibiotics', group: 'Pharma categories' },
    { key: 'wwd.pcat_0.desc', label: 'Pharma cat 1 description', widget: 'textarea', defaultValue: 'Broad & narrow-spectrum antibacterial formulations in tablet, capsule, and liquid form.', group: 'Pharma categories' },
    { key: 'wwd.pcat_1.label', label: 'Pharma cat 2 label', widget: 'text', defaultValue: 'Anti-Cold Preparations', group: 'Pharma categories' },
    { key: 'wwd.pcat_1.desc', label: 'Pharma cat 2 description', widget: 'textarea', defaultValue: 'Decongestants, expectorants, and combination cold-relief formulations.', group: 'Pharma categories' },
    { key: 'wwd.pcat_2.label', label: 'Pharma cat 3 label', widget: 'text', defaultValue: 'Antihistamines', group: 'Pharma categories' },
    { key: 'wwd.pcat_2.desc', label: 'Pharma cat 3 description', widget: 'textarea', defaultValue: 'First and second-generation antihistamine products for allergy management.', group: 'Pharma categories' },
    { key: 'wwd.pcat_3.label', label: 'Pharma cat 4 label', widget: 'text', defaultValue: 'Antidiabetic', group: 'Pharma categories' },
    { key: 'wwd.pcat_3.desc', label: 'Pharma cat 4 description', widget: 'textarea', defaultValue: 'Oral hypoglycaemic agents across multiple drug classes and dosage strengths.', group: 'Pharma categories' },
    { key: 'wwd.pcat_4.label', label: 'Pharma cat 5 label', widget: 'text', defaultValue: 'Cardiovascular', group: 'Pharma categories' },
    { key: 'wwd.pcat_4.desc', label: 'Pharma cat 5 description', widget: 'textarea', defaultValue: 'Antihypertensives, statins, and cardiac-support formulations.', group: 'Pharma categories' },
    { key: 'wwd.pcat_5.label', label: 'Pharma cat 6 label', widget: 'text', defaultValue: 'Gynecological', group: 'Pharma categories' },
    { key: 'wwd.pcat_5.desc', label: 'Pharma cat 6 description', widget: 'textarea', defaultValue: "Hormonal and supportive therapies for women's health and reproductive medicine.", group: 'Pharma categories' },
    { key: 'wwd.pcat_6.label', label: 'Pharma cat 7 label', widget: 'text', defaultValue: 'Analgesics', group: 'Pharma categories' },
    { key: 'wwd.pcat_6.desc', label: 'Pharma cat 7 description', widget: 'textarea', defaultValue: 'Pain-management formulations: NSAIDs, combination analgesics, and topical agents.', group: 'Pharma categories' },
    { key: 'wwd.pcat_7.label', label: 'Pharma cat 8 label', widget: 'text', defaultValue: 'Antifungal Agents', group: 'Pharma categories' },
    { key: 'wwd.pcat_7.desc', label: 'Pharma cat 8 description', widget: 'textarea', defaultValue: 'Systemic and topical antifungal preparations for dermatological and systemic use.', group: 'Pharma categories' },
    { key: 'wwd.pcat_8.label', label: 'Pharma cat 9 label', widget: 'text', defaultValue: 'Multivitamins', group: 'Pharma categories' },
    { key: 'wwd.pcat_8.desc', label: 'Pharma cat 9 description', widget: 'textarea', defaultValue: 'Nutraceutical blends, vitamin-mineral combinations, and wellness supplements.', group: 'Pharma categories' },

    /* ── Cosmetic formats + categories ───────────────────────────── */
    { key: 'wwd.cformat_0', label: 'Cosmetic format 1', widget: 'text', defaultValue: 'Gels', group: 'Cosmetic formats' },
    { key: 'wwd.cformat_1', label: 'Cosmetic format 2', widget: 'text', defaultValue: 'Ointments', group: 'Cosmetic formats' },
    { key: 'wwd.cformat_2', label: 'Cosmetic format 3', widget: 'text', defaultValue: 'Creams', group: 'Cosmetic formats' },
    { key: 'wwd.cformat_3', label: 'Cosmetic format 4', widget: 'text', defaultValue: 'Lotions', group: 'Cosmetic formats' },
    { key: 'wwd.cformat_4', label: 'Cosmetic format 5', widget: 'text', defaultValue: 'Oils', group: 'Cosmetic formats' },
    { key: 'wwd.cformat_5', label: 'Cosmetic format 6', widget: 'text', defaultValue: 'Serums', group: 'Cosmetic formats' },
    { key: 'wwd.ccat_0.label', label: 'Cosmetic cat 1 label', widget: 'text', defaultValue: 'Skin Care', group: 'Cosmetic categories' },
    { key: 'wwd.ccat_0.desc', label: 'Cosmetic cat 1 description', widget: 'textarea', defaultValue: 'Moisturisers, serums, face washes, sunscreens, and anti-ageing formulations.', group: 'Cosmetic categories' },
    { key: 'wwd.ccat_1.label', label: 'Cosmetic cat 2 label', widget: 'text', defaultValue: 'Hair Care', group: 'Cosmetic categories' },
    { key: 'wwd.ccat_1.desc', label: 'Cosmetic cat 2 description', widget: 'textarea', defaultValue: 'Shampoos, conditioners, hair oils, and scalp-treatment products.', group: 'Cosmetic categories' },
    { key: 'wwd.ccat_2.label', label: 'Cosmetic cat 3 label', widget: 'text', defaultValue: 'Oral Care', group: 'Cosmetic categories' },
    { key: 'wwd.ccat_2.desc', label: 'Cosmetic cat 3 description', widget: 'textarea', defaultValue: 'Toothpastes, mouthwashes, and gum-care preparations.', group: 'Cosmetic categories' },
    { key: 'wwd.ccat_3.label', label: 'Cosmetic cat 4 label', widget: 'text', defaultValue: 'Personal Care', group: 'Cosmetic categories' },
    { key: 'wwd.ccat_3.desc', label: 'Cosmetic cat 4 description', widget: 'textarea', defaultValue: 'Body lotions, hand creams, deodorants, and hygiene products.', group: 'Cosmetic categories' },

    /* ── Own brands ──────────────────────────────────────────────── */
    { key: 'wwd.brand_0.name', label: 'Brand 1 name', widget: 'text', defaultValue: 'Glow Up', group: 'Own brands' },
    { key: 'wwd.brand_0.desc', label: 'Brand 1 description', widget: 'textarea', defaultValue: 'Available on Amazon and Tata 1MG. A skincare and wellness brand with consumer-grade formulations.', group: 'Own brands' },
    { key: 'wwd.brand_0.status', label: 'Brand 1 status', widget: 'text', defaultValue: 'Live', group: 'Own brands' },
    { key: 'wwd.brand_1.name', label: 'Brand 2 name', widget: 'text', defaultValue: 'Regero', group: 'Own brands' },
    { key: 'wwd.brand_1.desc', label: 'Brand 2 description', widget: 'textarea', defaultValue: 'A brand within the Astonea portfolio targeting health-conscious consumers.', group: 'Own brands' },
    { key: 'wwd.brand_1.status', label: 'Brand 2 status', widget: 'text', defaultValue: 'Live', group: 'Own brands' },
    { key: 'wwd.brand_2.name', label: 'Brand 3 name', widget: 'text', defaultValue: 'Avicel', group: 'Own brands' },
    { key: 'wwd.brand_2.desc', label: 'Brand 3 description', widget: 'textarea', defaultValue: 'A new skincare line currently in final development stages — launching soon.', group: 'Own brands' },
    { key: 'wwd.brand_2.status', label: 'Brand 3 status', widget: 'text', defaultValue: 'Upcoming', group: 'Own brands' },
  ],
}

const CSR: PageDefaults = {
  path: '/csr',
  slots: [
    ...hero(
      'Corporate Social Responsibility',
      'CSR',
      'Sowing responsibility today, reaping a brighter world tomorrow.',
    ),
    {
      key: 'csr.philosophy.label',
      label: 'Philosophy section label',
      widget: 'text',
      defaultValue: 'Our Philosophy',
      group: 'Philosophy',
    },
    {
      key: 'csr.philosophy.heading',
      label: 'Philosophy heading',
      widget: 'text',
      defaultValue: 'Beyond compliance — purpose-driven responsibility',
      group: 'Philosophy',
    },
    {
      key: 'csr.philosophy.body_1',
      label: 'Philosophy paragraph 1',
      widget: 'textarea',
      defaultValue:
        'At Astonea Labs, corporate social responsibility goes beyond mandatory compliance. We integrate sustainability, ethical governance, and societal enrichment into the very fabric of our operations — treating every initiative as a deliberate act of foresight for generations yet to come.',
      group: 'Philosophy',
    },
    {
      key: 'csr.philosophy.body_2',
      label: 'Philosophy paragraph 2',
      widget: 'textarea',
      defaultValue:
        'Our approach is guided by a formal CSR Policy approved by the Board of Directors, with activities executed through the Astonea Foundation — our dedicated non-profit arm committed to nurturing a resilient and luminous legacy.',
      group: 'Philosophy',
    },
    {
      key: 'csr.philosophy.quote',
      label: 'Philosophy quote',
      widget: 'textarea',
      defaultValue: 'Sowing responsibility today, reaping a brighter world tomorrow.',
      group: 'Philosophy',
    },
    {
      key: 'csr.philosophy.quote_attribution',
      label: 'Philosophy quote attribution',
      widget: 'text',
      defaultValue: '— Astonea Labs CSR Philosophy',
      group: 'Philosophy',
    },
    {
      key: 'csr.focus_areas.label',
      label: 'Focus areas label',
      widget: 'text',
      defaultValue: 'Focus Areas',
      group: 'Focus areas',
    },
    {
      key: 'csr.focus_areas.heading',
      label: 'Focus areas heading',
      widget: 'text',
      defaultValue: 'Three pillars of our CSR commitment',
      group: 'Focus areas',
    },
    {
      key: 'csr.commitments.label',
      label: 'Commitments label',
      widget: 'text',
      defaultValue: 'Our Commitments',
      group: 'Commitments',
    },
    {
      key: 'csr.commitments.heading',
      label: 'Commitments heading',
      widget: 'text',
      defaultValue: 'How we hold ourselves accountable',
      group: 'Commitments',
    },
    {
      key: 'csr.cta.footnote',
      label: 'CTA footnote',
      widget: 'textarea',
      defaultValue:
        "For full details on CSR spending and activities, refer to the CSR section in the company's Annual Report.",
      group: 'CTA',
    },
    { key: 'csr.cta.primary', label: 'CTA primary button', widget: 'text', defaultValue: 'View CSR Policy', group: 'CTA' },
    { key: 'csr.cta.secondary', label: 'CTA secondary button', widget: 'text', defaultValue: 'View Annual Reports', group: 'CTA' },

    /* ── Focus areas ─────────────────────────────────────────────── */
    { key: 'csr.focus_0.num', label: 'Focus 1 number', widget: 'text', defaultValue: '01', group: 'Focus areas list' },
    { key: 'csr.focus_0.title', label: 'Focus 1 title', widget: 'text', defaultValue: 'Ecological Preservation', group: 'Focus areas list' },
    { key: 'csr.focus_0.desc', label: 'Focus 1 description', widget: 'textarea', defaultValue: 'Promoting eco-conscious manufacturing practices, reducing industrial waste, and supporting environmental stewardship in the communities where we operate.', group: 'Focus areas list' },
    { key: 'csr.focus_1.num', label: 'Focus 2 number', widget: 'text', defaultValue: '02', group: 'Focus areas list' },
    { key: 'csr.focus_1.title', label: 'Focus 2 title', widget: 'text', defaultValue: 'Social Empowerment', group: 'Focus areas list' },
    { key: 'csr.focus_1.desc', label: 'Focus 2 description', widget: 'textarea', defaultValue: 'Initiatives that uplift individuals through education, skill development, and access to healthcare — creating lasting socioeconomic change.', group: 'Focus areas list' },
    { key: 'csr.focus_2.num', label: 'Focus 3 number', widget: 'text', defaultValue: '03', group: 'Focus areas list' },
    { key: 'csr.focus_2.title', label: 'Focus 3 title', widget: 'text', defaultValue: 'Community Advancement', group: 'Focus areas list' },
    { key: 'csr.focus_2.desc', label: 'Focus 3 description', widget: 'textarea', defaultValue: 'Direct investment in the welfare and development of communities surrounding our manufacturing and operational footprint in Haryana and Chandigarh.', group: 'Focus areas list' },

    /* ── Principles ──────────────────────────────────────────────── */
    { key: 'csr.principle_0', label: 'Principle 1', widget: 'textarea', defaultValue: 'CSR is integrated into every layer of our business strategy — not treated as an afterthought or compliance checkbox', group: 'Commitments list' },
    { key: 'csr.principle_1', label: 'Principle 2', widget: 'textarea', defaultValue: 'We are committed to sustainability, ethical governance, and societal enrichment as core operating values', group: 'Commitments list' },
    { key: 'csr.principle_2', label: 'Principle 3', widget: 'textarea', defaultValue: 'Our CSR activities are governed by a formal CSR Policy reviewed and approved by the Board of Directors', group: 'Commitments list' },
    { key: 'csr.principle_3', label: 'Principle 4', widget: 'textarea', defaultValue: 'The Astonea Foundation acts as the primary vehicle for community engagement and philanthropic activities', group: 'Commitments list' },
    { key: 'csr.principle_4', label: 'Principle 5', widget: 'textarea', defaultValue: 'All CSR expenditure and activities are disclosed in the Annual Report in accordance with the Companies Act, 2013', group: 'Commitments list' },
  ],
}

const MANUFACTURING_FACILITY: PageDefaults = {
  path: '/manufacturing-facility',
  slots: [
    ...hero(
      'Infrastructure',
      'Manufacturing Facility',
      'State-of-the-art GMP-compliant facility in Panchkula, Haryana — delivering precision pharma and cosmetics manufacturing.',
    ),
    {
      key: 'mfg.location.label',
      label: 'Location section label',
      widget: 'text',
      defaultValue: 'Location',
      group: 'Location',
    },
    {
      key: 'mfg.location.heading',
      label: 'Location heading',
      widget: 'text',
      defaultValue: 'Strategically located in Panchkula, Haryana',
      group: 'Location',
    },
    {
      key: 'mfg.location.body_1',
      label: 'Location paragraph 1',
      widget: 'textarea',
      defaultValue:
        'Our manufacturing facility is situated in Village Haripur, Tehsil Raipur Rani, District Panchkula, Haryana — 134204. The facility benefits from a well-connected industrial belt with strong logistics access and proximity to North Indian commercial and regulatory centres.',
      group: 'Location',
    },
    {
      key: 'mfg.location.body_2',
      label: 'Location paragraph 2',
      widget: 'textarea',
      defaultValue:
        'The site operates under the highest benchmarks of Good Manufacturing Practices (GMP), ISO standards, and global quality norms, with comprehensive validation processes and controlled manufacturing environments ensuring regulatory compliance at every step.',
      group: 'Location',
    },
    {
      key: 'mfg.infrastructure.label',
      label: 'Infrastructure section label',
      widget: 'text',
      defaultValue: 'Infrastructure',
      group: 'Infrastructure',
    },
    {
      key: 'mfg.infrastructure.heading',
      label: 'Infrastructure heading',
      widget: 'text',
      defaultValue: 'Built for precision and compliance',
      group: 'Infrastructure',
    },
    {
      key: 'mfg.production.label',
      label: 'Production section label',
      widget: 'text',
      defaultValue: 'Production',
      group: 'Production',
    },
    {
      key: 'mfg.production.heading',
      label: 'Production heading',
      widget: 'text',
      defaultValue: 'Diverse dosage forms under one roof',
      group: 'Production',
    },
    {
      key: 'mfg.quality.label',
      label: 'Quality section label',
      widget: 'text',
      defaultValue: 'Quality & Compliance',
      group: 'Quality',
    },
    {
      key: 'mfg.quality.heading',
      label: 'Quality & compliance heading',
      widget: 'text',
      defaultValue: 'Every batch. Every standard. Every time.',
      group: 'Quality',
    },
    {
      key: 'mfg.quality.body',
      label: 'Quality & compliance body',
      widget: 'textarea',
      defaultValue:
        'Our multi-tier QMS spans in-process checks, finished-goods testing, stability studies, and NABL-accredited third-party audits — ensuring zero-compromise on every batch we release.',
      group: 'Quality',
    },
    { key: 'mfg.quality.cta', label: 'Quality CTA link', widget: 'text', defaultValue: 'View All Certifications →', group: 'Quality' },

    /* ── Address cards ─────────────────────────────────────────── */
    { key: 'mfg.addr_0.label', label: 'Mfg address label', widget: 'text', defaultValue: 'Manufacturing Address', group: 'Addresses' },
    { key: 'mfg.addr_0.value', label: 'Mfg address (multi-line)', widget: 'textarea', defaultValue: 'Vill. Haripur, Tehsil Raipur Rani\nDist. Panchkula, Haryana — 134204', group: 'Addresses' },
    { key: 'mfg.addr_1.label', label: 'Registered office label', widget: 'text', defaultValue: 'Registered Office', group: 'Addresses' },
    { key: 'mfg.addr_1.value', label: 'Registered office (multi-line)', widget: 'textarea', defaultValue: 'SCO 321-322, Basement, Sector 35B\nChandigarh — 160022', group: 'Addresses' },
    { key: 'mfg.addr_2.label', label: 'Corporate office label', widget: 'text', defaultValue: 'Corporate Office', group: 'Addresses' },
    { key: 'mfg.addr_2.value', label: 'Corporate office (multi-line)', widget: 'textarea', defaultValue: 'Plot No. 63, Industrial Area Phase-II\nPanchkula, Haryana — 134113', group: 'Addresses' },

    /* ── Infrastructure ─────────────────────────────────────────── */
    { key: 'mfg.infra_0.num', label: 'Infra 1 number', widget: 'text', defaultValue: '01', group: 'Infrastructure list' },
    { key: 'mfg.infra_0.title', label: 'Infra 1 title', widget: 'text', defaultValue: 'Modern Machinery', group: 'Infrastructure list' },
    { key: 'mfg.infra_0.desc', label: 'Infra 1 description', widget: 'textarea', defaultValue: 'Advanced process-control systems and precision manufacturing equipment for batch-to-batch consistency.', group: 'Infrastructure list' },
    { key: 'mfg.infra_1.num', label: 'Infra 2 number', widget: 'text', defaultValue: '02', group: 'Infrastructure list' },
    { key: 'mfg.infra_1.title', label: 'Infra 2 title', widget: 'text', defaultValue: 'Dedicated Manufacturing Zones', group: 'Infrastructure list' },
    { key: 'mfg.infra_1.desc', label: 'Infra 2 description', widget: 'textarea', defaultValue: 'Segregated production areas for different dosage forms, preventing cross-contamination.', group: 'Infrastructure list' },
    { key: 'mfg.infra_2.num', label: 'Infra 3 number', widget: 'text', defaultValue: '03', group: 'Infrastructure list' },
    { key: 'mfg.infra_2.title', label: 'Infra 3 title', widget: 'text', defaultValue: 'Quality Control Lab', group: 'Infrastructure list' },
    { key: 'mfg.infra_2.desc', label: 'Infra 3 description', widget: 'textarea', defaultValue: 'Sophisticated analytical instruments for raw material, in-process, and finished-goods testing.', group: 'Infrastructure list' },
    { key: 'mfg.infra_3.num', label: 'Infra 4 number', widget: 'text', defaultValue: '04', group: 'Infrastructure list' },
    { key: 'mfg.infra_3.title', label: 'Infra 4 title', widget: 'text', defaultValue: 'Quality Assurance Department', group: 'Infrastructure list' },
    { key: 'mfg.infra_3.desc', label: 'Infra 4 description', widget: 'textarea', defaultValue: 'Independent QA team conducting in-process audits, stability studies, and compliance reviews.', group: 'Infrastructure list' },
    { key: 'mfg.infra_4.num', label: 'Infra 5 number', widget: 'text', defaultValue: '05', group: 'Infrastructure list' },
    { key: 'mfg.infra_4.title', label: 'Infra 5 title', widget: 'text', defaultValue: 'Controlled Environments', group: 'Infrastructure list' },
    { key: 'mfg.infra_4.desc', label: 'Infra 5 description', widget: 'textarea', defaultValue: 'HVAC-regulated, ISO-classified cleanrooms ensuring sterility and particulate control.', group: 'Infrastructure list' },
    { key: 'mfg.infra_5.num', label: 'Infra 6 number', widget: 'text', defaultValue: '06', group: 'Infrastructure list' },
    { key: 'mfg.infra_5.title', label: 'Infra 6 title', widget: 'text', defaultValue: 'Logistics Access', group: 'Infrastructure list' },
    { key: 'mfg.infra_5.desc', label: 'Infra 6 description', widget: 'textarea', defaultValue: 'Proximity to North Indian commercial and regulatory centres with strong transport connectivity.', group: 'Infrastructure list' },

    /* ── Capabilities ────────────────────────────────────────────── */
    { key: 'mfg.cap_0.num', label: 'Capability 1 number', widget: 'text', defaultValue: '01', group: 'Capabilities list' },
    { key: 'mfg.cap_0.label', label: 'Capability 1 label', widget: 'text', defaultValue: 'Tablets & Capsules', group: 'Capabilities list' },
    { key: 'mfg.cap_0.detail', label: 'Capability 1 detail', widget: 'textarea', defaultValue: 'Conventional, film-coated, enteric-coated, and extended-release solid dosage forms.', group: 'Capabilities list' },
    { key: 'mfg.cap_1.num', label: 'Capability 2 number', widget: 'text', defaultValue: '02', group: 'Capabilities list' },
    { key: 'mfg.cap_1.label', label: 'Capability 2 label', widget: 'text', defaultValue: 'Syrups & Suspensions', group: 'Capabilities list' },
    { key: 'mfg.cap_1.detail', label: 'Capability 2 detail', widget: 'textarea', defaultValue: 'Liquid oral formulations manufactured under controlled aseptic conditions.', group: 'Capabilities list' },
    { key: 'mfg.cap_2.num', label: 'Capability 3 number', widget: 'text', defaultValue: '03', group: 'Capabilities list' },
    { key: 'mfg.cap_2.label', label: 'Capability 3 label', widget: 'text', defaultValue: 'Ointments & Creams', group: 'Capabilities list' },
    { key: 'mfg.cap_2.detail', label: 'Capability 3 detail', widget: 'textarea', defaultValue: 'Semi-solid topical preparations with precision texture and stability profiles.', group: 'Capabilities list' },
    { key: 'mfg.cap_3.num', label: 'Capability 4 number', widget: 'text', defaultValue: '04', group: 'Capabilities list' },
    { key: 'mfg.cap_3.label', label: 'Capability 4 label', widget: 'text', defaultValue: 'External Preparations', group: 'Capabilities list' },
    { key: 'mfg.cap_3.detail', label: 'Capability 4 detail', widget: 'textarea', defaultValue: 'Gels, lotions, and dermatological formulations across pharmaceutical and cosmetic lines.', group: 'Capabilities list' },
    { key: 'mfg.cap_4.num', label: 'Capability 5 number', widget: 'text', defaultValue: '05', group: 'Capabilities list' },
    { key: 'mfg.cap_4.label', label: 'Capability 5 label', widget: 'text', defaultValue: 'Cosmetic Preparations', group: 'Capabilities list' },
    { key: 'mfg.cap_4.detail', label: 'Capability 5 detail', widget: 'textarea', defaultValue: 'Serums, face wash, hair care, and personal-care white-label production.', group: 'Capabilities list' },
    { key: 'mfg.cap_5.num', label: 'Capability 6 number', widget: 'text', defaultValue: '06', group: 'Capabilities list' },
    { key: 'mfg.cap_5.label', label: 'Capability 6 label', widget: 'text', defaultValue: 'Nutraceuticals', group: 'Capabilities list' },
    { key: 'mfg.cap_5.detail', label: 'Capability 6 detail', widget: 'textarea', defaultValue: 'AYUSH-approved herbal, nutraceutical, and wellness formulations.', group: 'Capabilities list' },

    /* ── Standards ──────────────────────────────────────────────── */
    { key: 'mfg.std_0.code', label: 'Standard 1 code', widget: 'text', defaultValue: 'WHO-GMP', group: 'Standards' },
    { key: 'mfg.std_0.label', label: 'Standard 1 label', widget: 'text', defaultValue: 'WHO-GMP', group: 'Standards' },
    { key: 'mfg.std_0.desc', label: 'Standard 1 description', widget: 'textarea', defaultValue: 'World Health Organization Good Manufacturing Practices — our core production standard.', group: 'Standards' },
    { key: 'mfg.std_1.code', label: 'Standard 2 code', widget: 'text', defaultValue: 'ISO', group: 'Standards' },
    { key: 'mfg.std_1.label', label: 'Standard 2 label', widget: 'text', defaultValue: 'ISO Standards', group: 'Standards' },
    { key: 'mfg.std_1.desc', label: 'Standard 2 description', widget: 'textarea', defaultValue: 'ISO-certified quality management systems across manufacturing and support functions.', group: 'Standards' },
    { key: 'mfg.std_2.code', label: 'Standard 3 code', widget: 'text', defaultValue: 'cGMP', group: 'Standards' },
    { key: 'mfg.std_2.label', label: 'Standard 3 label', widget: 'text', defaultValue: 'cGMP', group: 'Standards' },
    { key: 'mfg.std_2.desc', label: 'Standard 3 description', widget: 'textarea', defaultValue: 'Current Good Manufacturing Practice guidelines governing all production processes.', group: 'Standards' },
    { key: 'mfg.std_3.code', label: 'Standard 4 code', widget: 'text', defaultValue: 'AYUSH', group: 'Standards' },
    { key: 'mfg.std_3.label', label: 'Standard 4 label', widget: 'text', defaultValue: 'AYUSH Approved', group: 'Standards' },
    { key: 'mfg.std_3.desc', label: 'Standard 4 description', widget: 'textarea', defaultValue: 'Certified manufacturing lines for Ayurvedic, Unani, Siddha, and Homeopathic products.', group: 'Standards' },
    { key: 'mfg.std_4.code', label: 'Standard 5 code', widget: 'text', defaultValue: 'USFDA', group: 'Standards' },
    { key: 'mfg.std_4.label', label: 'Standard 5 label', widget: 'text', defaultValue: 'USFDA OTC', group: 'Standards' },
    { key: 'mfg.std_4.desc', label: 'Standard 5 description', widget: 'textarea', defaultValue: 'USFDA audit completed for OTC (Over-the-Counter) product manufacturing.', group: 'Standards' },
  ],
}

const CERTIFICATIONS: PageDefaults = {
  path: '/certifications',
  slots: [
    ...hero(
      'Quality',
      'Certifications',
      'Our quality credentials and regulatory approvals — validating our commitment to manufacturing excellence.',
    ),
    {
      key: 'cert.credentials.label',
      label: 'Credentials section label',
      widget: 'text',
      defaultValue: 'Credentials',
      group: 'Credentials',
    },
    {
      key: 'cert.credentials.heading',
      label: 'Credentials heading',
      widget: 'text',
      defaultValue: 'Internationally validated, locally committed',
      group: 'Credentials',
    },
    {
      key: 'cert.qms.label',
      label: 'QMS section label',
      widget: 'text',
      defaultValue: 'Quality Management System',
      group: 'Quality Management System',
    },
    {
      key: 'cert.qms.heading',
      label: 'QMS heading',
      widget: 'text',
      defaultValue: 'Multi-tier QMS — zero compromise',
      group: 'Quality Management System',
    },
    {
      key: 'cert.qms.body',
      label: 'QMS body',
      widget: 'textarea',
      defaultValue:
        'Our quality management system spans the entire production lifecycle — from raw material qualification to finished-goods testing and post-market surveillance — ensuring every batch meets its specifications before release.',
      group: 'Quality Management System',
    },
    {
      key: 'cert.cta.heading',
      label: 'CTA heading',
      widget: 'text',
      defaultValue: 'Need compliance documentation?',
      group: 'CTA',
    },
    {
      key: 'cert.cta.body',
      label: 'CTA body',
      widget: 'textarea',
      defaultValue:
        'Contact our team for GMP certificates, audit reports, and regulatory documents.',
      group: 'CTA',
    },
    { key: 'cert.cta.primary', label: 'CTA primary button', widget: 'text', defaultValue: 'Download Certificates', group: 'CTA' },
    { key: 'cert.cta.secondary', label: 'CTA secondary button', widget: 'text', defaultValue: 'Contact Our QA Team', group: 'CTA' },
    { key: 'cert.scope_label', label: 'Cert card "Scope:" label', widget: 'text', defaultValue: 'Scope:', group: 'Cert cards' },

    /* ── Quality practices ──────────────────────────────────────── */
    { key: 'cert.practice_0', label: 'Quality practice 1', widget: 'textarea', defaultValue: 'In-process quality checks at every manufacturing stage', group: 'Quality practices' },
    { key: 'cert.practice_1', label: 'Quality practice 2', widget: 'textarea', defaultValue: 'Finished-goods testing before batch release', group: 'Quality practices' },
    { key: 'cert.practice_2', label: 'Quality practice 3', widget: 'textarea', defaultValue: 'Stability studies under ICH-guidelines', group: 'Quality practices' },
    { key: 'cert.practice_3', label: 'Quality practice 4', widget: 'textarea', defaultValue: 'NABL-accredited third-party laboratory audits', group: 'Quality practices' },
    { key: 'cert.practice_4', label: 'Quality practice 5', widget: 'textarea', defaultValue: 'Dedicated QC and QA departments with sophisticated analytical instruments', group: 'Quality practices' },
    { key: 'cert.practice_5', label: 'Quality practice 6', widget: 'textarea', defaultValue: 'Comprehensive validation protocols for equipment and processes', group: 'Quality practices' },
    { key: 'cert.practice_6', label: 'Quality practice 7', widget: 'textarea', defaultValue: 'Controlled environment monitoring (temperature, humidity, particulates)', group: 'Quality practices' },
    { key: 'cert.practice_7', label: 'Quality practice 8', widget: 'textarea', defaultValue: 'Robust documentation and batch traceability systems', group: 'Quality practices' },
  ],
}

const KEY_MILESTONE: PageDefaults = {
  path: '/key-milestone',
  slots: [
    ...hero(
      'Our Journey',
      'Key Milestones',
      'From a Chandigarh startup in 2017 to a BSE SME–listed, pan-India manufacturer in 2025.',
    ),

    /* ── Stats bar ─────────────────────────────────────────────── */
    { key: 'km.stat_0.value', label: 'Stat 1 value', help: 'Numeric values (e.g. 2017, 3,200+) animate as a counter; non-numeric text renders as-is.', widget: 'text', defaultValue: '2017', group: 'Stats bar' },
    { key: 'km.stat_0.label', label: 'Stat 1 label', widget: 'text', defaultValue: 'Year Founded', group: 'Stats bar' },
    { key: 'km.stat_1.value', label: 'Stat 2 value', widget: 'text', defaultValue: '3,200+', group: 'Stats bar' },
    { key: 'km.stat_1.label', label: 'Stat 2 label', widget: 'text', defaultValue: 'Client Brands', group: 'Stats bar' },
    { key: 'km.stat_2.value', label: 'Stat 3 value', widget: 'text', defaultValue: '2,500+', group: 'Stats bar' },
    { key: 'km.stat_2.label', label: 'Stat 3 label', widget: 'text', defaultValue: 'Product Approvals', group: 'Stats bar' },
    { key: 'km.stat_3.value', label: 'Stat 4 value', widget: 'text', defaultValue: 'BSE SME', group: 'Stats bar' },
    { key: 'km.stat_3.label', label: 'Stat 4 label', widget: 'text', defaultValue: 'Listed On June 2025', group: 'Stats bar' },

    /* ── Timeline (9 milestones × year + title + events) ──────── */
    { key: 'km.ms_0.year', label: 'Milestone 1 year', widget: 'text', defaultValue: '2017', group: 'Timeline · 2017' },
    { key: 'km.ms_0.title', label: 'Milestone 1 title', widget: 'text', defaultValue: 'Incorporation', group: 'Timeline · 2017' },
    { key: 'km.ms_0.event_0', label: 'Milestone 1 event 1', widget: 'textarea', defaultValue: 'Incorporated as a Private Limited Company under the name AHU Laboratories Private Limited.', group: 'Timeline · 2017' },
    { key: 'km.ms_0.event_1', label: 'Milestone 1 event 2', widget: 'textarea', defaultValue: 'Acquired 2.5 acres of land at Village Haripar, Haryana for the manufacturing facility.', group: 'Timeline · 2017' },

    { key: 'km.ms_1.year', label: 'Milestone 2 year', widget: 'text', defaultValue: '2018', group: 'Timeline · 2018' },
    { key: 'km.ms_1.title', label: 'Milestone 2 title', widget: 'text', defaultValue: 'Construction Begins', group: 'Timeline · 2018' },
    { key: 'km.ms_1.event_0', label: 'Milestone 2 event 1', widget: 'textarea', defaultValue: 'Construction commenced for the manufacturing facility.', group: 'Timeline · 2018' },
    { key: 'km.ms_1.event_1', label: 'Milestone 2 event 2', widget: 'textarea', defaultValue: 'Initiated procurement of plant and machinery for production.', group: 'Timeline · 2018' },

    { key: 'km.ms_2.year', label: 'Milestone 3 year', widget: 'text', defaultValue: '2019', group: 'Timeline · 2019' },
    { key: 'km.ms_2.title', label: 'Milestone 3 title', widget: 'text', defaultValue: 'Rebrand & First Production', group: 'Timeline · 2019' },
    { key: 'km.ms_2.event_0', label: 'Milestone 3 event 1', widget: 'textarea', defaultValue: 'Company name changed from AHU Laboratories Private Limited to Astonea Labs Private Limited.', group: 'Timeline · 2019' },
    { key: 'km.ms_2.event_1', label: 'Milestone 3 event 2', widget: 'textarea', defaultValue: 'Began production of cosmetic products under the Astonea Labs banner.', group: 'Timeline · 2019' },

    { key: 'km.ms_3.year', label: 'Milestone 4 year', widget: 'text', defaultValue: '2020', group: 'Timeline · 2020' },
    { key: 'km.ms_3.title', label: 'Milestone 4 title', widget: 'text', defaultValue: 'Exports Begin', group: 'Timeline · 2020' },
    { key: 'km.ms_3.event_0', label: 'Milestone 4 event 1', widget: 'textarea', defaultValue: 'Initiated exports via merchant exporters.', group: 'Timeline · 2020' },

    { key: 'km.ms_4.year', label: 'Milestone 5 year', widget: 'text', defaultValue: '2021', group: 'Timeline · 2021' },
    { key: 'km.ms_4.title', label: 'Milestone 5 title', widget: 'text', defaultValue: 'Capacity Expansion', group: 'Timeline · 2021' },
    { key: 'km.ms_4.event_0', label: 'Milestone 5 event 1', widget: 'textarea', defaultValue: 'Commissioned the second production block for tablets, capsules, softgels, and oral powders.', group: 'Timeline · 2021' },

    { key: 'km.ms_5.year', label: 'Milestone 6 year', widget: 'text', defaultValue: '2022', group: 'Timeline · 2022' },
    { key: 'km.ms_5.title', label: 'Milestone 6 title', widget: 'text', defaultValue: 'Direct Exports & Brand Launch', group: 'Timeline · 2022' },
    { key: 'km.ms_5.event_0', label: 'Milestone 6 event 1', widget: 'textarea', defaultValue: 'Began direct exports of pharmaceutical products.', group: 'Timeline · 2022' },
    { key: 'km.ms_5.event_1', label: 'Milestone 6 event 2', widget: 'textarea', defaultValue: 'Launched the brand "Glow Up".', group: 'Timeline · 2022' },

    { key: 'km.ms_6.year', label: 'Milestone 7 year', widget: 'text', defaultValue: '2023', group: 'Timeline · 2023' },
    { key: 'km.ms_6.title', label: 'Milestone 7 title', widget: 'text', defaultValue: 'Global Certifications', group: 'Timeline · 2023' },
    { key: 'km.ms_6.event_0', label: 'Milestone 7 event 1', widget: 'textarea', defaultValue: 'Achieved WHO GMP Certification and Eco-Cert COSMOS for sustainable cosmetic manufacturing.', group: 'Timeline · 2023' },

    { key: 'km.ms_7.year', label: 'Milestone 8 year', widget: 'text', defaultValue: '2024', group: 'Timeline · 2024' },
    { key: 'km.ms_7.title', label: 'Milestone 8 title', widget: 'text', defaultValue: 'Brand Expansion', group: 'Timeline · 2024' },
    { key: 'km.ms_7.event_0', label: 'Milestone 8 event 1', widget: 'textarea', defaultValue: 'Launched the brand "Regero".', group: 'Timeline · 2024' },

    { key: 'km.ms_8.year', label: 'Milestone 9 year', widget: 'text', defaultValue: '2025', group: 'Timeline · 2025' },
    { key: 'km.ms_8.title', label: 'Milestone 9 title', widget: 'text', defaultValue: 'BSE SME Listing', group: 'Timeline · 2025' },
    { key: 'km.ms_8.event_0', label: 'Milestone 9 event 1', widget: 'textarea', defaultValue: 'Successfully listed on BSE through SME platform.', group: 'Timeline · 2025' },
  ],
}

const LEADERSHIP_PANEL: PageDefaults = {
  path: '/leadership-panel',
  slots: [
    ...hero(
      'People',
      'Leadership Panel',
      "The experienced team of Directors, KMP's & SM driving Astonea Labs forward.",
    ),
    /* ── Section headings ────────────────────────────────────────── */
    { key: 'lp.bm.heading', label: 'Board of Directors heading', widget: 'text', defaultValue: 'Board of Directors', group: 'Section headings' },
    { key: 'lp.kmp.heading', label: 'KMP heading', widget: 'text', defaultValue: 'Key Managerial Personnel', group: 'Section headings' },
    { key: 'lp.sm.heading', label: 'Senior Management heading', widget: 'text', defaultValue: 'Senior Managerial Personnel', group: 'Section headings' },

    /* ── Board of Directors (8 people) ──────────────────────────── */
    { key: 'lp.bm_0.name', label: 'Director 1 name', widget: 'text', defaultValue: 'Mr. Ashish Gulati', group: 'Board of Directors' },
    { key: 'lp.bm_0.title', label: 'Director 1 title', widget: 'text', defaultValue: 'Founder and Managing Director', group: 'Board of Directors' },
    { key: 'lp.bm_0.bio', label: 'Director 1 bio', widget: 'textarea', defaultValue: "Ashish Gulati, Founder & Managing Director of Astonea Labs Limited, is a visionary leader driving the company's evolution into a global hub for pharmaceutical and cosmetic manufacturing. After completing his schooling at Hansraj Public School, he pursued Motorsport Engineering at Oxford Brookes University, United Kingdom. Combining exceptional entrepreneurial insight with strong organizational acumen, Mr. Gulati continues to spearhead strategic growth, innovation, and operational excellence across the organization.", group: 'Board of Directors' },

    { key: 'lp.bm_1.name', label: 'Director 2 name', widget: 'text', defaultValue: 'Mrs. Pooja Singh', group: 'Board of Directors' },
    { key: 'lp.bm_1.title', label: 'Director 2 title', widget: 'text', defaultValue: 'Director', group: 'Board of Directors' },
    { key: 'lp.bm_1.bio', label: 'Director 2 bio', widget: 'textarea', defaultValue: 'Pooja Singh, Director at Astonea Labs Ltd., hails from Uttar Pradesh and holds a B. Pharma degree from Rajeev Gandhi College of Pharmacy. With over 8 years of expertise in Quality Assurance and Drug Regulatory Affairs, she began her career at Medwell Healthcare before joining Astonea Labs in 2021. She now leads the Drug Regulatory Affairs (DRA) department, ensuring rigorous compliance with regulatory standards and maintaining the highest quality benchmarks across the organization.', group: 'Board of Directors' },

    { key: 'lp.bm_2.name', label: 'Director 3 name', widget: 'text', defaultValue: 'Dr Vikrant Narwal', group: 'Board of Directors' },
    { key: 'lp.bm_2.title', label: 'Director 3 title', widget: 'text', defaultValue: 'Director', group: 'Board of Directors' },
    { key: 'lp.bm_2.bio', label: 'Director 3 bio', widget: 'textarea', defaultValue: 'A distinguished nutraceutical expert with 15+ years in R&D and 9 years in direct sales and marketing, Dr. Vikrant Narwal holds a Ph.D. from ICAR-NDRI. With over 350 commercial products developed, he is known for blending scientific precision with market insight to deliver innovative, high-impact nutraceutical solutions. His expertise spans formulation science, functional nutrition, and market-driven product innovation. He continues to play a key role in shaping advanced wellness solutions for the modern consumer.', group: 'Board of Directors' },

    { key: 'lp.bm_3.name', label: 'Director 4 name', widget: 'text', defaultValue: 'Mr. Pradeep Dalal', group: 'Board of Directors' },
    { key: 'lp.bm_3.title', label: 'Director 4 title', widget: 'text', defaultValue: 'Director', group: 'Board of Directors' },
    { key: 'lp.bm_3.bio', label: 'Director 4 bio', widget: 'textarea', defaultValue: "Mr. Pardeep Dalal holds a Bachelor's degree in Arts and has extensive professional experience in the field of finance. He has been appointed as an Additional Director at Astonea Labs Limited, bringing with him strong analytical skills, sound financial understanding, and a commitment to operational excellence. His expertise and leadership are expected to contribute significantly to the company's growth and strategic direction.", group: 'Board of Directors' },

    { key: 'lp.bm_4.name', label: 'Director 5 name', widget: 'text', defaultValue: 'Mr. Arun Kumar Tripathi', group: 'Board of Directors' },
    { key: 'lp.bm_4.title', label: 'Director 5 title', widget: 'text', defaultValue: 'Director', group: 'Board of Directors' },
    { key: 'lp.bm_4.bio', label: 'Director 5 bio', widget: 'textarea', defaultValue: 'With over two decades of experience in the pharmaceutical industry, brings strong expertise in manufacturing, quality assurance, regulatory compliance, and business operations. A B. Pharma graduate from 2002, he is also actively involved in product development, branding, and coordinating third-party manufacturing. His work reflects a passion for creating quality-focused healthcare solutions and a steady vision for sustainable growth in the pharma sector.', group: 'Board of Directors' },

    { key: 'lp.bm_5.name', label: 'Director 6 name', widget: 'text', defaultValue: 'Mr. Karan Vir Bindra', group: 'Board of Directors' },
    { key: 'lp.bm_5.title', label: 'Director 6 title', widget: 'text', defaultValue: 'Independent Director', group: 'Board of Directors' },
    { key: 'lp.bm_5.bio', label: 'Director 6 bio', widget: 'textarea', defaultValue: 'Mr. Karan Vir Bindra brings a multifaceted background to his role as both a Practicing Company Secretary (CS) and an Independent Director. He holds a dual degree in Commerce and Law, having pursued a Bachelor of Commerce and Bachelor of Laws (BCom LLB) degree. With over 12 years of extensive experience, Mr. Bindra has established himself as a seasoned professional in the field of corporate governance and compliance. His role as an Independent Director at Astonea Labs Limited, underscores his commitment to ensuring ethical conduct and robust governance practices within the organization.', group: 'Board of Directors' },

    { key: 'lp.bm_6.name', label: 'Director 7 name', widget: 'text', defaultValue: 'Ms. Salina Chalana', group: 'Board of Directors' },
    { key: 'lp.bm_6.title', label: 'Director 7 title', widget: 'text', defaultValue: 'Independent Director', group: 'Board of Directors' },
    { key: 'lp.bm_6.bio', label: 'Director 7 bio', widget: 'textarea', defaultValue: "Ms. Salina Chalana brings a diverse background to her role as an Independent Director at Astonea Labs Limited, drawing from her experiences in the legal field. She holds a Bachelor of Arts and Bachelor of Laws (BA LLB) degree, reflecting her academic prowess in both humanities and law. With a decade of experience as a practicing lawyer, Ms. Chalana has honed her skills in legal advocacy and advisory services. As an Independent Director, her strategic counsel contributes to Astonea Labs's governance framework, fostering transparency and integrity within the organization.", group: 'Board of Directors' },

    { key: 'lp.bm_7.name', label: 'Director 8 name', widget: 'text', defaultValue: 'Mr. Akash Arora', group: 'Board of Directors' },
    { key: 'lp.bm_7.title', label: 'Director 8 title', widget: 'text', defaultValue: 'Independent Director', group: 'Board of Directors' },
    { key: 'lp.bm_7.bio', label: 'Director 8 bio', widget: 'textarea', defaultValue: "Mr. Akash Arora is an Independent Director in our Company. He holds a Bachelor of Commerce degree from S.D. College, Muzaffarnagar, which he completed in 2010. Additionally, he completed his Chartered Accountancy in March 2013. Mr. Arora's diverse background enriches his role as an Independent Director, drawing on his extensive experience in the banking and financial sectors. He worked as a senior manager at HDFC Bank Limited from January 11, 2016 to July 26, 2019, he also worked as senior associate credit - used car loan at Hero FinCorp from August 5, 2019 to January 10, 2020, making him a valuable asset to our team.", group: 'Board of Directors' },

    /* ── Key Managerial Personnel (2 people) ────────────────────── */
    { key: 'lp.kmp_0.name', label: 'KMP 1 name', widget: 'text', defaultValue: 'Mr. Ankit Kapoor', group: 'Key Managerial Personnel' },
    { key: 'lp.kmp_0.title', label: 'KMP 1 title', widget: 'text', defaultValue: 'Company Secretary and Compliance Officer', group: 'Key Managerial Personnel' },
    { key: 'lp.kmp_0.bio', label: 'KMP 1 bio', widget: 'textarea', defaultValue: 'Mr. Ankit Kapoor is an Associate Member of the Institute of Company Secretaries of India (ICSI) and a graduate in Bachelor of Commerce (Hons.) with a specialization in Accounting & Finance. He is also a semi-qualified Chartered Accountant. He brings strong domain expertise in Corporate Laws, SEBI Regulations, Accounting, Finance, and a wide spectrum of corporate compliance and governance matters. He excels in navigating complex regulatory frameworks and driving organizational compliance with strategic, efficient, and solution oriented approaches.', group: 'Key Managerial Personnel' },

    { key: 'lp.kmp_1.name', label: 'KMP 2 name', widget: 'text', defaultValue: 'Mr. Sumit Kumar', group: 'Key Managerial Personnel' },
    { key: 'lp.kmp_1.title', label: 'KMP 2 title', widget: 'text', defaultValue: 'Chief Financial Officer', group: 'Key Managerial Personnel' },
    { key: 'lp.kmp_1.bio', label: 'KMP 2 bio', widget: 'textarea', defaultValue: "Mr. Sumit Kumar, Chief Financial Officer (CFO) at Astonea Labs Ltd., is a highly accomplished finance professional with an M.Com, MBA, and MA in Economics. Bringing over 15 years of experience, he oversees the company's financial strategy, ensuring sustainable growth, robust financial health, and strategic decision-making to drive long-term business success. His deep financial insight, coupled with a strategic vision, enables Astonea to navigate complex markets and achieve its growth objectives with confidence.", group: 'Key Managerial Personnel' },

    /* ── Senior Management (2 people) ───────────────────────────── */
    { key: 'lp.sm_0.name', label: 'SM 1 name', widget: 'text', defaultValue: 'Mr. Mushtaque Ahmed', group: 'Senior Management' },
    { key: 'lp.sm_0.title', label: 'SM 1 title', widget: 'text', defaultValue: 'Plant Head', group: 'Senior Management' },
    { key: 'lp.sm_0.bio', label: 'SM 1 bio', widget: 'textarea', defaultValue: "Mr. Mushtaque Ahmed, Plant Head at Astonea labs ltd, holds a B. Pharma from Dr. A.P.J. Abdul Kalam Technical University and brings 20 years of manufacturing experience. His extensive expertise ensures efficient, safe, and compliant production processes, maintaining high-quality standards in Astonea's manufacturing operations.", group: 'Senior Management' },

    { key: 'lp.sm_1.name', label: 'SM 2 name', widget: 'text', defaultValue: 'Mr. Gaurav Kumar', group: 'Senior Management' },
    { key: 'lp.sm_1.title', label: 'SM 2 title', widget: 'text', defaultValue: 'VP Sales and Marketing', group: 'Senior Management' },
    { key: 'lp.sm_1.bio', label: 'SM 2 bio', widget: 'textarea', defaultValue: 'Mr. Gaurav Kumar is VP sales and marketing for Astonea Labs Limited for own domestic brands. Mr. Kumar is a Software Engineer and holds an MBA Degree in Marketing from BITM, Pune. His Scope of work includes managing Marketing and Sales segment of the Company.', group: 'Senior Management' },
  ],
}

const BOARD_OF_DIRECTORS: PageDefaults = {
  path: '/board-of-directors',
  slots: [
    ...hero(
      'Governance',
      'Board of Directors',
      'The Board of Astonea Labs Limited brings together executive leadership, non-executive oversight, and independent expertise.',
    ),
    {
      key: 'bod.composition.label',
      label: 'Composition section label',
      widget: 'text',
      defaultValue: 'Board Composition',
      group: 'Composition',
    },
    {
      key: 'bod.composition.heading',
      label: 'Composition heading',
      widget: 'text',
      defaultValue: 'Balanced for independent oversight',
      group: 'Composition',
    },
    {
      key: 'bod.composition.body',
      label: 'Composition body',
      widget: 'textarea',
      defaultValue:
        "Astonea Labs' Board pairs hands-on executive leadership with non-executive and independent oversight — the balance that underpins transparent, accountable governance for a publicly listed company.",
      group: 'Composition',
    },
    {
      key: 'bod.meet_board.heading',
      label: '"Meet the Board" heading',
      widget: 'text',
      defaultValue: 'Meet the Board',
      group: 'Meet the Board',
    },
    {
      key: 'bod.principles.label',
      label: 'Principles section label',
      widget: 'text',
      defaultValue: 'How We Govern',
      group: 'Principles',
    },
    {
      key: 'bod.principles.heading',
      label: 'Principles heading',
      widget: 'text',
      defaultValue: 'Principles that guide the Board',
      group: 'Principles',
    },
    { key: 'bod.cta', label: 'Footer CTA button', widget: 'text', defaultValue: 'Corporate Governance', group: 'Footer' },
    { key: 'bod.cin_label', label: 'CIN label', widget: 'text', defaultValue: 'CIN', group: 'Footer' },
    { key: 'bod.cin_value', label: 'CIN value', widget: 'text', defaultValue: 'L24304CH2017PLC041482', group: 'Footer' },
    { key: 'bod.listing_label', label: 'Listing label', widget: 'text', defaultValue: 'Listing', group: 'Footer' },
    { key: 'bod.listing_value', label: 'Listing value', widget: 'text', defaultValue: 'BSE SME', group: 'Footer' },
    { key: 'bod.footer_text', label: 'Footer description', widget: 'textarea', defaultValue: "For DIN numbers and complete regulatory disclosures, refer to the company's filings on the BSE platform.", group: 'Footer' },

    /* ── Composition cards ──────────────────────────────────────── */
    { key: 'bod.comp_0.label', label: 'Comp card 1 label', widget: 'text', defaultValue: 'Total Directors', group: 'Composition cards' },
    { key: 'bod.comp_1.label', label: 'Comp card 2 label', widget: 'text', defaultValue: 'Executive', group: 'Composition cards' },
    { key: 'bod.comp_2.label', label: 'Comp card 3 label', widget: 'text', defaultValue: 'Non-Executive', group: 'Composition cards' },
    { key: 'bod.comp_3.label', label: 'Comp card 4 label', widget: 'text', defaultValue: 'Independent', group: 'Composition cards' },

    /* ── Directors ──────────────────────────────────────────────── */
    { key: 'bod.dir_0.name', label: 'Director 1 name', widget: 'text', defaultValue: 'Mr. Ashish Gulati', group: 'Directors list' },
    { key: 'bod.dir_0.designation', label: 'Director 1 designation', widget: 'text', defaultValue: 'Founder & Managing Director', group: 'Directors list' },
    { key: 'bod.dir_0.bio', label: 'Director 1 bio', widget: 'textarea', defaultValue: "A visionary leader driving the company's evolution into a global hub for pharmaceutical and cosmetic manufacturing. Combines exceptional entrepreneurial insight with strong organizational acumen to spearhead strategic growth and innovation.", group: 'Directors list' },
    { key: 'bod.dir_1.name', label: 'Director 2 name', widget: 'text', defaultValue: 'Dr. Vikrant Narwal', group: 'Directors list' },
    { key: 'bod.dir_1.designation', label: 'Director 2 designation', widget: 'text', defaultValue: 'Director', group: 'Directors list' },
    { key: 'bod.dir_1.bio', label: 'Director 2 bio', widget: 'textarea', defaultValue: 'Over 15 years in R&D and 9 years in direct sales and marketing. Has developed over 350 commercial products. Expertise in formulation science, functional nutrition, and market-driven product innovation.', group: 'Directors list' },
    { key: 'bod.dir_2.name', label: 'Director 3 name', widget: 'text', defaultValue: 'Mrs. Pooja Singh', group: 'Directors list' },
    { key: 'bod.dir_2.designation', label: 'Director 3 designation', widget: 'text', defaultValue: 'Director', group: 'Directors list' },
    { key: 'bod.dir_2.bio', label: 'Director 3 bio', widget: 'textarea', defaultValue: 'Over 8 years of experience in Quality Assurance and Drug Regulatory Affairs. Joined the Astonea Labs Board on 14 March 2024 and currently leads the Drug Regulatory Affairs department, ensuring rigorous compliance with all regulatory standards.', group: 'Directors list' },
    { key: 'bod.dir_3.name', label: 'Director 4 name', widget: 'text', defaultValue: 'Mr. Pradeep Dalal', group: 'Directors list' },
    { key: 'bod.dir_3.designation', label: 'Director 4 designation', widget: 'text', defaultValue: 'Non-Executive Director', group: 'Directors list' },
    { key: 'bod.dir_3.bio', label: 'Director 4 bio', widget: 'textarea', defaultValue: 'Extensive professional experience in finance with strong analytical skills, sound financial understanding, and a commitment to operational excellence across the organization.', group: 'Directors list' },
    { key: 'bod.dir_4.name', label: 'Director 5 name', widget: 'text', defaultValue: 'Mr. Arun Kumar Tripathi', group: 'Directors list' },
    { key: 'bod.dir_4.designation', label: 'Director 5 designation', widget: 'text', defaultValue: 'Non-Executive Director', group: 'Directors list' },
    { key: 'bod.dir_4.bio', label: 'Director 5 bio', widget: 'textarea', defaultValue: 'Over two decades of experience in the pharmaceutical industry with expertise spanning manufacturing, quality assurance, regulatory compliance, and operations management.', group: 'Directors list' },
    { key: 'bod.dir_5.name', label: 'Director 6 name', widget: 'text', defaultValue: 'Ms. Salina Chalana', group: 'Directors list' },
    { key: 'bod.dir_5.designation', label: 'Director 6 designation', widget: 'text', defaultValue: 'Independent Director', group: 'Directors list' },
    { key: 'bod.dir_5.bio', label: 'Director 6 bio', widget: 'textarea', defaultValue: "A decade of experience as a practicing lawyer specializing in legal advocacy and advisory services. Contributes to the company's governance framework, fostering transparency and integrity.", group: 'Directors list' },
    { key: 'bod.dir_6.name', label: 'Director 7 name', widget: 'text', defaultValue: 'Mr. Karan Vir Bindra', group: 'Directors list' },
    { key: 'bod.dir_6.designation', label: 'Director 7 designation', widget: 'text', defaultValue: 'Independent Director', group: 'Directors list' },
    { key: 'bod.dir_6.bio', label: 'Director 7 bio', widget: 'textarea', defaultValue: 'Over 12 years in corporate governance and compliance. Brings deep expertise in company law, SEBI regulations, and corporate secretarial practice to the board.', group: 'Directors list' },
    { key: 'bod.dir_7.name', label: 'Director 8 name', widget: 'text', defaultValue: 'Mr. Akash Arora', group: 'Directors list' },
    { key: 'bod.dir_7.designation', label: 'Director 8 designation', widget: 'text', defaultValue: 'Independent Director', group: 'Directors list' },
    { key: 'bod.dir_7.bio', label: 'Director 8 bio', widget: 'textarea', defaultValue: 'Extensive banking and financial sector experience including senior manager roles at HDFC Bank (2016–2019) and Hero FinCorp. Brings deep financial acumen and risk management expertise.', group: 'Directors list' },

    /* ── Governance principles ──────────────────────────────────── */
    { key: 'bod.principle_0.title', label: 'Principle 1 title', widget: 'text', defaultValue: 'Independent Oversight', group: 'Principles list' },
    { key: 'bod.principle_0.desc', label: 'Principle 1 description', widget: 'textarea', defaultValue: 'Independent directors bring objective judgement to strategy, audit, and risk — safeguarding the interests of every shareholder.', group: 'Principles list' },
    { key: 'bod.principle_1.title', label: 'Principle 2 title', widget: 'text', defaultValue: 'Regulatory Compliance', group: 'Principles list' },
    { key: 'bod.principle_1.desc', label: 'Principle 2 description', widget: 'textarea', defaultValue: 'The Board upholds SEBI LODR obligations, timely disclosures, and the codes that govern a BSE-listed enterprise.', group: 'Principles list' },
    { key: 'bod.principle_2.title', label: 'Principle 3 title', widget: 'text', defaultValue: 'Shareholder Accountability', group: 'Principles list' },
    { key: 'bod.principle_2.desc', label: 'Principle 3 description', widget: 'textarea', defaultValue: 'Clear reporting lines and committee structures keep management answerable to the Board and its stakeholders.', group: 'Principles list' },
  ],
}

const CAREER: PageDefaults = {
  path: '/career',
  slots: [
    ...hero(
      'Join Us',
      'Career at Astonea Labs',
      'We value our people as our most valuable asset — fostering a dynamic, inclusive, and growth-oriented work environment.',
    ),
    {
      key: 'career.why.label',
      label: '"Why Astonea" label',
      widget: 'text',
      defaultValue: 'Why Astonea',
      group: 'Why Astonea',
    },
    {
      key: 'career.why.heading',
      label: '"Why Astonea" heading',
      widget: 'text',
      defaultValue: 'A place where talent, dedication, and innovation are rewarded',
      group: 'Why Astonea',
    },
    {
      key: 'career.candidates.label',
      label: 'Ideal candidates label',
      widget: 'text',
      defaultValue: 'Who We Are Looking For',
      group: 'Candidates',
    },
    {
      key: 'career.candidates.heading',
      label: 'Ideal candidates heading',
      widget: 'text',
      defaultValue: 'Passionate, ethical, and driven by excellence',
      group: 'Candidates',
    },
    {
      key: 'career.form.label',
      label: 'Apply form label',
      widget: 'text',
      defaultValue: 'Apply Now',
      group: 'Form',
    },
    {
      key: 'career.form.heading',
      label: 'Apply form heading',
      widget: 'text',
      defaultValue: 'Ready to join the Astonea team?',
      group: 'Form',
    },
    {
      key: 'career.form.body',
      label: 'Apply form body',
      widget: 'textarea',
      defaultValue:
        "Fill in the form with your details and we'll be in touch. Alternatively, send your CV directly to cs@astonea.org.",
      group: 'Form',
    },

    /* ── Why join ────────────────────────────────────────────────── */
    { key: 'career.why_0.num', label: 'Reason 1 number', widget: 'text', defaultValue: '01', group: 'Why Astonea list' },
    { key: 'career.why_0.title', label: 'Reason 1 title', widget: 'text', defaultValue: 'State-of-the-Art Facility', group: 'Why Astonea list' },
    { key: 'career.why_0.desc', label: 'Reason 1 description', widget: 'textarea', defaultValue: 'Work in a modern GMP-compliant manufacturing environment with advanced production systems and industry-leading equipment.', group: 'Why Astonea list' },
    { key: 'career.why_1.num', label: 'Reason 2 number', widget: 'text', defaultValue: '02', group: 'Why Astonea list' },
    { key: 'career.why_1.title', label: 'Reason 2 title', widget: 'text', defaultValue: 'Stringent Quality Standards', group: 'Why Astonea list' },
    { key: 'career.why_1.desc', label: 'Reason 2 description', widget: 'textarea', defaultValue: 'Be part of a culture where WHO-GMP, ISO, and cGMP compliance is not just policy — it is embedded in how we operate every single day.', group: 'Why Astonea list' },
    { key: 'career.why_2.num', label: 'Reason 3 number', widget: 'text', defaultValue: '03', group: 'Why Astonea list' },
    { key: 'career.why_2.title', label: 'Reason 3 title', widget: 'text', defaultValue: 'Diverse Product Range', group: 'Why Astonea list' },
    { key: 'career.why_2.desc', label: 'Reason 3 description', widget: 'textarea', defaultValue: 'Engage with a broad portfolio spanning antibiotics, antidiabetics, cardiovascular drugs, cosmetics, and nutraceuticals.', group: 'Why Astonea list' },
    { key: 'career.why_3.num', label: 'Reason 4 number', widget: 'text', defaultValue: '04', group: 'Why Astonea list' },
    { key: 'career.why_3.title', label: 'Reason 4 title', widget: 'text', defaultValue: 'Career Development', group: 'Why Astonea list' },
    { key: 'career.why_3.desc', label: 'Reason 4 description', widget: 'textarea', defaultValue: 'Growth opportunities across manufacturing, R&D, quality assurance, regulatory affairs, marketing, supply chain, and corporate functions.', group: 'Why Astonea list' },
    { key: 'career.why_4.num', label: 'Reason 5 number', widget: 'text', defaultValue: '05', group: 'Why Astonea list' },
    { key: 'career.why_4.title', label: 'Reason 5 title', widget: 'text', defaultValue: 'Collaborative Culture', group: 'Why Astonea list' },
    { key: 'career.why_4.desc', label: 'Reason 5 description', widget: 'textarea', defaultValue: 'A collaborative, inclusive environment that encourages teamwork, innovation, and continuous professional improvement.', group: 'Why Astonea list' },
    { key: 'career.why_5.num', label: 'Reason 6 number', widget: 'text', defaultValue: '06', group: 'Why Astonea list' },
    { key: 'career.why_5.title', label: 'Reason 6 title', widget: 'text', defaultValue: 'Global Exposure', group: 'Why Astonea list' },
    { key: 'career.why_5.desc', label: 'Reason 6 description', widget: 'textarea', defaultValue: 'Involvement in domestic and international operations, USFDA compliance, and global supply chain dynamics.', group: 'Why Astonea list' },

    /* ── Departments ─────────────────────────────────────────────── */
    { key: 'career.dept_label', label: 'Departments section label', widget: 'text', defaultValue: 'Departments Hiring', group: 'Departments' },
    { key: 'career.dept_0', label: 'Department 1', widget: 'text', defaultValue: 'Manufacturing & Production', group: 'Departments' },
    { key: 'career.dept_1', label: 'Department 2', widget: 'text', defaultValue: 'Quality Assurance', group: 'Departments' },
    { key: 'career.dept_2', label: 'Department 3', widget: 'text', defaultValue: 'Research & Development', group: 'Departments' },
    { key: 'career.dept_3', label: 'Department 4', widget: 'text', defaultValue: 'Drug Regulatory Affairs', group: 'Departments' },
    { key: 'career.dept_4', label: 'Department 5', widget: 'text', defaultValue: 'Marketing & Sales', group: 'Departments' },
    { key: 'career.dept_5', label: 'Department 6', widget: 'text', defaultValue: 'Supply Chain & Procurement', group: 'Departments' },
    { key: 'career.dept_6', label: 'Department 7', widget: 'text', defaultValue: 'Finance & Accounts', group: 'Departments' },
    { key: 'career.dept_7', label: 'Department 8', widget: 'text', defaultValue: 'Human Resources', group: 'Departments' },
    { key: 'career.dept_8', label: 'Department 9', widget: 'text', defaultValue: 'Corporate Affairs', group: 'Departments' },

    /* ── Candidate traits ───────────────────────────────────────── */
    { key: 'career.trait_0', label: 'Trait 1', widget: 'textarea', defaultValue: 'Passionate about pharmaceuticals, cosmetics, manufacturing, quality control, and regulatory compliance', group: 'Candidate traits' },
    { key: 'career.trait_1', label: 'Trait 2', widget: 'textarea', defaultValue: 'Eager to learn and innovate in a structured, process-driven environment', group: 'Candidate traits' },
    { key: 'career.trait_2', label: 'Trait 3', widget: 'textarea', defaultValue: 'Committed to ethical standards and quality excellence', group: 'Candidate traits' },
    { key: 'career.trait_3', label: 'Trait 4', widget: 'textarea', defaultValue: 'Adaptable to dynamic industrial and regulatory settings', group: 'Candidate traits' },
    { key: 'career.trait_4', label: 'Trait 5', widget: 'textarea', defaultValue: 'Open to continuous professional development and growth', group: 'Candidate traits' },
    { key: 'career.trait_5', label: 'Trait 6', widget: 'textarea', defaultValue: 'Fresh graduates and experienced professionals are both welcome', group: 'Candidate traits' },

    /* ── Form button ────────────────────────────────────────────── */
    { key: 'career.form.submit', label: 'Submit button', widget: 'text', defaultValue: 'Submit Application →', group: 'Form' },
    { key: 'career.form.success_label', label: 'Success badge label', widget: 'text', defaultValue: 'APPLICATION SUBMITTED', group: 'Form' },
    { key: 'career.form.success_heading', label: 'Success heading', widget: 'text', defaultValue: "We've received your application.", group: 'Form' },
    { key: 'career.form.success_body', label: 'Success body', widget: 'textarea', defaultValue: 'Thank you for your interest. Our HR team will review your application and reach out shortly.', group: 'Form' },
  ],
}

const SUPPORT: PageDefaults = {
  path: '/support',
  slots: [
    ...hero(
      'Customer Support',
      'How can we help?',
      "Raise a support ticket or file a complaint. We'll respond by email and the same status link lets you follow up.",
    ),

    /* ── Two-door grid ─────────────────────────────────────────── */
    { key: 'support.door_1.kicker', label: 'Door 1 kicker', widget: 'text', defaultValue: '01', group: 'Doors' },
    { key: 'support.door_1.title', label: 'Door 1 title', widget: 'text', defaultValue: 'Raise a new ticket', group: 'Doors' },
    { key: 'support.door_1.body', label: 'Door 1 body', widget: 'textarea', defaultValue: "Describe your issue, verify your phone with a 6-digit code, and you'll receive a tracking link by email.", group: 'Doors' },
    { key: 'support.door_1.cta', label: 'Door 1 CTA', widget: 'text', defaultValue: 'Start a ticket →', group: 'Doors' },
    { key: 'support.door_2.kicker', label: 'Door 2 kicker', widget: 'text', defaultValue: '02', group: 'Doors' },
    { key: 'support.door_2.title', label: 'Door 2 title', widget: 'text', defaultValue: 'I already have a ticket', group: 'Doors' },
    { key: 'support.door_2.body', label: 'Door 2 body', widget: 'textarea', defaultValue: 'The confirmation email we sent you contains a status link in the form /support/<token>. Open it to view replies and post follow-ups.', group: 'Doors' },
    { key: 'support.door_2.lost_email', label: 'Door 2 lost-email line', widget: 'textarea', defaultValue: "Lost the email? Raise a new ticket and mention your previous one — we'll merge them.", group: 'Doors' },

    /* ── What support covers ───────────────────────────────────── */
    { key: 'support.covers.title', label: 'Coverage title', widget: 'text', defaultValue: 'What support covers', group: 'Coverage' },
    { key: 'support.covers.item_0', label: 'Coverage item 1', widget: 'text', defaultValue: 'Issues with a product or order you received from Astonea Labs', group: 'Coverage' },
    { key: 'support.covers.item_1', label: 'Coverage item 2', widget: 'text', defaultValue: 'Complaints about quality, packaging, delivery, or service', group: 'Coverage' },
    { key: 'support.covers.item_2', label: 'Coverage item 3', widget: 'text', defaultValue: 'Questions about an existing engagement (open POs, in-flight shipments, prior correspondence)', group: 'Coverage' },
    { key: 'support.covers.redirect_prefix', label: 'Coverage redirect prefix', widget: 'textarea', defaultValue: 'For new business enquiries or job applications, please use the', group: 'Coverage' },
    { key: 'support.covers.contact_link', label: 'Coverage — contact link text', widget: 'text', defaultValue: 'contact', group: 'Coverage' },
    { key: 'support.covers.or_word', label: 'Coverage — "or" connector', widget: 'text', defaultValue: 'or', group: 'Coverage' },
    { key: 'support.covers.career_link', label: 'Coverage — career link text', widget: 'text', defaultValue: 'career', group: 'Coverage' },
    { key: 'support.covers.redirect_suffix', label: 'Coverage redirect suffix', widget: 'text', defaultValue: 'page instead.', group: 'Coverage' },
  ],
}

const SUPPORT_NEW: PageDefaults = {
  path: '/support/new',
  slots: [
    ...hero(
      'Customer Support',
      'Raise a support ticket',
      "Tell us what's wrong and we'll pick it up. You'll get an email confirmation and a link to track replies.",
    ),
    { key: 'support_new.breadcrumb.parent', label: 'Breadcrumb — Support', widget: 'text', defaultValue: 'Support', group: 'Breadcrumb' },
    { key: 'support_new.breadcrumb.self', label: 'Breadcrumb — New ticket', widget: 'text', defaultValue: 'New ticket', group: 'Breadcrumb' },
    { key: 'support_new.sms_disclaimer', label: 'SMS disclaimer', widget: 'textarea', defaultValue: "We'll send a 6-digit code to your mobile to confirm you. Standard SMS rates may apply.", group: 'Disclaimer' },

    /* ── New-ticket form copy (rendered inside the form shell) ──── */
    { key: 'support_new.form.submit', label: 'Submit button', widget: 'text', defaultValue: 'Send verification code →', group: 'Form' },
    { key: 'support_new.form.field.subject', label: 'Subject field label', widget: 'text', defaultValue: 'Subject', group: 'Form' },
    { key: 'support_new.form.field.subject_placeholder', label: 'Subject placeholder', widget: 'text', defaultValue: 'Short summary of the issue', group: 'Form' },
    { key: 'support_new.form.field.company', label: 'Company field label', widget: 'text', defaultValue: 'Company (optional)', group: 'Form' },
    { key: 'support_new.form.field.attachments', label: 'Attachments field label', widget: 'text', defaultValue: 'Attachments (optional)', group: 'Form' },
    { key: 'support_new.form.field.attachments_help', label: 'Attachments help text', widget: 'text', defaultValue: 'Screenshots, invoices, photos. PDF / image / text up to 25 MB each.', group: 'Form' },

    /* ── Success card ──────────────────────────────────────────── */
    { key: 'support_new.success.label', label: 'Success badge label', widget: 'text', defaultValue: 'TICKET LOGGED', group: 'Success' },
    { key: 'support_new.success.heading', label: 'Success heading', widget: 'text', defaultValue: "We've received your ticket.", group: 'Success' },
    { key: 'support_new.success.body', label: 'Success body', widget: 'textarea', defaultValue: 'A confirmation email is on its way with the same tracking link. You can keep this page open or visit it later.', group: 'Success' },
    { key: 'support_new.success.cta', label: 'Success CTA', widget: 'text', defaultValue: 'View ticket status →', group: 'Success' },
  ],
}

const CONTACT_US: PageDefaults = {
  path: '/contact-us',
  slots: [
    ...hero(
      'Get in Touch',
      'Contact Us',
      "Manufacturing enquiries, investor relations, export partnerships, or career — we're ready to connect.",
    ),
    {
      key: 'contact.offices.label',
      label: 'Offices section label',
      widget: 'text',
      defaultValue: 'Our Offices',
      group: 'Offices',
    },
    {
      key: 'contact.offices.heading',
      label: 'Offices heading',
      widget: 'text',
      defaultValue: 'Find us across North India',
      group: 'Offices',
    },
    {
      key: 'contact.form.label',
      label: 'Form section label',
      widget: 'text',
      defaultValue: 'Enquiry Form',
      group: 'Form',
    },
    {
      key: 'contact.form.heading',
      label: 'Form heading',
      widget: 'text',
      defaultValue: 'Send us a message',
      group: 'Form',
    },
    {
      key: 'contact.form.body',
      label: 'Form body',
      widget: 'textarea',
      defaultValue:
        "Whether you're a brand owner looking for a manufacturing partner, an investor with questions, or a professional exploring export opportunities — fill in the form and our team will get back to you within one business day.",
      group: 'Form',
    },
    { key: 'contact.form.submit', label: 'Submit button', widget: 'text', defaultValue: 'Send Enquiry →', group: 'Form' },
    { key: 'contact.form.success_label', label: 'Success badge label', widget: 'text', defaultValue: 'MESSAGE RECEIVED', group: 'Form' },
    { key: 'contact.form.success_heading', label: 'Success heading', widget: 'text', defaultValue: 'Thank you for reaching out.', group: 'Form' },
    { key: 'contact.form.success_body', label: 'Success body', widget: 'textarea', defaultValue: 'Our team will contact you within one business day.', group: 'Form' },

    /* ── Offices ─────────────────────────────────────────────────── */
    { key: 'contact.office_0.label', label: 'Office 1 label', widget: 'text', defaultValue: 'Registered Office', group: 'Offices list' },
    { key: 'contact.office_0.address', label: 'Office 1 address (multi-line)', widget: 'textarea', defaultValue: 'SCO 321-322, Basement, Sector 35B\nChandigarh — 160022', group: 'Offices list' },
    { key: 'contact.office_1.label', label: 'Office 2 label', widget: 'text', defaultValue: 'Corporate Office', group: 'Offices list' },
    { key: 'contact.office_1.address', label: 'Office 2 address (multi-line)', widget: 'textarea', defaultValue: 'Plot No. 63, Industrial Area Phase-II\nPanchkula, Haryana — 134113', group: 'Offices list' },
    { key: 'contact.office_2.label', label: 'Office 3 label', widget: 'text', defaultValue: 'Manufacturing Facility', group: 'Offices list' },
    { key: 'contact.office_2.address', label: 'Office 3 address (multi-line)', widget: 'textarea', defaultValue: 'Vill. Haripur, Tehsil Raipur Rani\nDist. Panchkula, Haryana — 134204', group: 'Offices list' },

    /* ── Department contacts ────────────────────────────────────── */
    { key: 'contact.directory_label', label: 'Contact directory section label', widget: 'text', defaultValue: 'Contact Directories', group: 'Department contacts' },
    { key: 'contact.business_hours', label: 'Business hours', widget: 'text', defaultValue: 'Business Hours: Monday – Saturday, 10 AM – 6 PM (IST)', group: 'Department contacts' },
    { key: 'contact.c_0.dept', label: 'Contact 1 department', widget: 'text', defaultValue: 'Business Development', group: 'Department contacts' },
    { key: 'contact.c_0.email', label: 'Contact 1 email', widget: 'text', defaultValue: 'bdm.astonea@gmail.com', group: 'Department contacts' },
    { key: 'contact.c_0.phone', label: 'Contact 1 phone', widget: 'text', defaultValue: '+91-9997774840', group: 'Department contacts' },
    { key: 'contact.c_1.dept', label: 'Contact 2 department', widget: 'text', defaultValue: 'Export Enquiries', group: 'Department contacts' },
    { key: 'contact.c_1.email', label: 'Contact 2 email', widget: 'text', defaultValue: 'export@astonea.org', group: 'Department contacts' },
    { key: 'contact.c_1.phone', label: 'Contact 2 phone (blank if none)', widget: 'text', defaultValue: '', group: 'Department contacts' },
    { key: 'contact.c_2.dept', label: 'Contact 3 department', widget: 'text', defaultValue: 'Procurement', group: 'Department contacts' },
    { key: 'contact.c_2.email', label: 'Contact 3 email', widget: 'text', defaultValue: 'purchase@astonea.org', group: 'Department contacts' },
    { key: 'contact.c_2.phone', label: 'Contact 3 phone (blank if none)', widget: 'text', defaultValue: '', group: 'Department contacts' },
    { key: 'contact.c_3.dept', label: 'Contact 4 department', widget: 'text', defaultValue: 'Investor Relations', group: 'Department contacts' },
    { key: 'contact.c_3.email', label: 'Contact 4 email', widget: 'text', defaultValue: 'cs@astonea.org', group: 'Department contacts' },
    { key: 'contact.c_3.phone', label: 'Contact 4 phone (blank if none)', widget: 'text', defaultValue: '', group: 'Department contacts' },
  ],
}

const INVESTOR_INSIGHTS: PageDefaults = {
  path: '/investor-insights',
  slots: [
    ...hero(
      'Investor Relations',
      'Investor Insights',
      'All the information, disclosures, and resources an investor in Astonea Labs Limited needs — in one place.',
    ),
    {
      key: 'investor.resources.label',
      label: 'Resources section label',
      widget: 'text',
      defaultValue: 'Resources',
      group: 'Resources',
    },
    {
      key: 'investor.resources.heading',
      label: 'Resources heading',
      widget: 'text',
      defaultValue: 'Investor resources & disclosures',
      group: 'Resources',
    },
    {
      key: 'investor.contact.label',
      label: 'Contact section label',
      widget: 'text',
      defaultValue: 'Investor Contact',
      group: 'Contact',
    },
    {
      key: 'investor.contact.heading',
      label: 'Contact heading',
      widget: 'text',
      defaultValue: 'Questions? Reach our Company Secretary.',
      group: 'Contact',
    },
    {
      key: 'investor.contact.body',
      label: 'Contact body',
      widget: 'textarea',
      defaultValue:
        'For investor grievances, shareholding queries, transfer requests, or compliance-related matters — please reach out to our Compliance Officer.',
      group: 'Contact',
    },
    { key: 'investor.contact.officer_label', label: 'Officer role label', widget: 'text', defaultValue: 'Company Secretary & Compliance Officer', group: 'Contact' },
    { key: 'investor.contact.officer_name', label: 'Officer name', widget: 'text', defaultValue: 'Mr. Ankit Kapoor', group: 'Contact' },
    { key: 'investor.contact.email_label', label: 'Email label', widget: 'text', defaultValue: 'Email', group: 'Contact' },
    { key: 'investor.contact.email', label: 'Officer email', widget: 'text', defaultValue: 'cs@astonea.org', group: 'Contact' },
    { key: 'investor.view', label: 'Quick-link "view" label', widget: 'text', defaultValue: 'View →', group: 'Quick links' },

    /* ── Key facts strip ──────────────────────────────────────── */
    { key: 'investor.fact_0.label', label: 'Fact 1 label', widget: 'text', defaultValue: 'CIN', group: 'Key facts' },
    { key: 'investor.fact_0.value', label: 'Fact 1 value', widget: 'text', defaultValue: 'L24304CH2017PLC041482', group: 'Key facts' },
    { key: 'investor.fact_1.label', label: 'Fact 2 label', widget: 'text', defaultValue: 'Listed On', group: 'Key facts' },
    { key: 'investor.fact_1.value', label: 'Fact 2 value', widget: 'text', defaultValue: 'BSE-SME', group: 'Key facts' },
    { key: 'investor.fact_2.label', label: 'Fact 3 label', widget: 'text', defaultValue: 'Incorporation', group: 'Key facts' },
    { key: 'investor.fact_2.value', label: 'Fact 3 value', widget: 'text', defaultValue: '2017 · Chandigarh', group: 'Key facts' },
    { key: 'investor.fact_3.label', label: 'Fact 4 label', widget: 'text', defaultValue: 'Sector', group: 'Key facts' },
    { key: 'investor.fact_3.value', label: 'Fact 4 value', widget: 'text', defaultValue: 'Pharmaceuticals & Cosmetics', group: 'Key facts' },
    { key: 'investor.fact_4.label', label: 'Fact 5 label', widget: 'text', defaultValue: 'Registered Office', group: 'Key facts' },
    { key: 'investor.fact_4.value', label: 'Fact 5 value', widget: 'text', defaultValue: 'SCO 321-322, Basement, Sector 35B, Chandigarh — 160022', group: 'Key facts' },
    { key: 'investor.fact_5.label', label: 'Fact 6 label', widget: 'text', defaultValue: 'Investor Contact', group: 'Key facts' },
    { key: 'investor.fact_5.value', label: 'Fact 6 value', widget: 'text', defaultValue: 'cs@astonea.org', group: 'Key facts' },

    /* ── Quick links ─────────────────────────────────────────── */
    { key: 'investor.ql_0.title', label: 'Quick link 1 title', widget: 'text', defaultValue: 'Meetings', group: 'Quick links' },
    { key: 'investor.ql_0.desc', label: 'Quick link 1 description', widget: 'textarea', defaultValue: 'Notices, intimations and outcomes of Board, Committee and General Meetings.', group: 'Quick links' },
    { key: 'investor.ql_1.title', label: 'Quick link 2 title', widget: 'text', defaultValue: 'Shareholding Pattern', group: 'Quick links' },
    { key: 'investor.ql_1.desc', label: 'Quick link 2 description', widget: 'textarea', defaultValue: 'Quarterly shareholding pattern filings submitted under Regulation 31 of SEBI LODR.', group: 'Quick links' },
    { key: 'investor.ql_2.title', label: 'Quick link 3 title', widget: 'text', defaultValue: 'Integrated Fillings', group: 'Quick links' },
    { key: 'investor.ql_2.desc', label: 'Quick link 3 description', widget: 'textarea', defaultValue: 'Integrated governance and financial filings submitted on a quarterly basis to BSE.', group: 'Quick links' },
    { key: 'investor.ql_3.title', label: 'Quick link 4 title', widget: 'text', defaultValue: 'Corporate Announcement', group: 'Quick links' },
    { key: 'investor.ql_3.desc', label: 'Quick link 4 description', widget: 'textarea', defaultValue: 'Material events, intimations and corporate announcements filed with the exchange.', group: 'Quick links' },
    { key: 'investor.ql_4.title', label: 'Quick link 5 title', widget: 'text', defaultValue: 'Newspaper Publications', group: 'Quick links' },
    { key: 'investor.ql_4.desc', label: 'Quick link 5 description', widget: 'textarea', defaultValue: 'Statutory financial results and notices published in approved newspapers.', group: 'Quick links' },
    { key: 'investor.ql_5.title', label: 'Quick link 6 title', widget: 'text', defaultValue: 'Investor Grievances', group: 'Quick links' },
    { key: 'investor.ql_5.desc', label: 'Quick link 6 description', widget: 'textarea', defaultValue: 'SEBI SCORES-compliant grievance redressal mechanism for shareholders.', group: 'Quick links' },
    { key: 'investor.ql_6.title', label: 'Quick link 7 title', widget: 'text', defaultValue: 'Registrars and Shares Transfer Agent', group: 'Quick links' },
    { key: 'investor.ql_6.desc', label: 'Quick link 7 description', widget: 'textarea', defaultValue: 'Contact details of the Registrar and Share Transfer Agent for share-related queries.', group: 'Quick links' },
    { key: 'investor.ql_7.title', label: 'Quick link 8 title', widget: 'text', defaultValue: 'Trading Window Closure', group: 'Quick links' },
    { key: 'investor.ql_7.desc', label: 'Quick link 8 description', widget: 'textarea', defaultValue: 'Intimations of trading window closure under SEBI (Prohibition of Insider Trading) Regulations.', group: 'Quick links' },
    { key: 'investor.ql_8.title', label: 'Quick link 9 title', widget: 'text', defaultValue: 'Related Party Transactions', group: 'Quick links' },
    { key: 'investor.ql_8.desc', label: 'Quick link 9 description', widget: 'textarea', defaultValue: 'Half-yearly disclosures of related party transactions filed under Regulation 23.', group: 'Quick links' },

    /* ── IR services (4 cards) ─────────────────────────────── */
    { key: 'investor.svc_0.label', label: 'Service 1 label', widget: 'text', defaultValue: 'Investor Grievances', group: 'IR services' },
    { key: 'investor.svc_0.desc', label: 'Service 1 description', widget: 'text', defaultValue: 'SEBI-compliant investor grievance mechanism', group: 'IR services' },
    { key: 'investor.svc_1.label', label: 'Service 2 label', widget: 'text', defaultValue: 'Share Transfers', group: 'IR services' },
    { key: 'investor.svc_1.desc', label: 'Service 2 description', widget: 'text', defaultValue: 'Registrar and share transfer agent contact', group: 'IR services' },
    { key: 'investor.svc_2.label', label: 'Service 3 label', widget: 'text', defaultValue: 'Corporate Announcements', group: 'IR services' },
    { key: 'investor.svc_2.desc', label: 'Service 3 description', widget: 'text', defaultValue: 'Material events and exchange filings', group: 'IR services' },
    { key: 'investor.svc_3.label', label: 'Service 4 label', widget: 'text', defaultValue: 'Newspaper Publications', group: 'IR services' },
    { key: 'investor.svc_3.desc', label: 'Service 4 description', widget: 'text', defaultValue: 'Statutory notices in approved newspapers', group: 'IR services' },
  ],
}

const CORPORATE_GOVERNANCE: PageDefaults = {
  path: '/corporate-governance',
  slots: [
    ...hero(
      'Investor Relations',
      'Corporate Governance',
      "Astonea Labs Limited's governance structure — transparent, accountable, and fully compliant with SEBI Listing Obligations.",
    ),
    {
      key: 'gov.commitment.label',
      label: 'Commitment section label',
      widget: 'text',
      defaultValue: 'Our Commitment',
      group: 'Commitment',
    },
    {
      key: 'gov.commitment.heading',
      label: 'Commitment heading',
      widget: 'text',
      defaultValue: 'Transparent by design',
      group: 'Commitment',
    },
    {
      key: 'gov.commitment.body_1',
      label: 'Commitment paragraph 1',
      widget: 'textarea',
      defaultValue:
        'As a BSE-SME company on BSE, Astonea Labs Limited (CIN: L24304CH2017PLC041482) is committed to the highest standards of corporate governance — ensuring transparency, accountability, and protection of shareholder interests at every level.',
      group: 'Commitment',
    },
    {
      key: 'gov.commitment.body_2',
      label: 'Commitment paragraph 2',
      widget: 'textarea',
      defaultValue:
        'Our governance framework is anchored in the Companies Act 2013, SEBI LODR Regulations, SEBI (Prohibition of Insider Trading) Regulations, and other applicable laws and best practices.',
      group: 'Commitment',
    },
    {
      key: 'gov.committees.label',
      label: 'Committees section label',
      widget: 'text',
      defaultValue: 'Board Committees',
      group: 'Committees',
    },
    {
      key: 'gov.committees.heading',
      label: 'Committees heading',
      widget: 'text',
      defaultValue: 'Specialised oversight for every domain',
      group: 'Committees',
    },
    {
      key: 'gov.resources.label',
      label: 'Resources section label',
      widget: 'text',
      defaultValue: 'Governance Resources',
      group: 'Resources',
    },
    {
      key: 'gov.resources.heading',
      label: 'Resources heading',
      widget: 'text',
      defaultValue: 'Documents & disclosures',
      group: 'Resources',
    },

    /* ── Committees ──────────────────────────────────────────── */
    { key: 'gov.committee.chair_label', label: '"Chairperson:" label', widget: 'text', defaultValue: 'Chairperson:', group: 'Committees list' },
    { key: 'gov.com_0.num', label: 'Committee 1 number', widget: 'text', defaultValue: '01', group: 'Committees list' },
    { key: 'gov.com_0.name', label: 'Committee 1 name', widget: 'text', defaultValue: 'Audit Committee', group: 'Committees list' },
    { key: 'gov.com_0.desc', label: 'Committee 1 description', widget: 'textarea', defaultValue: 'Oversees financial reporting, internal controls, and the audit process. Ensures integrity of financial statements and compliance with accounting standards.', group: 'Committees list' },
    { key: 'gov.com_0.chair', label: 'Committee 1 chair', widget: 'text', defaultValue: 'Independent Director', group: 'Committees list' },
    { key: 'gov.com_1.num', label: 'Committee 2 number', widget: 'text', defaultValue: '02', group: 'Committees list' },
    { key: 'gov.com_1.name', label: 'Committee 2 name', widget: 'text', defaultValue: 'Nomination & Remuneration Committee', group: 'Committees list' },
    { key: 'gov.com_1.desc', label: 'Committee 2 description', widget: 'textarea', defaultValue: 'Responsible for identifying and recommending Board candidates, and determining the remuneration policy for directors and key managerial personnel.', group: 'Committees list' },
    { key: 'gov.com_1.chair', label: 'Committee 2 chair', widget: 'text', defaultValue: 'Independent Director', group: 'Committees list' },
    { key: 'gov.com_2.num', label: 'Committee 3 number', widget: 'text', defaultValue: '03', group: 'Committees list' },
    { key: 'gov.com_2.name', label: 'Committee 3 name', widget: 'text', defaultValue: 'Stakeholders Relationship Committee', group: 'Committees list' },
    { key: 'gov.com_2.desc', label: 'Committee 3 description', widget: 'textarea', defaultValue: 'Handles investor grievances, share transfers, and ensures timely resolution of shareholder queries and complaints.', group: 'Committees list' },
    { key: 'gov.com_2.chair', label: 'Committee 3 chair', widget: 'text', defaultValue: 'Non-Executive Director', group: 'Committees list' },
    { key: 'gov.com_3.num', label: 'Committee 4 number', widget: 'text', defaultValue: '04', group: 'Committees list' },
    { key: 'gov.com_3.name', label: 'Committee 4 name', widget: 'text', defaultValue: 'CSR Committee', group: 'Committees list' },
    { key: 'gov.com_3.desc', label: 'Committee 4 description', widget: 'textarea', defaultValue: 'Formulates and monitors the Corporate Social Responsibility Policy, overseeing CSR spending and activities in line with the Companies Act, 2013.', group: 'Committees list' },
    { key: 'gov.com_3.chair', label: 'Committee 4 chair', widget: 'text', defaultValue: 'Managing Director', group: 'Committees list' },
    { key: 'gov.com_4.num', label: 'Committee 5 number', widget: 'text', defaultValue: '05', group: 'Committees list' },
    { key: 'gov.com_4.name', label: 'Committee 5 name', widget: 'text', defaultValue: 'Risk Management Committee', group: 'Committees list' },
    { key: 'gov.com_4.desc', label: 'Committee 5 description', widget: 'textarea', defaultValue: 'Identifies, assesses, and manages business risks — financial, operational, regulatory, and reputational.', group: 'Committees list' },
    { key: 'gov.com_4.chair', label: 'Committee 5 chair', widget: 'text', defaultValue: 'Independent Director', group: 'Committees list' },
    { key: 'gov.com_extra.title', label: 'Composition link card title', widget: 'text', defaultValue: 'Committee composition', group: 'Committees list' },
    { key: 'gov.com_extra.desc', label: 'Composition link card description', widget: 'textarea', defaultValue: 'Full membership and chairperson details for all Board committees, as required under SEBI LODR.', group: 'Committees list' },
    { key: 'gov.com_extra.cta', label: 'Composition link card CTA', widget: 'text', defaultValue: 'View PDF', group: 'Committees list' },

    /* ── Governance facts ─────────────────────────────────────── */
    { key: 'gov.fact_0.label', label: 'Fact 1 label', widget: 'text', defaultValue: 'Board Strength', group: 'Governance facts' },
    { key: 'gov.fact_0.value', label: 'Fact 1 value', widget: 'text', defaultValue: '9 Directors', group: 'Governance facts' },
    { key: 'gov.fact_0.note', label: 'Fact 1 note', widget: 'text', defaultValue: '3 Independent · 1 Non-Executive · 5 Executive', group: 'Governance facts' },
    { key: 'gov.fact_1.label', label: 'Fact 2 label', widget: 'text', defaultValue: 'Listed On', group: 'Governance facts' },
    { key: 'gov.fact_1.value', label: 'Fact 2 value', widget: 'text', defaultValue: 'BSE', group: 'Governance facts' },
    { key: 'gov.fact_1.note', label: 'Fact 2 note', widget: 'text', defaultValue: 'Bombay Stock Exchange & National Stock Exchange', group: 'Governance facts' },
    { key: 'gov.fact_2.label', label: 'Fact 3 label', widget: 'text', defaultValue: 'Compliance Framework', group: 'Governance facts' },
    { key: 'gov.fact_2.value', label: 'Fact 3 value', widget: 'text', defaultValue: 'SEBI LODR', group: 'Governance facts' },
    { key: 'gov.fact_2.note', label: 'Fact 3 note', widget: 'text', defaultValue: 'Listing Obligations & Disclosure Requirements', group: 'Governance facts' },
    { key: 'gov.fact_3.label', label: 'Fact 4 label', widget: 'text', defaultValue: 'Statutory Auditor', group: 'Governance facts' },
    { key: 'gov.fact_3.value', label: 'Fact 4 value', widget: 'text', defaultValue: 'Independent CA Firm', group: 'Governance facts' },
    { key: 'gov.fact_3.note', label: 'Fact 4 note', widget: 'text', defaultValue: 'Appointed by shareholders at AGM', group: 'Governance facts' },

    /* ── Governance docs ──────────────────────────────────────── */
    { key: 'gov.doc_0.title', label: 'Doc 1 title', widget: 'text', defaultValue: 'Corporate Documents', group: 'Governance docs' },
    { key: 'gov.doc_0.desc', label: 'Doc 1 description', widget: 'textarea', defaultValue: 'Memorandum and Articles of Association, incorporation documents, and statutory registers.', group: 'Governance docs' },
    { key: 'gov.doc_1.title', label: 'Doc 2 title', widget: 'text', defaultValue: 'Policies', group: 'Governance docs' },
    { key: 'gov.doc_1.desc', label: 'Doc 2 description', widget: 'textarea', defaultValue: 'Board-approved governance policies covering POSH, RPT, succession, board diversity and more.', group: 'Governance docs' },
    { key: 'gov.doc_2.title', label: 'Doc 3 title', widget: 'text', defaultValue: 'Codes', group: 'Governance docs' },
    { key: 'gov.doc_2.desc', label: 'Doc 3 description', widget: 'textarea', defaultValue: 'Codes of conduct governing insider trading, fair disclosure and conduct of Board & Senior Management.', group: 'Governance docs' },
    { key: 'gov.doc_3.title', label: 'Doc 4 title', widget: 'text', defaultValue: 'Board of Directors', group: 'Governance docs' },
    { key: 'gov.doc_3.desc', label: 'Doc 4 description', widget: 'textarea', defaultValue: 'Composition of the Board — Executive, Non-Executive, and Independent Directors leading the Company.', group: 'Governance docs' },
    { key: 'gov.doc_4.title', label: 'Doc 5 title', widget: 'text', defaultValue: 'Committees of BOD', group: 'Governance docs' },
    { key: 'gov.doc_4.desc', label: 'Doc 5 description', widget: 'textarea', defaultValue: 'Board sub-committees overseeing audit, nomination, remuneration, stakeholder, CSR and risk functions.', group: 'Governance docs' },
    { key: 'gov.doc_5.title', label: 'Doc 6 title', widget: 'text', defaultValue: 'Secretarial Audit Report', group: 'Governance docs' },
    { key: 'gov.doc_5.desc', label: 'Doc 6 description', widget: 'textarea', defaultValue: 'Annual secretarial audit report from a practicing Company Secretary as required under the Companies Act, 2013.', group: 'Governance docs' },
    { key: 'gov.doc_6.title', label: 'Doc 7 title', widget: 'text', defaultValue: 'Board Meetings', group: 'Governance docs' },
    { key: 'gov.doc_6.desc', label: 'Doc 7 description', widget: 'textarea', defaultValue: 'Notices and outcomes of Board meetings as disclosed under SEBI LODR Regulations.', group: 'Governance docs' },
  ],
}

/* ─── Document-list and disclosure pages (hero-only) ────────────────────── */

const docPage = (
  path: string,
  eyebrow: string,
  title: string,
  description: string,
  extras?: Partial<{
    archiveEyebrow: string
    archiveHeading: string
    disclaimer: string
    emptyState: string
  }>,
): PageDefaults => ({
  path,
  slots: [
    ...hero(eyebrow, title, description),
    {
      key: 'doc.archive.eyebrow',
      label: 'Archive section eyebrow',
      widget: 'text',
      defaultValue: extras?.archiveEyebrow ?? 'Reports Archive',
      group: 'Archive',
    },
    {
      key: 'doc.archive.heading',
      label: 'Archive section heading',
      widget: 'text',
      defaultValue: extras?.archiveHeading ?? `${title} for every financial year`,
      group: 'Archive',
    },
    {
      key: 'doc.empty',
      label: 'Empty-state message',
      help: 'Shown when no PDFs have been uploaded yet for this page.',
      widget: 'textarea',
      defaultValue: extras?.emptyState ?? 'No documents have been published yet.',
      group: 'Archive',
    },
    {
      key: 'doc.disclaimer',
      label: 'Footer disclaimer',
      widget: 'textarea',
      defaultValue:
        extras?.disclaimer ??
        'Documents listed above are filed with BSE in accordance with SEBI LODR Regulations. CIN: L24304CH2017PLC041482 — Astonea Labs Limited, Chandigarh, India. For the most current filings, refer to the exchange portals or contact cs@astonea.org.',
      group: 'Archive',
    },
  ],
})

const REGISTRY: PageDefaults[] = [
  HOME,
  ABOUT_US,
  VISION_AND_MISSION,
  WHAT_WE_DO,
  CSR,
  CAREER,
  CONTACT_US,
  SUPPORT,
  SUPPORT_NEW,
  MANUFACTURING_FACILITY,
  CERTIFICATIONS,
  KEY_MILESTONE,
  LEADERSHIP_PANEL,
  BOARD_OF_DIRECTORS,
  INVESTOR_INSIGHTS,
  CORPORATE_GOVERNANCE,

  // Hero-only document & disclosure pages
  {
    path: '/group-companies',
    slots: [
      ...hero(
        'Corporate Structure',
        'Group Companies',
        'Astonea Labs Limited operates alongside several affiliated entities forming a diversified pharmaceutical and cosmetic group.',
      ),
      { key: 'gc.crumb.self', label: 'Breadcrumb label', widget: 'text', defaultValue: 'Group Companies', group: 'Breadcrumb' },

      /* ── Companies grid ────────────────────────────────────────── */
      { key: 'gc.grid.label', label: 'Grid section label', widget: 'text', defaultValue: 'Corporate Family', group: 'Companies grid' },
      { key: 'gc.grid.heading', label: 'Grid heading', widget: 'text', defaultValue: 'Entities within the Astonea group', group: 'Companies grid' },
      { key: 'gc.tag.parent', label: 'Parent-entity tag', widget: 'text', defaultValue: 'Listed', group: 'Tags' },
      { key: 'gc.tag.subsidiary', label: 'Subsidiary tag', widget: 'text', defaultValue: 'Private', group: 'Tags' },
      { key: 'gc.tag.associate', label: 'Associate tag', widget: 'text', defaultValue: 'Public', group: 'Tags' },
      { key: 'gc.tag.nonprofit', label: 'Non-profit tag', widget: 'text', defaultValue: 'Section 8 Company', group: 'Tags' },
      { key: 'gc.cin_label', label: 'CIN prefix', widget: 'text', defaultValue: 'CIN:', group: 'Cards' },
      { key: 'gc.cta.view_financials', label: 'View financials CTA', widget: 'text', defaultValue: 'View Financials', group: 'Cards' },
      { key: 'gc.cta.unavailable', label: 'Financials unavailable label', widget: 'text', defaultValue: 'Financials Unavailable', group: 'Cards' },
      { key: 'gc.cta.unavailable_tooltip', label: 'Unavailable tooltip', widget: 'text', defaultValue: 'No financials available yet', group: 'Cards' },
      { key: 'gc.cta.visit_website', label: 'Visit website CTA', widget: 'text', defaultValue: 'Visit website', group: 'Cards' },

      /* ── Group financials ──────────────────────────────────────── */
      { key: 'gc.financials.label', label: 'Financials section label', widget: 'text', defaultValue: 'Financial Documents', group: 'Group financials' },
      { key: 'gc.financials.heading', label: 'Financials heading', widget: 'text', defaultValue: 'Group company financials', group: 'Group financials' },
      { key: 'gc.financials.intro_before', label: 'Intro — before "Financial Results" link', widget: 'text', defaultValue: 'Annual financial statements for each entity within the Astonea group. For Astonea Labs Limited financials, refer to the ', group: 'Group financials' },
      { key: 'gc.financials.fr_link', label: 'Intro — "Financial Results" link text', widget: 'text', defaultValue: 'Financial Results', group: 'Group financials' },
      { key: 'gc.financials.intro_middle', label: 'Intro — between links', widget: 'text', defaultValue: ' and ', group: 'Group financials' },
      { key: 'gc.financials.ar_link', label: 'Intro — "Annual Reports" link text', widget: 'text', defaultValue: 'Annual Reports', group: 'Group financials' },
      { key: 'gc.financials.intro_after', label: 'Intro — trailing text', widget: 'text', defaultValue: ' pages.', group: 'Group financials' },
      { key: 'gc.financials.fy_badge', label: 'FY pill badge', widget: 'text', defaultValue: 'FY', group: 'Group financials' },
      { key: 'gc.financials.pdf_label', label: 'PDF link label', widget: 'text', defaultValue: 'PDF', group: 'Group financials' },
    ],
  },
  {
    path: '/subsidiaries',
    slots: [
      ...hero(
        'Corporate Structure',
        'Subsidiaries',
        "Astonea Labs Limited's subsidiary entities supporting the group's global expansion strategy.",
      ),
      { key: 'sub.crumb.self', label: 'Breadcrumb label', widget: 'text', defaultValue: 'Subsidiaries', group: 'Breadcrumb' },

      /* ── Section header ────────────────────────────────────────── */
      { key: 'sub.section.label', label: 'Section label', widget: 'text', defaultValue: 'Subsidiaries', group: 'Section header' },
      { key: 'sub.section.heading', label: 'Section heading', widget: 'text', defaultValue: 'Global footprint through subsidiary entities', group: 'Section header' },

      /* ── Astonea LLC card ──────────────────────────────────────── */
      { key: 'sub.card.badge', label: 'Card badge — type', widget: 'text', defaultValue: 'Wholly Owned Subsidiary', group: 'Astonea LLC card' },
      { key: 'sub.card.country', label: 'Card badge — country', widget: 'text', defaultValue: 'USA', group: 'Astonea LLC card' },
      { key: 'sub.card.name', label: 'Subsidiary name', widget: 'text', defaultValue: 'Astonea LLC', group: 'Astonea LLC card' },
      { key: 'sub.card.subtitle', label: 'Subsidiary subtitle', widget: 'text', defaultValue: 'Wholly Owned Subsidiary — United States of America', group: 'Astonea LLC card' },
      { key: 'sub.card.body', label: 'Subsidiary description', widget: 'textarea', defaultValue: "Astonea LLC is the wholly owned US subsidiary (WOS) of Astonea Labs Limited, incorporated to support the company's international expansion, distribution, and market development efforts in North America. The establishment of this entity is a significant step in Astonea's vision to become a global pharmaceutical and cosmetic brand.", group: 'Astonea LLC card' },
      { key: 'sub.card.doc_cta', label: 'Incorporation doc CTA', widget: 'text', defaultValue: 'View Incorporation Document', group: 'Astonea LLC card' },
      { key: 'sub.card.footer_before_link', label: 'Footer — before SEBI link', widget: 'textarea', defaultValue: 'Parent Company CIN: L24304CH2017PLC041482 — Astonea Labs Limited, Chandigarh, India. For other regulatory filings, refer to ', group: 'Astonea LLC card' },
      { key: 'sub.card.footer_link', label: 'Footer — SEBI link text', widget: 'text', defaultValue: 'SEBI LODR Reg. 30 Disclosures', group: 'Astonea LLC card' },
      { key: 'sub.card.footer_after_link', label: 'Footer — trailing text', widget: 'text', defaultValue: '.', group: 'Astonea LLC card' },

      /* ── Context note ──────────────────────────────────────────── */
      { key: 'sub.note.heading', label: 'Context note heading', widget: 'text', defaultValue: 'Group Company Relationships', group: 'Context note' },
      { key: 'sub.note.before_link', label: 'Note — before "Group Companies" link', widget: 'text', defaultValue: 'In addition to Astonea LLC, the Astonea group includes several affiliated entities in India. For the complete corporate structure, refer to the ', group: 'Context note' },
      { key: 'sub.note.link', label: 'Note — "Group Companies" link text', widget: 'text', defaultValue: 'Group Companies', group: 'Context note' },
      { key: 'sub.note.after_link', label: 'Note — trailing text', widget: 'text', defaultValue: " page and the company's annual reports and regulatory filings.", group: 'Context note' },
    ],
  },
  {
    path: '/governance-policies-codes-and-frameworks',
    slots: [
      ...hero(
        'Governance',
        'Governance Policies, Codes & Frameworks',
        "The formal policies, codes, and regulatory frameworks that govern Astonea Labs Limited's operations and ethics.",
      ),
      { key: 'gpcf.crumb.investors', label: 'Breadcrumb — Investors', widget: 'text', defaultValue: 'Investors', group: 'Breadcrumb' },
      { key: 'gpcf.crumb.self', label: 'Breadcrumb — Governance Policies', widget: 'text', defaultValue: 'Governance Policies', group: 'Breadcrumb' },

      { key: 'gpcf.section.label', label: 'Section label', widget: 'text', defaultValue: 'Categories', group: 'Section header' },
      { key: 'gpcf.section.heading', label: 'Section heading', widget: 'text', defaultValue: 'Browse governance documents', group: 'Section header' },
      { key: 'gpcf.card.view', label: 'Card "View" link', widget: 'text', defaultValue: 'View →', group: 'Cards' },

      { key: 'gpcf.cat_0.title', label: 'Category 1 title', widget: 'text', defaultValue: 'Policies', group: 'Categories' },
      { key: 'gpcf.cat_0.desc', label: 'Category 1 description', widget: 'textarea', defaultValue: 'Board-approved governance policies covering POSH, RPT, succession, board diversity and more.', group: 'Categories' },
      { key: 'gpcf.cat_1.title', label: 'Category 2 title', widget: 'text', defaultValue: 'Codes', group: 'Categories' },
      { key: 'gpcf.cat_1.desc', label: 'Category 2 description', widget: 'textarea', defaultValue: 'Codes of conduct governing insider trading, fair disclosure and conduct of Board & Senior Management.', group: 'Categories' },
      { key: 'gpcf.cat_2.title', label: 'Category 3 title', widget: 'text', defaultValue: 'Frameworks', group: 'Categories' },
      { key: 'gpcf.cat_2.desc', label: 'Category 3 description', widget: 'textarea', defaultValue: 'Frameworks governing compliance, evaluation and board processes.', group: 'Categories' },
    ],
  },
  {
    path: '/meetings',
    slots: [
      ...hero(
        'Investor Relations',
        'Meetings',
        'Notices, intimations and outcomes of Board, Committee and General Meetings of Astonea Labs Limited.',
      ),
      { key: 'meetings.label', label: 'Section label', widget: 'text', defaultValue: 'Categories', group: 'Meetings list' },
      { key: 'meetings.heading', label: 'Section heading', widget: 'text', defaultValue: 'Browse meeting disclosures', group: 'Meetings list' },
      { key: 'meetings.view', label: 'Card view link', widget: 'text', defaultValue: 'View →', group: 'Meetings list' },
      { key: 'meetings.cat_0.title', label: 'AGM card title', widget: 'text', defaultValue: 'Annual General Meetings (AGM)', group: 'Meetings list' },
      { key: 'meetings.cat_0.desc', label: 'AGM card description', widget: 'textarea', defaultValue: 'Notices, corrigenda, proceedings and scrutinizer reports of Annual General Meetings.', group: 'Meetings list' },
      { key: 'meetings.cat_1.title', label: 'EGM card title', widget: 'text', defaultValue: 'Extra-Ordinary General Meetings (EGM)', group: 'Meetings list' },
      { key: 'meetings.cat_1.desc', label: 'EGM card description', widget: 'textarea', defaultValue: 'Notices, proceedings and scrutinizer reports of Extra-Ordinary General Meetings.', group: 'Meetings list' },
      { key: 'meetings.cat_2.title', label: 'Board Meetings card title', widget: 'text', defaultValue: 'Board Meetings', group: 'Meetings list' },
      { key: 'meetings.cat_2.desc', label: 'Board Meetings card description', widget: 'textarea', defaultValue: 'Intimations and outcomes of meetings of the Board of Directors.', group: 'Meetings list' },
    ],
  },
  {
    path: '/investor-grievances',
    slots: [
      ...hero(
        'Investor Relations',
        'Investor Grievances',
        'Investors and shareholders may direct any grievance to the Compliance Officer at the contact below.',
      ),
      { key: 'grievances.label', label: 'Section label', widget: 'text', defaultValue: 'Grievance Redressal', group: 'Grievances' },
      { key: 'grievances.heading', label: 'Section heading', widget: 'text', defaultValue: 'Investors / Shareholders / Grievances Redressal', group: 'Grievances' },
      { key: 'grievances.officer_name', label: 'Compliance officer name', widget: 'text', defaultValue: 'Mr. Ankit Kapoor', group: 'Grievances' },
      { key: 'grievances.officer_role', label: 'Compliance officer role', widget: 'text', defaultValue: 'Company Secretary & Compliance Officer', group: 'Grievances' },
      { key: 'grievances.email_label', label: 'Email label', widget: 'text', defaultValue: 'Email', group: 'Grievances' },
      { key: 'grievances.email', label: 'Compliance officer email', widget: 'text', defaultValue: 'investorgrievance@astonea.org', group: 'Grievances' },
    ],
  },
  {
    path: '/registrar-share-transfer-agent',
    slots: [
      ...hero(
        'Investor Relations',
        'Registrar & Share Transfer Agent',
        'All share transfer, dematerialisation and shareholder service queries are handled by the Registrar and Share Transfer Agent listed below.',
      ),
      { key: 'rta.label', label: 'Section label', widget: 'text', defaultValue: 'Registrar & Share Transfer Agent', group: 'Registrar' },
      { key: 'rta.name', label: 'Registrar name', widget: 'text', defaultValue: 'KFin Technologies Limited', group: 'Registrar' },
      { key: 'rta.address_label', label: 'Address label', widget: 'text', defaultValue: 'Address', group: 'Registrar' },
      { key: 'rta.address', label: 'Registrar address (multi-line)', help: 'Use line breaks for multi-line address.', widget: 'textarea', defaultValue: 'Selenium Building, Tower-B,\nPlot No 31 & 32, Financial District,\nNanakramguda, Serilingampally,\nHyderabad, Rangareddi,\nTelangana, India — 500 032', group: 'Registrar' },
    ],
  },
  docPage(
    '/annual-reports',
    'Investor Relations',
    'Annual Reports',
    "Astonea Labs Limited's complete annual reports — financial statements, governance, and corporate disclosures.",
  ),
  docPage(
    '/financial-results',
    'Investor Relations',
    'Financial Results',
    "Astonea Labs Limited's audited annual financial statements, half-yearly results and restated financial statements.",
  ),
  docPage(
    '/board-meetings',
    'Meetings',
    'Board Meetings',
    'Intimations and outcomes of meetings of the Board of Directors of Astonea Labs Limited.',
  ),
  docPage(
    '/agm',
    'Meetings',
    'Annual General Meetings (AGM)',
    'Notices, corrigenda, proceedings and scrutinizer reports of Annual General Meetings of Astonea Labs Limited.',
  ),
  docPage(
    '/egm',
    'Meetings',
    'Extra-Ordinary General Meetings (EGM)',
    'Notices, proceedings and scrutinizer reports of Extra-Ordinary General Meetings of Astonea Labs Limited.',
  ),
  docPage(
    '/shareholding-pattern',
    'Investor Relations',
    'Shareholding Pattern',
    'Half-yearly shareholding pattern filings submitted by Astonea Labs Limited under Regulation 31 of SEBI LODR.',
  ),
  docPage(
    '/trading-window-closure',
    'Investor Relations',
    'Trading Window Closure',
    'Intimations of trading window closure of Astonea Labs Limited under SEBI (Prohibition of Insider Trading) Regulations, 2015.',
  ),
  docPage(
    '/related-party-transactions',
    'Investor Relations',
    'Related Party Transactions',
    'Half-yearly and yearly disclosures of related party transactions of Astonea Labs Limited filed under Regulation 23 of SEBI LODR.',
  ),
  docPage(
    '/sebi-lodr-regulation-30-disclosures',
    'SEBI Disclosures',
    'SEBI LODR Regulation 30 Disclosures',
    'Event-based material disclosures filed with BSE under Regulation 30 of the SEBI Listing Obligations and Disclosure Requirements Regulations, 2015.',
  ),
  {
    path: '/sebi-lodr-regulation-46-disclosures',
    slots: [
      ...hero(
        'SEBI Disclosures',
        'SEBI LODR Regulation 46 Disclosures',
        'Statutory disclosures maintained on the company website as required under Regulation 46 of the SEBI Listing Obligations and Disclosure Requirements Regulations, 2015.',
      ),

      /* ── Page chrome ────────────────────────────────────────── */
      { key: 'reg46.intro', label: 'Intro callout', widget: 'textarea', defaultValue: 'Regulation 46 — SEBI LODR, 2015: Listed companies are required to maintain and disseminate certain information on their websites for public access. The following disclosures are maintained in accordance with these requirements. CIN: L24304CH2017PLC041482.', group: 'Intro' },
      { key: 'reg46.na_label', label: 'NA badge label', widget: 'text', defaultValue: 'NA', group: 'Labels' },
      { key: 'reg46.pdf_label', label: 'PDF button label', widget: 'text', defaultValue: 'PDF', group: 'Labels' },
      { key: 'reg46.view_label', label: 'View link label', widget: 'text', defaultValue: 'View', group: 'Labels' },
      { key: 'reg46.soon_label', label: 'Coming-soon label', widget: 'text', defaultValue: 'Soon', group: 'Labels' },
      { key: 'reg46.footnote_prefix', label: 'Footnote (before link)', widget: 'text', defaultValue: 'For event-based disclosures and material information filed with BSE, refer to ', group: 'Footnote' },
      { key: 'reg46.footnote_link', label: 'Footnote link text', widget: 'text', defaultValue: 'SEBI LODR Regulation 30 Disclosures', group: 'Footnote' },
      { key: 'reg46.footnote_middle', label: 'Footnote (between links)', widget: 'text', defaultValue: '. For queries, contact ', group: 'Footnote' },
      { key: 'reg46.footnote_email', label: 'Footnote email', widget: 'text', defaultValue: 'cs@astonea.org', group: 'Footnote' },
      { key: 'reg46.footnote_suffix', label: 'Footnote (trailing punctuation)', widget: 'text', defaultValue: '.', group: 'Footnote' },

      /* ── Section 01 · Corporate Overview ───────────────────── */
      { key: 'reg46.corporate_overview.heading', label: 'Section 1 heading', widget: 'text', defaultValue: 'Corporate Overview', group: 'Section · Corporate Overview' },
      { key: 'reg46.corporate_overview.item_0.title', label: 'Section 1 item 1 title', widget: 'text', defaultValue: 'Details of Business', group: 'Section · Corporate Overview' },
      { key: 'reg46.corporate_overview.item_0.description', label: 'Section 1 item 1 description', widget: 'textarea', defaultValue: "Overview of the Company's business operations, product categories, and service segments.", group: 'Section · Corporate Overview' },
      { key: 'reg46.corporate_overview.item_1.title', label: 'Section 1 item 2 title', widget: 'text', defaultValue: 'Memorandum of Association (MOA)', group: 'Section · Corporate Overview' },
      { key: 'reg46.corporate_overview.item_1.description', label: 'Section 1 item 2 description', widget: 'textarea', defaultValue: 'Memorandum of Association of the Company as filed with the Registrar of Companies.', group: 'Section · Corporate Overview' },
      { key: 'reg46.corporate_overview.item_2.title', label: 'Section 1 item 3 title', widget: 'text', defaultValue: 'Articles of Association (AOA)', group: 'Section · Corporate Overview' },
      { key: 'reg46.corporate_overview.item_2.description', label: 'Section 1 item 3 description', widget: 'textarea', defaultValue: 'Articles of Association of the Company, including the new set adopted at the EGM held on 27th March 2026.', group: 'Section · Corporate Overview' },

      /* ── Section 02 · Board of Directors ───────────────────── */
      { key: 'reg46.board_of_directors.heading', label: 'Section 2 heading', widget: 'text', defaultValue: 'Board of Directors', group: 'Section · Board of Directors' },
      { key: 'reg46.board_of_directors.item_0.title', label: 'Section 2 item 1 title', widget: 'text', defaultValue: 'Profile of Board of Directors', group: 'Section · Board of Directors' },
      { key: 'reg46.board_of_directors.item_0.description', label: 'Section 2 item 1 description', widget: 'textarea', defaultValue: 'Biographical and qualification details of all Directors and Key Managerial Personnel.', group: 'Section · Board of Directors' },
      { key: 'reg46.board_of_directors.item_1.title', label: 'Section 2 item 2 title', widget: 'text', defaultValue: 'Terms & Conditions of Appointment of Independent Directors', group: 'Section · Board of Directors' },
      { key: 'reg46.board_of_directors.item_1.description', label: 'Section 2 item 2 description', widget: 'textarea', defaultValue: 'Formal terms and conditions governing the appointment of Independent Directors of the Company.', group: 'Section · Board of Directors' },

      /* ── Section 03 · Board Committees ──────────────────────── */
      { key: 'reg46.board_committees.heading', label: 'Section 3 heading', widget: 'text', defaultValue: 'Board Committees', group: 'Section · Board Committees' },
      { key: 'reg46.board_committees.item_0.title', label: 'Section 3 item 1 title', widget: 'text', defaultValue: 'Composition of Various Committees of BOD', group: 'Section · Board Committees' },
      { key: 'reg46.board_committees.item_0.description', label: 'Section 3 item 1 description', widget: 'textarea', defaultValue: "Constituted committees of the Board — Audit, Nomination & Remuneration, Stakeholders' Relationship, CSR, and Risk Management.", group: 'Section · Board Committees' },

      /* ── Section 04 · Governance Policies ───────────────────── */
      { key: 'reg46.governance_policies.heading', label: 'Section 4 heading', widget: 'text', defaultValue: 'Corporate Governance Policies and Ethical Frameworks', group: 'Section · Governance Policies' },
      { key: 'reg46.governance_policies.item_0.title', label: 'Section 4 item 1 title', widget: 'text', defaultValue: 'Code of Conduct for Board and Senior Management', group: 'Section · Governance Policies' },
      { key: 'reg46.governance_policies.item_1.title', label: 'Section 4 item 2 title', widget: 'text', defaultValue: 'Familiarisation Programme for Independent Directors', group: 'Section · Governance Policies' },
      { key: 'reg46.governance_policies.item_2.title', label: 'Section 4 item 3 title', widget: 'text', defaultValue: 'Policy on Identification of Group Companies, Material Creditors', group: 'Section · Governance Policies' },
      { key: 'reg46.governance_policies.item_3.title', label: 'Section 4 item 4 title', widget: 'text', defaultValue: 'Policy for Determining Material Subsidiaries', group: 'Section · Governance Policies' },
      { key: 'reg46.governance_policies.item_4.title', label: 'Section 4 item 5 title', widget: 'text', defaultValue: 'Policy on Dealing with Related Party Transactions', group: 'Section · Governance Policies' },
      { key: 'reg46.governance_policies.item_5.title', label: 'Section 4 item 6 title', widget: 'text', defaultValue: 'Archival Policy / Policy for Preservation of Documents', group: 'Section · Governance Policies' },
      { key: 'reg46.governance_policies.item_6.title', label: 'Section 4 item 7 title', widget: 'text', defaultValue: 'Vigil Mechanism Policy / Whistle Blower Policy', group: 'Section · Governance Policies' },
      { key: 'reg46.governance_policies.item_7.title', label: 'Section 4 item 8 title', widget: 'text', defaultValue: 'Annual Performance Evaluation Framework', group: 'Section · Governance Policies' },
      { key: 'reg46.governance_policies.item_8.title', label: 'Section 4 item 9 title', widget: 'text', defaultValue: 'Criteria of Payment to Non-Executive Directors', group: 'Section · Governance Policies' },

      /* ── Section 05 · Investor Relations ────────────────────── */
      { key: 'reg46.investor_relations.heading', label: 'Section 5 heading', widget: 'text', defaultValue: 'Investor Relations', group: 'Section · Investor Relations' },
      { key: 'reg46.investor_relations.item_0.title', label: 'Section 5 item 1 title', widget: 'text', defaultValue: 'Investor Grievances', group: 'Section · Investor Relations' },
      { key: 'reg46.investor_relations.item_0.description', label: 'Section 5 item 1 description', widget: 'textarea', defaultValue: 'For investor grievances and queries, contact the Compliance Officer at cs@astonea.org.', group: 'Section · Investor Relations' },
      { key: 'reg46.investor_relations.item_1.title', label: 'Section 5 item 2 title', widget: 'text', defaultValue: 'Shareholding Pattern', group: 'Section · Investor Relations' },
      { key: 'reg46.investor_relations.item_1.description', label: 'Section 5 item 2 description', widget: 'textarea', defaultValue: 'Quarterly shareholding pattern filed with the stock exchanges.', group: 'Section · Investor Relations' },

      /* ── Section 06 · Financial Information ─────────────────── */
      { key: 'reg46.financial_information.heading', label: 'Section 6 heading', widget: 'text', defaultValue: 'Financial Information', group: 'Section · Financial Information' },
      { key: 'reg46.financial_information.item_0.title', label: 'Section 6 item 1 title', widget: 'text', defaultValue: 'Board Meeting Notices for Financial Results', group: 'Section · Financial Information' },
      { key: 'reg46.financial_information.item_0.description', label: 'Section 6 item 1 description', widget: 'textarea', defaultValue: 'Notices of Board meetings convened for approval of financial results.', group: 'Section · Financial Information' },
      { key: 'reg46.financial_information.item_1.title', label: 'Section 6 item 2 title', widget: 'text', defaultValue: 'Financial Results', group: 'Section · Financial Information' },
      { key: 'reg46.financial_information.item_1.description', label: 'Section 6 item 2 description', widget: 'textarea', defaultValue: 'Quarterly, half-yearly and annual financial results filed with the stock exchanges.', group: 'Section · Financial Information' },
      { key: 'reg46.financial_information.item_2.title', label: 'Section 6 item 3 title', widget: 'text', defaultValue: 'Annual Reports', group: 'Section · Financial Information' },
      { key: 'reg46.financial_information.item_2.description', label: 'Section 6 item 3 description', widget: 'textarea', defaultValue: "Audited annual reports including Director's Report and Corporate Governance Report.", group: 'Section · Financial Information' },
      { key: 'reg46.financial_information.item_3.title', label: 'Section 6 item 4 title', widget: 'text', defaultValue: 'Statement of Deviation', group: 'Section · Financial Information' },
      { key: 'reg46.financial_information.item_3.description', label: 'Section 6 item 4 description', widget: 'textarea', defaultValue: 'Non-applicability of Statement of Deviation or Variation in use of IPO proceeds.', group: 'Section · Financial Information' },
      { key: 'reg46.financial_information.item_4.title', label: 'Section 6 item 5 title', widget: 'text', defaultValue: 'Annual Return (Form MGT-7)', group: 'Section · Financial Information' },
      { key: 'reg46.financial_information.item_4.description', label: 'Section 6 item 5 description', widget: 'textarea', defaultValue: 'Annual returns filed with the Registrar of Companies.', group: 'Section · Financial Information' },

      /* ── Section 07 · Name History ──────────────────────────── */
      { key: 'reg46.name_history.heading', label: 'Section 7 heading', widget: 'text', defaultValue: 'New Name and Old Name of the Company', group: 'Section · Name History' },
      { key: 'reg46.name_history.text', label: 'Section 7 text', widget: 'textarea', defaultValue: 'Astonea Labs Limited was constituted pursuant to the conversion of Astonea Labs Private Limited into a public company, in accordance with the applicable provisions of the Companies Act and as approved vide the order of the Ministry of Corporate Affairs dated 11 January 2024.', group: 'Section · Name History' },

      /* ── Section 08 · Authorised KMPs ──────────────────────── */
      { key: 'reg46.authorised_kmps.heading', label: 'Section 8 heading', widget: 'text', defaultValue: 'Authorised KMPs for Determining Materiality of Events', group: 'Section · Authorised KMPs' },
      { key: 'reg46.authorised_kmps.text', label: 'Section 8 text', widget: 'textarea', defaultValue: 'The following Key Managerial Personnel have been authorised by the Board for determining the materiality of events or information for the purpose of disclosure to the Stock Exchanges under Regulation 30 of the SEBI (LODR) Regulations, 2015:', group: 'Section · Authorised KMPs' },
      { key: 'reg46.authorised_kmps.kmp_0.name', label: 'KMP 1 name', widget: 'text', defaultValue: 'Mr. Sumit Kumar', group: 'Section · Authorised KMPs' },
      { key: 'reg46.authorised_kmps.kmp_0.role', label: 'KMP 1 role', widget: 'text', defaultValue: 'Chief Financial Officer', group: 'Section · Authorised KMPs' },
      { key: 'reg46.authorised_kmps.kmp_0.email', label: 'KMP 1 email', widget: 'text', defaultValue: 'financeastonea@gmail.com', group: 'Section · Authorised KMPs' },

      /* ── Section 09 · Analyst Schedule ─────────────────────── */
      { key: 'reg46.analyst_schedule.heading', label: 'Section 9 heading', widget: 'text', defaultValue: 'Schedule of Analyst or Institutional Investor Meets', group: 'Section · Analyst Schedule' },
      { key: 'reg46.analyst_schedule.text', label: 'Section 9 text', widget: 'textarea', defaultValue: 'No Analyst or Institutional Investor Meeting was held in the Current Financial Year. Any future meetings or presentations made to analysts or institutional investors will be promptly disclosed on the website and to the Stock Exchanges in accordance with SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015.', group: 'Section · Analyst Schedule' },

      /* ── Sections 10–13 · NA sections ──────────────────────── */
      { key: 'reg46.media_agreements.heading', label: 'Section 10 heading', widget: 'text', defaultValue: 'Details of Agreement entered into with the Media Company or their Associates', group: 'Section · Media Agreements (NA)' },
      { key: 'reg46.media_agreements.na_text', label: 'Section 10 NA text', widget: 'textarea', defaultValue: 'Not applicable to the Company.', group: 'Section · Media Agreements (NA)' },
      { key: 'reg46.dividend_policy.heading', label: 'Section 11 heading', widget: 'text', defaultValue: 'Dividend Distribution Policy', group: 'Section · Dividend Policy (NA)' },
      { key: 'reg46.dividend_policy.na_text', label: 'Section 11 NA text', widget: 'textarea', defaultValue: 'Not applicable to the Company.', group: 'Section · Dividend Policy (NA)' },
      { key: 'reg46.subsidiary_financials_audit.heading', label: 'Section 12 heading', widget: 'text', defaultValue: 'Audited Financial Statement of Subsidiaries', group: 'Section · Subsidiary Financials (NA)' },
      { key: 'reg46.subsidiary_financials_audit.na_text', label: 'Section 12 NA text', widget: 'textarea', defaultValue: 'Not applicable to the Company.', group: 'Section · Subsidiary Financials (NA)' },
      { key: 'reg46.secretarial_compliance.heading', label: 'Section 13 heading', widget: 'text', defaultValue: 'Secretarial Compliance Report', group: 'Section · Secretarial Compliance (NA)' },
      { key: 'reg46.secretarial_compliance.na_text', label: 'Section 13 NA text', widget: 'textarea', defaultValue: 'Not applicable to the Company.', group: 'Section · Secretarial Compliance (NA)' },
    ],
  },
  {
    path: '/integrated-filings',
    slots: [
      ...hero(
        'Investor Relations',
        'Integrated Filings',
        'Integrated governance and financial filings of Astonea Labs Limited submitted to BSE under the SEBI integrated filing framework.',
      ),
      { key: 'intfilings.label', label: 'Section label', widget: 'text', defaultValue: 'Categories', group: 'Categories' },
      { key: 'intfilings.heading', label: 'Section heading', widget: 'text', defaultValue: 'Browse integrated filings', group: 'Categories' },
      { key: 'intfilings.view', label: 'Card "view" link label', widget: 'text', defaultValue: 'View →', group: 'Categories' },
      { key: 'intfilings.cat_0.title', label: 'Category 1 title', widget: 'text', defaultValue: 'Integrated Governance', group: 'Categories' },
      { key: 'intfilings.cat_0.desc', label: 'Category 1 description', widget: 'textarea', defaultValue: 'Quarterly integrated governance filings submitted under SEBI integrated filing framework.', group: 'Categories' },
      { key: 'intfilings.cat_1.title', label: 'Category 2 title', widget: 'text', defaultValue: 'Integrated Finance', group: 'Categories' },
      { key: 'intfilings.cat_1.desc', label: 'Category 2 description', widget: 'textarea', defaultValue: 'Half-yearly and yearly integrated financial filings submitted to the stock exchange.', group: 'Categories' },
    ],
  },
  docPage(
    '/integrated-finance',
    'Integrated Filings',
    'Integrated Finance',
    'Half-yearly and yearly integrated financial filings of Astonea Labs Limited submitted to the stock exchange.',
  ),
  docPage(
    '/integrated-governance',
    'Integrated Filings',
    'Integrated Governance',
    'Quarterly integrated governance filings of Astonea Labs Limited submitted under the SEBI integrated filing framework.',
  ),
  docPage(
    '/corporate-documents',
    'Governance',
    'Corporate Documents',
    'Memorandum and Articles of Association and other corporate documents of Astonea Labs Limited.',
  ),
  docPage(
    '/corporate-announcements',
    'Investor Relations',
    'Corporate Announcements',
    'Material events, intimations and corporate announcements filed by Astonea Labs Limited with the exchange.',
  ),
  docPage(
    '/policies',
    'Governance',
    'Policies',
    'Board-approved governance policies of Astonea Labs Limited.',
  ),
  docPage(
    '/codes',
    'Governance',
    'Codes',
    'Codes of conduct governing insider trading, fair disclosure and conduct of Board & Senior Management.',
  ),
  docPage(
    '/frameworks',
    'Governance',
    'Frameworks',
    'Frameworks governing compliance, evaluation and board processes at Astonea Labs Limited.',
  ),
  docPage(
    '/newspaper-publications',
    'Investor Relations',
    'Newspaper Publications',
    'Statutory financial results and notices of Astonea Labs Limited published in approved newspapers.',
  ),
  {
    path: '/public-offering',
    slots: [
      ...hero(
        'Investor Relations',
        'Public Offering',
        'Astonea Labs Limited is a publicly listed company on BSE SME — listed on 3 June 2025 under CIN L24304CH2017PLC041482.',
      ),

      /* ── Listing overview ──────────────────────────────────────── */
      { key: 'po.overview.label', label: 'Overview section label', widget: 'text', defaultValue: 'Listing Overview', group: 'Listing overview' },
      { key: 'po.overview.heading', label: 'Overview heading', widget: 'text', defaultValue: 'BSE-SME on BSE SME since June 2025', group: 'Listing overview' },
      { key: 'po.overview.body_1', label: 'Overview paragraph 1', widget: 'textarea', defaultValue: "Astonea Labs Limited became a publicly listed company in 2025 — the IPO opened on 27 May 2025, closed on 29 May 2025, and equity shares were listed on the BSE SME platform on 3 June 2025. The listing represented a significant milestone in the company's growth journey, enabling access to public capital markets and enhancing governance transparency.", group: 'Listing overview' },
      { key: 'po.overview.body_2', label: 'Overview paragraph 2', widget: 'textarea', defaultValue: 'The company is committed to maintaining full compliance with SEBI Listing Obligations and Disclosure Requirements (LODR) Regulations and all applicable securities laws, ensuring continued protection of shareholder interests.', group: 'Listing overview' },

      /* ── Listing details panel ─────────────────────────────────── */
      { key: 'po.detail_0.label', label: 'Detail 1 label', widget: 'text', defaultValue: 'Company Name', group: 'Listing details' },
      { key: 'po.detail_0.value', label: 'Detail 1 value', widget: 'text', defaultValue: 'Astonea Labs Limited', group: 'Listing details' },
      { key: 'po.detail_1.label', label: 'Detail 2 label', widget: 'text', defaultValue: 'CIN', group: 'Listing details' },
      { key: 'po.detail_1.value', label: 'Detail 2 value', widget: 'text', defaultValue: 'L24304CH2017PLC041482', group: 'Listing details' },
      { key: 'po.detail_2.label', label: 'Detail 3 label', widget: 'text', defaultValue: 'Listed On', group: 'Listing details' },
      { key: 'po.detail_2.value', label: 'Detail 3 value', widget: 'text', defaultValue: 'BSE SME (Bombay Stock Exchange)', group: 'Listing details' },
      { key: 'po.detail_3.label', label: 'Detail 4 label', widget: 'text', defaultValue: 'Date of Listing', group: 'Listing details' },
      { key: 'po.detail_3.value', label: 'Detail 4 value', widget: 'text', defaultValue: '3 June 2025', group: 'Listing details' },
      { key: 'po.detail_4.label', label: 'Detail 5 label', widget: 'text', defaultValue: 'Sector', group: 'Listing details' },
      { key: 'po.detail_4.value', label: 'Detail 5 value', widget: 'text', defaultValue: 'Pharmaceuticals & Cosmetics Manufacturing', group: 'Listing details' },
      { key: 'po.detail_5.label', label: 'Detail 6 label', widget: 'text', defaultValue: 'Registered Office', group: 'Listing details' },
      { key: 'po.detail_5.value', label: 'Detail 6 value', widget: 'textarea', defaultValue: 'SCO 321-322, Basement, Sector 35B, Chandigarh — 160022', group: 'Listing details' },
      { key: 'po.detail_6.label', label: 'Detail 7 label', widget: 'text', defaultValue: 'Compliance Officer', group: 'Listing details' },
      { key: 'po.detail_6.value', label: 'Detail 7 value', widget: 'text', defaultValue: 'Mr. Ankit Kapoor, Company Secretary', group: 'Listing details' },
      { key: 'po.detail_7.label', label: 'Detail 8 label', widget: 'text', defaultValue: 'Investor Contact', group: 'Listing details' },
      { key: 'po.detail_7.value', label: 'Detail 8 value', widget: 'text', defaultValue: 'cs@astonea.org', group: 'Listing details' },

      /* ── Documents section ─────────────────────────────────────── */
      { key: 'po.docs.label', label: 'Documents section label', widget: 'text', defaultValue: 'Offering Documents', group: 'Documents' },
      { key: 'po.docs.heading', label: 'Documents heading', widget: 'text', defaultValue: 'IPO & listing documents', group: 'Documents' },
      { key: 'po.doc_0.title', label: 'Document 1 title', widget: 'text', defaultValue: 'Prospectus', group: 'Documents' },
      { key: 'po.doc_0.desc', label: 'Document 1 description', widget: 'textarea', defaultValue: 'Final Prospectus dated May 30, 2025 — the definitive offer document for the IPO.', group: 'Documents' },
      { key: 'po.doc_1.title', label: 'Document 2 title', widget: 'text', defaultValue: 'DRHP', group: 'Documents' },
      { key: 'po.doc_1.desc', label: 'Document 2 description', widget: 'textarea', defaultValue: 'Draft Red Herring Prospectus dated August 16, 2024 filed with SEBI prior to the IPO.', group: 'Documents' },
      { key: 'po.doc_2.title', label: 'Document 3 title', widget: 'text', defaultValue: 'RHP', group: 'Documents' },
      { key: 'po.doc_2.desc', label: 'Document 3 description', widget: 'textarea', defaultValue: 'Red Herring Prospectus dated May 15, 2025 filed with the Registrar of Companies.', group: 'Documents' },
      { key: 'po.pdf_label', label: 'PDF link label', widget: 'text', defaultValue: 'PDF', group: 'Documents' },
      { key: 'po.soon_label', label: 'Coming-soon label', widget: 'text', defaultValue: 'Soon', group: 'Documents' },

      /* ── Footer prose ──────────────────────────────────────────── */
      { key: 'po.footer.before_email', label: 'Footer — before email', widget: 'text', defaultValue: 'For IPO-related queries, contact the Company Secretary at ', group: 'Footer' },
      { key: 'po.footer.between_email_reg46', label: 'Footer — between email and Reg. 46 link', widget: 'text', defaultValue: '. For ongoing disclosures, refer to ', group: 'Footer' },
      { key: 'po.footer.reg46_link', label: 'Footer — Reg. 46 link text', widget: 'text', defaultValue: 'SEBI Reg. 46', group: 'Footer' },
      { key: 'po.footer.between_reg46_reg30', label: 'Footer — between Reg. 46 and Reg. 30 links', widget: 'text', defaultValue: ' and ', group: 'Footer' },
      { key: 'po.footer.reg30_link', label: 'Footer — Reg. 30 link text', widget: 'text', defaultValue: 'SEBI Reg. 30', group: 'Footer' },
      { key: 'po.footer.after_reg30', label: 'Footer — trailing text', widget: 'text', defaultValue: ' disclosure pages.', group: 'Footer' },

      /* ── Breadcrumb ─────────────────────────────────────────────── */
      { key: 'po.crumb.investors', label: 'Breadcrumb — Investors', widget: 'text', defaultValue: 'Investors', group: 'Breadcrumb' },
      { key: 'po.crumb.self', label: 'Breadcrumb — Public Offering', widget: 'text', defaultValue: 'Public Offering', group: 'Breadcrumb' },
    ],
  },
  {
    path: '/agm',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Meetings' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Annual General Meetings (AGM)' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Notices, corrigenda, proceedings and scrutinizer reports of Annual General Meetings of Astonea Labs Limited.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No AGM documents have been published yet.' },
    ],
  },
  {
    path: '/annual-reports',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Investor Relations' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Annual Reports' },
      { key: 'doc.archive.eyebrow', label: 'doc.archive.eyebrow', widget: 'text', defaultValue: 'Reports Archive' },
      { key: 'doc.archive.heading', label: 'doc.archive.heading', widget: 'text', defaultValue: 'Annual reports for every financial year' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No annual reports have been published yet.' },
      { key: 'doc.disclaimer', label: 'doc.disclaimer', widget: 'textarea', defaultValue: 'Annual Reports are filed with BSE in accordance with SEBI LODR Regulations. CIN: L24304CH2017PLC041482 — Astonea Labs Limited, Chandigarh, India. For the most current filings, refer to the exchange portals or contact cs@astonea.org.' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Astonea Labs Limited\'s complete annual reports — financial statements, governance, and corporate disclosures.' },
    ],
  },
  {
    path: '/board-meetings',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Meetings' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Board Meetings' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Intimations and outcomes of meetings of the Board of Directors of Astonea Labs Limited.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No board meeting documents have been published yet.' },
    ],
  },
  {
    path: '/codes',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Governance' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Codes' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Codes of conduct governing insider trading, fair disclosure and conduct of Board & Senior Management.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No codes have been published yet.' },
    ],
  },
  {
    path: '/corporate-announcements',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Investor Relations' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Corporate Announcements' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Material events, intimations and corporate announcements filed by Astonea Labs Limited with the exchange.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No corporate announcements have been published yet.' },
    ],
  },
  {
    path: '/corporate-documents',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Governance' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Corporate Documents' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Memorandum and Articles of Association and other corporate documents of Astonea Labs Limited.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No corporate documents have been published yet.' },
    ],
  },
  {
    path: '/egm',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Meetings' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Extra-Ordinary General Meetings (EGM)' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Notices, proceedings and scrutinizer reports of Extra-Ordinary General Meetings of Astonea Labs Limited.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No EGM documents have been published yet.' },
    ],
  },
  {
    path: '/financial-results',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Investor Relations' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Financial Results' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No financial results have been published yet.' },
      { key: 'doc.disclaimer', label: 'doc.disclaimer', widget: 'textarea', defaultValue: 'The financial results listed above are submitted to BSE as per SEBI LODR Regulations. For the latest filings, please also refer to the BSE India portal using CIN L24304CH2017PLC041482.' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Astonea Labs Limited\'s audited annual financial statements, half-yearly results and restated financial statements.' },
    ],
  },
  {
    path: '/frameworks',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Governance' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Frameworks' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Frameworks governing compliance, evaluation and board processes at Astonea Labs Limited.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No frameworks have been published yet.' },
    ],
  },
  {
    path: '/integrated-finance',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Integrated Filings' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Integrated Finance' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Half-yearly and yearly integrated financial filings of Astonea Labs Limited submitted to the stock exchange.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No integrated finance filings have been published yet.' },
    ],
  },
  {
    path: '/integrated-governance',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Integrated Filings' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Integrated Governance' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Quarterly integrated governance filings of Astonea Labs Limited submitted under the SEBI integrated filing framework.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No integrated governance filings have been published yet.' },
    ],
  },
  {
    path: '/newspaper-publications',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Investor Relations' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Newspaper Publications' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Statutory financial results and notices of Astonea Labs Limited published in approved newspapers.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No newspaper publications have been published yet.' },
    ],
  },
  {
    path: '/policies',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Governance' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Policies' },
      { key: 'header.description', label: 'header.description', widget: 'text', defaultValue: 'Board-approved governance policies of Astonea Labs Limited.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No policies have been published yet.' },
    ],
  },
  {
    path: '/related-party-transactions',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Investor Relations' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Related Party Transactions' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Half-yearly and yearly disclosures of related party transactions of Astonea Labs Limited filed under Regulation 23 of SEBI LODR.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No related party transaction disclosures have been published yet.' },
    ],
  },
  {
    path: '/sebi-lodr-regulation-30-disclosures',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'SEBI Disclosures' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'SEBI LODR Regulation 30 Disclosures' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Event-based material disclosures filed with BSE under Regulation 30 of the SEBI Listing Obligations and Disclosure Requirements Regulations, 2015.' },
      { key: 'reg30.intro', label: 'reg30.intro', widget: 'textarea', defaultValue: 'Regulation 30 — SEBI LODR, 2015: All listed companies must promptly disclose material events and information to the stock exchanges. The following disclosures have been filed with BSE by Astonea Labs Limited (CIN: L24304CH2017PLC041482).' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No Regulation 30 disclosures have been published yet.' },
    ],
  },
  {
    path: '/shareholding-pattern',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Investor Relations' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Shareholding Pattern' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Half-yearly shareholding pattern filings submitted by Astonea Labs Limited under Regulation 31 of SEBI LODR.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No shareholding pattern filings have been published yet.' },
    ],
  },
  {
    path: '/trading-window-closure',
    slots: [
      { key: 'header.eyebrow', label: 'header.eyebrow', widget: 'text', defaultValue: 'Investor Relations' },
      { key: 'header.title', label: 'header.title', widget: 'text', defaultValue: 'Trading Window Closure' },
      { key: 'header.description', label: 'header.description', widget: 'textarea', defaultValue: 'Intimations of trading window closure of Astonea Labs Limited under SEBI (Prohibition of Insider Trading) Regulations, 2015.' },
      { key: 'doc.empty', label: 'doc.empty', widget: 'text', defaultValue: 'No trading window closure intimations have been published yet.' },
    ],
  },
]

const BY_PATH: Record<string, PageDefaults> = Object.fromEntries(
  REGISTRY.map((p) => [p.path, p]),
)

export function getPageDefaults(path: string): PageDefaults | null {
  return BY_PATH[path] ?? null
}

/**
 * Read-only view of the full registry. Used by the admin "Generate
 * translations" flow to walk every page-scoped slot and queue its
 * `defaultValue` for translation into `page_text_overrides`.
 */
export function getAllPageDefaults(): readonly PageDefaults[] {
  return REGISTRY
}

/**
 * Convenience for pages: returns just the default-value map keyed by slot key.
 * Pages call this once at the top of their JSX and pass the map (plus the
 * usePageText hook output) wherever they used to hardcode text.
 *
 *   const d = getPageDefaultsMap('/about-us')
 *   const t = usePageText()
 *   <h2>{t('about.who_we_are.heading', d['about.who_we_are.heading'])}</h2>
 */
export function getPageDefaultsMap(path: string): Record<string, string> {
  const p = BY_PATH[path]
  if (!p) return {}
  const out: Record<string, string> = {}
  for (const s of p.slots) out[s.key] = s.defaultValue
  return out
}
