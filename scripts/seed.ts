/**
 * Seed Neon Postgres with the existing hardcoded CMS data.
 *
 * Run with: `npm run seed`
 *
 * The script is idempotent:
 *   - Admin user is upserted by email.
 *   - Group companies are upserted by slug.
 *   - Documents are upserted by (category, title) — re-running won't dupe rows.
 *
 * Requires DATABASE_URL in .env.local. If ADMIN_EMAIL + ADMIN_PASSWORD are
 * set, the first admin is created/refreshed automatically.
 */
import { and, eq, isNull, type SQL } from 'drizzle-orm'
import { db } from '../lib/db'
import { documents, groupCompanies, users, type NewDocument } from '../lib/db/schema'
import { hashPassword } from '../lib/auth/password'

/* ─── Admin bootstrap ────────────────────────────────────────────────────── */

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME ?? null

  if (!email || !password) {
    console.log('[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin bootstrap')
    return
  }

  const existing = (await db.select().from(users).where(eq(users.email, email)).limit(1))[0]
  const passwordHash = await hashPassword(password)

  if (existing) {
    await db.update(users).set({ passwordHash, name, updatedAt: new Date() }).where(eq(users.id, existing.id))
    console.log(`[seed] admin updated: ${email}`)
  } else {
    await db.insert(users).values({ email, passwordHash, name })
    console.log(`[seed] admin created: ${email}`)
  }
}

/* ─── Group companies ────────────────────────────────────────────────────── */

const GROUP_COMPANIES = [
  {
    slug: 'astonea-labs',
    name: 'Astonea Labs Limited',
    entityType: 'parent' as const,
    cin: 'L24304CH2017PLC041482',
    description:
      'The BSE-SME parent entity and primary operating company — a pharmaceutical and cosmetic manufacturer headquartered in Chandigarh, India.',
  },
  {
    slug: 'ascot-biolabs',
    name: 'Ascot Biolabs Private Limited',
    entityType: 'subsidiary' as const,
    description:
      'Part of the Astonea group structure, operating within the pharmaceutical and biological sciences segment.',
  },
  {
    slug: 'shinto-organics',
    name: 'Shinto Organics Private Limited',
    entityType: 'subsidiary' as const,
    description:
      'An operational entity within the group with activities in organics and chemical-related manufacturing.',
  },
  {
    slug: 'astonea-one',
    name: 'Astonea One Private Limited',
    entityType: 'subsidiary' as const,
    description:
      'A group company contributing to the diversified operational structure of the Astonea corporate family.',
  },
  {
    slug: 'astonea-limited',
    name: 'Astonea Limited',
    entityType: 'associate' as const,
    description: 'A related company within the broader Astonea group ecosystem.',
  },
  {
    slug: 'chemist-india',
    name: 'Chemist India Limited',
    entityType: 'subsidiary' as const,
    description:
      'Part of the corporate structure, engaged in pharmaceutical and chemical sector operations.',
  },
  {
    slug: 'astonea-foundation',
    name: 'Astonea Foundation',
    entityType: 'nonprofit' as const,
    description:
      'The corporate social responsibility arm of the Astonea group — supporting ecological preservation, social empowerment, and community advancement.',
  },
]

async function seedGroupCompanies() {
  const slugToId = new Map<string, string>()
  for (let i = 0; i < GROUP_COMPANIES.length; i++) {
    const c = GROUP_COMPANIES[i]
    const existing = (
      await db.select().from(groupCompanies).where(eq(groupCompanies.slug, c.slug)).limit(1)
    )[0]
    if (existing) {
      await db
        .update(groupCompanies)
        .set({
          name: c.name,
          description: c.description,
          entityType: c.entityType,
          cin: c.cin ?? null,
          displayOrder: i,
          updatedAt: new Date(),
        })
        .where(eq(groupCompanies.id, existing.id))
      slugToId.set(c.slug, existing.id)
    } else {
      const inserted = await db
        .insert(groupCompanies)
        .values({
          slug: c.slug,
          name: c.name,
          description: c.description,
          entityType: c.entityType,
          cin: c.cin ?? null,
          displayOrder: i,
        })
        .returning({ id: groupCompanies.id })
      slugToId.set(c.slug, inserted[0].id)
    }
  }
  console.log(`[seed] group companies: ${slugToId.size}`)
  return slugToId
}

/* ─── Documents ──────────────────────────────────────────────────────────── */

type SeedDoc = Omit<NewDocument, 'displayOrder'>

const annualReports: SeedDoc[] = [
  { category: 'annual_report', title: 'Annual Report FY 2024–2025', period: 'FY 2024–25', description: 'Consolidated annual report including audited financials, board report, and corporate governance disclosures for FY 2024-25.', fileUrl: '/pdf/Annual Report for the FY 2024-25.pdf' },
  { category: 'annual_report', title: 'Annual Report FY 2023–2024', period: 'FY 2023–24', description: 'Full-year annual report covering financial performance, CSR activities, and regulatory disclosures for FY 2023-24.', fileUrl: '/pdf/Annual Report FY 2023-24.pdf' },
  { category: 'annual_report', title: 'Annual Report FY 2022–2023', period: 'FY 2022–23', description: 'Annual report with audited financial statements, director\'s report, and shareholder information for FY 2022-23.', fileUrl: '/pdf/Annual Report FY 2022-23.pdf' },
  { category: 'annual_report', title: 'Annual Report FY 2021–2022', period: 'FY 2021–22', description: 'Annual report covering the company\'s first full year as a listed entity on BSE.', fileUrl: '/pdf/Annual Report FY 2021-22.pdf' },
  { category: 'annual_report', title: 'Annual Report FY 2020–2021', period: 'FY 2020–21', description: 'Annual report for FY 2020-21 with audited standalone financial statements and governance disclosures.', fileUrl: '/pdf/Annual Report FY 2020-21.pdf' },
  { category: 'annual_report', title: 'Annual Report FY 2019–2020', period: 'FY 2019–20', description: 'Annual report for FY 2019-20 with audited standalone financial statements and governance disclosures.', fileUrl: '/pdf/Annual Report FY 2019-20.pdf' },
]

const financialResults: SeedDoc[] = [
  // annual
  { category: 'financial_result', subcategory: 'annual', period: 'FY 2024–2025', title: 'Annual Financial Statements', fileUrl: '/pdf/Financial Statements FY 2024-25.pdf' },
  { category: 'financial_result', subcategory: 'annual', period: 'FY 2023–2024', title: 'Annual Financial Statements', fileUrl: '/pdf/Financial Statements FY 2023-24.pdf' },
  { category: 'financial_result', subcategory: 'annual', period: 'FY 2022–2023', title: 'Annual Financial Statements', fileUrl: '/pdf/Annual Report FY 2022-23.pdf' },
  { category: 'financial_result', subcategory: 'annual', period: 'FY 2021–2022', title: 'Annual Financial Statements', fileUrl: '/pdf/Annual Report FY 2021-22.pdf' },
  { category: 'financial_result', subcategory: 'annual', period: 'FY 2020–2021', title: 'Annual Financial Statements', fileUrl: '/pdf/Annual Report FY 2020-21.pdf' },
  // interim & restated
  { category: 'financial_result', subcategory: 'half_yearly', period: 'Half-Yearly — Sep 2025', title: 'Unaudited Financial Results for H1 FY2025-26', fileUrl: '/pdf/financialresults-Half Yearly Result- 30.09.2025.pdf' },
  { category: 'financial_result', subcategory: 'restated', period: 'Restated — Dec 31, 2024', title: 'Restated Financial Statements as at Dec 31, 2024' },
  { category: 'financial_result', subcategory: 'restated', period: 'Restated — Mar 31, 2024', title: 'Restated Financial Statements as at Mar 31, 2024' },
  // mgt7
  { category: 'financial_result', subcategory: 'mgt7', period: 'FY 2024–2025', title: 'Annual Return — Form MGT-7', fileUrl: '/pdf/Form MGT-7 2024-25.pdf' },
  { category: 'financial_result', subcategory: 'mgt7', period: 'FY 2023–2024', title: 'Annual Return — Form MGT-7', fileUrl: '/pdf/Form MGT 7 23-24.pdf' },
  { category: 'financial_result', subcategory: 'mgt7', period: 'FY 2022–2023', title: 'Annual Return — Form MGT-7', fileUrl: '/pdf/Form MGT 7 22-23.pdf' },
  { category: 'financial_result', subcategory: 'mgt7', period: 'FY 2021–2022', title: 'Annual Return — Form MGT-7A', fileUrl: '/pdf/Form MGT 7A 21-22.pdf' },
  { category: 'financial_result', subcategory: 'mgt7', period: 'FY 2020–2021', title: 'Annual Return — Form MGT-7', fileUrl: '/pdf/Form MGT 7 20-21.pdf' },
  { category: 'financial_result', subcategory: 'mgt7', period: 'FY 2019–2020', title: 'Annual Return — Form MGT-7', fileUrl: '/pdf/Form MGT 7 19-20.pdf' },
  // board notices
  { category: 'financial_result', subcategory: 'board_notice', period: '6 Nov 2025', title: 'Board Meeting Notice — 6th November 2025', fileUrl: '/pdf/board-meeting-ntc-06th Nov, 2025.pdf' },
  { category: 'financial_result', subcategory: 'board_notice', period: '4 Jul 2025', title: 'Board Meeting Notice — 4th July 2025', fileUrl: '/pdf/board-meeting-ntc-04th July, 2025.pdf' },
  // deviation
  { category: 'financial_result', subcategory: 'deviation', period: 'H1 FY 2025–26 (Sep 30, 2025)', title: 'Non-Applicability of Statement of Deviation or Variation', fileUrl: '/pdf/Non- Applicability of Statement of Variation or Deviation.pdf' },
]

const policiesCodesFrameworks: SeedDoc[] = [
  // policies
  { category: 'policy_code_framework', subcategory: 'policy', title: 'Code of Conduct for Board & Senior Management', description: 'Code of conduct applicable to all Directors, Key Managerial Personnel, and Senior Management personnel of the Company.', fileUrl: '/pdf/16. Code of Conduct for Board and SMP (2).pdf' },
  { category: 'policy_code_framework', subcategory: 'policy', title: 'Whistle Blower Policy / Vigil Mechanism', description: 'Policy enabling directors and employees to report genuine concerns without fear of victimization, in accordance with the Companies Act, 2013.', fileUrl: '/pdf/Vigil Mechanism Policy.pdf' },
  { category: 'policy_code_framework', subcategory: 'policy', title: 'Nomination & Remuneration Policy', description: 'Policy governing the criteria for appointment and remuneration of directors, key managerial personnel, and senior management.' },
  { category: 'policy_code_framework', subcategory: 'policy', title: 'Related Party Transaction Policy', description: 'Policy for identification, approval, and monitoring of Related Party Transactions ensuring arm\'s length basis and appropriate disclosure.' },
  { category: 'policy_code_framework', subcategory: 'policy', title: 'Risk Management Policy', description: 'Framework for identification, assessment, monitoring, and mitigation of business risks including financial, operational, and compliance risks.' },
  { category: 'policy_code_framework', subcategory: 'policy', title: 'CSR Policy', description: 'Corporate Social Responsibility policy outlining focus areas, governance, and spending norms in accordance with the Companies Act, 2013.', fileUrl: '/pdf/CSR Policy.pdf' },
  { category: 'policy_code_framework', subcategory: 'policy', title: 'Material Subsidiary Policy', description: 'Policy determining criteria for identifying material subsidiaries and governance obligations with respect to such entities.' },
  { category: 'policy_code_framework', subcategory: 'policy', title: 'Insider Trading Code (PIT)', description: 'Code of practices and procedures for fair disclosure of unpublished price-sensitive information under SEBI (Prohibition of Insider Trading) Regulations, 2015.', fileUrl: '/pdf/Code of Conduct -PIT.pdf' },
  { category: 'policy_code_framework', subcategory: 'policy', title: 'Dividend Distribution Policy', description: 'Policy governing the factors and parameters for declaration of dividend, balancing shareholder returns and company growth needs.' },
  { category: 'policy_code_framework', subcategory: 'policy', title: 'Archival Policy', description: 'Policy governing the retention and archival of documents and records in compliance with applicable laws and regulations.', fileUrl: '/pdf/15. Archival Policy.pdf' },
  { category: 'policy_code_framework', subcategory: 'policy', title: 'Policy for Determination of Legitimate Purpose', description: 'Framework for determining what constitutes a legitimate purpose for sharing Unpublished Price Sensitive Information (UPSI) under SEBI PIT Regulations.', fileUrl: '/pdf/Policy for legitimate purpose1.pdf' },
  // codes
  { category: 'policy_code_framework', subcategory: 'code', title: 'Code of Conduct for Board & Senior Management (Board Code)', description: 'Board-adopted code of conduct applicable to all Directors and Senior Management of the Company.', fileUrl: '/pdf/16. Code of Conduct for Board and SMP (2).pdf' },
  { category: 'policy_code_framework', subcategory: 'code', title: 'Insider Trading Code (PIT Code)', description: 'Code under Regulation 9(1) of SEBI (Prohibition of Insider Trading) Regulations, 2015 for prevention of insider trading.', fileUrl: '/pdf/Code of Conduct -PIT.pdf' },
  { category: 'policy_code_framework', subcategory: 'code', title: 'Code of Practices & Procedures for Fair Disclosure of UPSI', description: 'Code under Regulation 8 of SEBI (PIT) Regulations, 2015 ensuring timely, uniform, and fair disclosure of unpublished price-sensitive information.', fileUrl: '/pdf/Code of Practices and Procedures for Fair Disclosures 1.pdf' },
  // frameworks
  { category: 'policy_code_framework', subcategory: 'framework', title: 'Annual Performance Evaluation Framework', description: 'Framework for annual evaluation of the performance of the Board of Directors, its Committees, Independent Directors, and Key Managerial Personnel.', fileUrl: '/pdf/Annual Performance Evaluation Framework.pdf' },
  { category: 'policy_code_framework', subcategory: 'framework', title: 'Board Evaluation Process Document', description: 'Detailed process document governing how the Board conducts its annual self-evaluation in line with SEBI LODR and Companies Act requirements.', fileUrl: '/pdf/Board Evaluation Process Document.pdf' },
  { category: 'policy_code_framework', subcategory: 'framework', title: 'Terms & Conditions — Appointment of Independent Directors', description: 'Formal terms and conditions of appointment applicable to all Independent Directors of the Company, including role, duties, and remuneration framework.', fileUrl: '/pdf/T&C- Appointment of Independent Directors.pdf' },
  { category: 'policy_code_framework', subcategory: 'framework', title: 'SEBI LODR Compliance Framework', description: 'Compliance framework under SEBI Listing Obligations and Disclosure Requirements Regulations 2015, governing continuing disclosure obligations.' },
  { category: 'policy_code_framework', subcategory: 'framework', title: 'Companies Act 2013 Compliance Framework', description: 'Governance framework aligned with the Companies Act 2013 and the Rules framed thereunder, including board governance and secretarial compliance.' },
]

// helper: parse "27 Feb 2026" → ISO date string
function parseEventDate(s: string): string | undefined {
  const m = s.match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})$/)
  if (!m) return undefined
  const months: Record<string, string> = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
  const day = m[1].padStart(2, '0')
  const month = months[m[2]]
  if (!month) return undefined
  return `${m[3]}-${month}-${day}`
}

const reg30Raw = [
  {
    sub: 'board_meeting',
    items: [
      { title: 'Outcome of Board Meeting — 27th February 2026', date: '27 Feb 2026', desc: 'Board approved variation in the objects of the IPO for deployment towards acquisition of equity stake in Damaira Pharmaceuticals.', href: '/pdf/outcome 27th Feb 2026.pdf' },
      { title: 'Outcome of Board Meeting — 6th February 2026', date: '06 Feb 2026', desc: 'Board approved acquisition/purchase of immovable property (land) at Village Haripur, Panchkula for expansion of manufacturing facility.', href: '/pdf/Board Meeting -Outcome 6feb2026.pdf' },
      { title: 'Outcome of Board Meeting — 3rd December 2025', date: '03 Dec 2025', desc: 'Board approved appointment of Mr. Ankit Kapoor as Company Secretary and Compliance Officer.', href: '/pdf/Appointment of Company Secretary- Dec 25.pdf' },
      { title: 'Outcome of Board Meeting — 10th November 2025', date: '10 Nov 2025', desc: 'Board approved appointment of Additional Director and other matters.', href: '/pdf/Change in Management- Nov 25.pdf' },
      { title: 'Outcome of Board Meeting — 20th September 2025', date: '20 Sep 2025', desc: 'Board approved resignation of Company Secretary and re-appointment of Cost Auditors for FY 2025-26.', href: '/pdf/20th Sep, 2025.pdf' },
      { title: 'Outcome of Board Meeting — 1st September 2025', date: '01 Sep 2025', desc: 'Board approved appointment of new Company Secretary.', href: '/pdf/Appointment of Company Secretary- Sep 25.pdf' },
      { title: 'Outcome of Board Meeting — 11th July 2025', date: '11 Jul 2025', desc: 'Board meeting outcome including RTA change and other matters.', href: '/pdf/11th July, 2025.pdf' },
    ],
  },
  {
    sub: 'agm_egm',
    items: [
      { title: 'Proceedings of EGM — 27th March 2026', date: '27 Mar 2026', desc: 'Shareholders approved variation in IPO objects and adoption of new Articles of Association at the Extraordinary General Meeting.', href: '/pdf/EGM Proceedings-27.03.2026.pdf' },
      { title: 'Proceedings of 8th AGM — 27th December 2025', date: '27 Dec 2025', desc: '8th Annual General Meeting proceedings including regularisation of directors and approval of equity acquisition in Damaira Pharmaceuticals.', href: '/pdf/Proceedings of AGM 27 Dec 2025.pdf' },
      { title: 'AGM Extension — Approval by ROC', date: '11 Sep 2025', desc: 'ROC, Punjab & Chandigarh granted 3-month extension to hold the 8th Annual General Meeting.', href: '/pdf/AGM Extension (Approved).pdf' },
      { title: 'AGM Extension — Intimation to Apply', date: '26 Aug 2025', desc: 'Intimation to BSE regarding application for extension of AGM due date under Section 96 of the Companies Act, 2013.', href: '/pdf/AGM Extension.pdf' },
    ],
  },
  {
    sub: 'director_kmp',
    items: [
      { title: 'Regularisation of Directors (AGM)', date: '27 Dec 2025', desc: 'Regularisation of directors at the 8th Annual General Meeting.', href: '/pdf/Change in Management- Dec 25.pdf' },
      { title: 'Appointment of CS — Mr. Ankit Kapoor', date: '03 Dec 2025', desc: 'Appointment of Mr. Ankit Kapoor as Company Secretary and Compliance Officer w.e.f. 03.12.2025.', href: '/pdf/Appointment of Company Secretary- Dec 25.pdf' },
      { title: 'Appointment of Additional Director', date: '10 Nov 2025', desc: 'Appointment of Additional Director on the Board of the Company.', href: '/pdf/Change in Management- Nov 25.pdf' },
      { title: 'Resignation of CS — Mr. Vijay Kumar', date: '20 Sep 2025', desc: 'Resignation of Mr. Vijay Kumar as Company Secretary, KMP and Compliance Officer w.e.f. 20.09.2025.', href: '/pdf/Resignation of Company Secretary- Sep 25.pdf' },
      { title: 'Appointment of CS — September 2025', date: '01 Sep 2025', desc: 'Appointment of new Company Secretary at Board meeting held on 1st September 2025.', href: '/pdf/Appointment of Company Secretary- Sep 25.pdf' },
      { title: 'Resignation of CS — Ms. Avneet Kaur', date: '10 Jun 2025', desc: 'Resignation of Ms. Avneet Kaur as Company Secretary, KMP and Compliance Officer.', href: '/pdf/Resignation of Company Secretary- June 25.pdf' },
    ],
  },
  {
    sub: 'structural',
    items: [
      { title: 'Adoption of New Articles of Association', date: '27 Mar 2026', desc: 'Shareholders approved adoption of a new set of Articles of Association at the EGM held on 27th March 2026.', href: '/pdf/AOA Adoption approved.pdf' },
      { title: 'Incorporation of WOS — Astonea LLC (USA)', date: '26 Jan 2026', desc: 'Astonea Labs Limited incorporated a wholly-owned foreign subsidiary, Astonea LLC, in Sheridan, Wyoming, USA.', href: '/pdf/Incorporation of WOS- USA.pdf' },
    ],
  },
  {
    sub: 'ipo_acquisition',
    items: [
      { title: 'Acquisition of Equity Stake — Damaira Pharmaceuticals', date: '31 Mar 2026', desc: 'Astonea Labs acquired approximately 25.74% equity stake in Damaira Pharmaceuticals Private Limited for INR 6.25 Crores.', href: '/pdf/Acquisition.pdf' },
      { title: 'Approval of Variation in IPO Objects', date: '27 Mar 2026', desc: 'Members approved variation in the objects of the IPO at the EGM, enabling revised utilisation of unutilised IPO proceeds.', href: '/pdf/Variation Approval.pdf' },
    ],
  },
  {
    sub: 'property_ops',
    items: [
      { title: 'Fire Incident — Haripur Manufacturing Facility', date: '27 Apr 2026', desc: 'Intimation under Reg 30 regarding inadvertent fire incident at the manufacturing facility at Village Haripur, Panchkula. No human injury reported; production temporarily suspended.', href: '/pdf/Intimation under Reg 30- Fire Incident.pdf' },
      { title: 'Acquisition of Immovable Property — Land', date: '13 Feb 2026', desc: 'Execution and registration of Sale Deed for acquisition of land at Village Haripur, Tehsil Raipur Rani, Panchkula for expansion of manufacturing facility.', href: '/pdf/Reg 30- Intimation- Acquisition of Land.pdf' },
    ],
  },
] as const

const reg30: SeedDoc[] = reg30Raw.flatMap((cat) =>
  cat.items.map((it) => ({
    category: 'reg30' as const,
    subcategory: cat.sub,
    title: it.title,
    description: it.desc,
    fileUrl: it.href,
    period: it.date,
    eventDate: parseEventDate(it.date) ?? null,
  })),
)

const reg46Raw = [
  {
    sub: 'corporate_details',
    items: [
      { title: 'Memorandum of Association', desc: 'Memorandum of Association of the Company as filed with the Registrar of Companies.', href: '/pdf/MOA ALL.pdf' },
      { title: 'Articles of Association', desc: 'Articles of Association of the Company including the new set adopted at EGM on 27th March 2026.', href: '/pdf/AOA FNL.pdf' },
      { title: 'Details of Business', desc: 'Overview of the company\'s business operations, product categories, and service segments.' },
      { title: 'Financial Information', desc: 'Audited financial statements and notes — refer to Financial Results and Annual Reports pages.', externalLink: '/financial-results' },
    ],
  },
  {
    sub: 'board_governance',
    items: [
      { title: 'Shareholding Pattern', desc: 'Quarterly shareholding pattern filed with stock exchanges — quarter ended September 30, 2025.', href: '/pdf/Shareholding Pattern (1).pdf' },
      { title: 'Profiles of Board of Directors & KMPs', desc: 'Biographical and qualification details of all directors and key managerial personnel — refer to Board of Directors page.', externalLink: '/board-of-directors' },
      { title: 'Code of Conduct for Board & Senior Management', desc: 'The Board-adopted code of conduct for directors and senior management personnel.', href: '/pdf/16. Code of Conduct for Board and SMP (2).pdf' },
      { title: 'Terms & Conditions — Appointment of Independent Directors', desc: 'Formal terms and conditions governing the appointment of Independent Directors of the Company.', href: '/pdf/T&C- Appointment of Independent Directors.pdf' },
    ],
  },
  {
    sub: 'committees',
    items: [
      { title: 'Composition of Board Committees', desc: 'Constituted committees of the Board: Audit, NRC, Stakeholders\' Relationship, CSR, and Risk Management.', href: '/pdf/14. Composition of Committees.pdf' },
      { title: 'Terms of Reference', desc: 'Scope, roles, and responsibilities of each Board committee as per the Companies Act and SEBI regulations.' },
    ],
  },
  {
    sub: 'investor_info',
    items: [
      { title: 'Dividend Distribution Policy', desc: 'Policy governing the framework and parameters for dividend declaration.' },
      { title: 'Policy on Related Party Transactions', desc: 'Policy and procedures for identification and approval of transactions with related parties.' },
      { title: 'Whistle Blower / Vigil Mechanism Policy', desc: 'Policy enabling employees and directors to report genuine concerns without fear of reprisal.', href: '/pdf/Vigil Mechanism Policy.pdf' },
      { title: 'Contact Information for Investor Grievances', desc: 'Details of the Compliance Officer and Registrar & Share Transfer Agent — contact cs@astonea.org.' },
    ],
  },
  {
    sub: 'financial_filings',
    items: [
      { title: 'Statement of Deviation or Variation — H1 FY 2025-26', desc: 'Non-applicability of Statement of Deviation or Variation in use of IPO proceeds for the half-year ended 30th September 2025.', href: '/pdf/Non- Applicability of Statement of Variation or Deviation.pdf' },
      { title: 'Board Meeting Notices for Financial Results', desc: 'Notices of Board meetings convened for approval of financial results.', externalLink: '/financial-results' },
      { title: 'Annual Returns (Form MGT-7)', desc: 'Annual returns filed with the Registrar of Companies — all years available on the Financial Results page.', externalLink: '/financial-results' },
    ],
  },
] as const

type Reg46Item = { title: string; desc: string; href?: string; externalLink?: string }

const reg46: SeedDoc[] = reg46Raw.flatMap((cat) =>
  (cat.items as readonly Reg46Item[]).map((it) => ({
    category: 'reg46' as const,
    subcategory: cat.sub,
    title: it.title,
    description: it.desc,
    fileUrl: it.href,
    externalLink: it.externalLink,
  })),
)

const subsidiaryFinancialsRaw = [
  {
    slug: 'ascot-biolabs',
    docs: [
      { label: 'Annual Financial Statements', period: 'FY 2024–2025', href: '/pdf/Ascot Biolabs - Financial Statements 24-25.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2023–2024', href: '/pdf/Ascot Biolabs - Financial Statements 23-24.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2022–2023' },
    ],
  },
  {
    slug: 'shinto-organics',
    docs: [
      { label: 'Annual Financial Statements', period: 'FY 2024–2025', href: '/pdf/SHINTO ORGANIC PVT LTD B.S.  2024-25.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2023–2024', href: '/pdf/Shinto Organics - Financial Statements 23-24.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2022–2023', href: '/pdf/Shinto Organics - Financial Statements 22-23.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2021–2022', href: '/pdf/Shinto Organics - Financial Statements 21-22.pdf' },
    ],
  },
  {
    slug: 'astonea-one',
    docs: [
      { label: 'Balance Sheet', period: 'FY 2024–2025', href: '/pdf/ASTONEA ONE -BS 2024-25.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2023–2024' },
      { label: 'Annual Financial Statements', period: 'FY 2022–2023' },
    ],
  },
  {
    slug: 'astonea-limited',
    docs: [
      { label: 'Annual Financial Statements', period: 'FY 2024–2025', href: '/pdf/Astonea Limited - Financial Statements 24-25.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2023–2024', href: '/pdf/Astonea Limited-23-24.pdf' },
      { label: 'Balance Sheet', period: 'FY 2022–2023', href: '/pdf/ASTONEA LIMITED BALANCE SHEET-22-23.pdf' },
    ],
  },
  {
    slug: 'chemist-india',
    docs: [
      { label: 'Annual Financial Statements', period: 'FY 2024–2025', href: '/pdf/Chemist India Ltd - Financial Statements 24-25.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2023–2024', href: '/pdf/Chemist India Ltd - Financial Statements 23-24.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2022–2023', href: '/pdf/Chemist India Ltd - Financial Statements 22-23.pdf' },
      { label: 'Annual Financial Statements', period: 'FY 2021–2022', href: '/pdf/Chemist India Ltd - Financial Statements 21-22.pdf' },
    ],
  },
  {
    slug: 'astonea-foundation',
    docs: [
      { label: 'Annual Financial Statements', period: 'FY 2024–2025', href: '/pdf/Astonea Foundation- Financial Statements 24-25.pdf' },
    ],
  },
] as const

type SubFinDoc = { label: string; period: string; href?: string }

function buildSubsidiaryFinancials(slugToId: Map<string, string>): SeedDoc[] {
  return subsidiaryFinancialsRaw.flatMap((group) => {
    const entityId = slugToId.get(group.slug)
    if (!entityId) throw new Error(`unknown group company slug: ${group.slug}`)
    return (group.docs as readonly SubFinDoc[]).map((d) => ({
      category: 'subsidiary_financial' as const,
      title: `${d.label} — ${d.period}`,
      period: d.period,
      fileUrl: d.href,
      entityId,
    }))
  })
}

/**
 * For certifications we use the schema fields liberally:
 *   subcategory → short label (badge)            e.g. "WHO-GMP"
 *   title       → full certification name        e.g. "World Health Organization — GMP"
 *   description → blurb
 *   period      → scope                          e.g. "All pharmaceutical manufacturing lines"
 *   fileUrl     → optional cert PDF
 */
const certifications: SeedDoc[] = [
  { category: 'certification', subcategory: 'WHO-GMP',       title: 'World Health Organization — Good Manufacturing Practices', period: 'All pharmaceutical manufacturing lines', description: 'Our core manufacturing certification ensuring products meet international quality benchmarks set by the World Health Organization for pharmaceutical production.', fileUrl: '/pdf/UPDATED CERTIFICATES PDF.pdf' },
  { category: 'certification', subcategory: 'ISO 9001:2015', title: 'International Organization for Standardization — Quality Management', period: 'Organisation-wide quality management', description: 'ISO-certified quality management systems covering planning, production, quality control, and continuous improvement across all operations.' },
  { category: 'certification', subcategory: 'cGMP',          title: 'Current Good Manufacturing Practice', period: 'All pharmaceutical formulations', description: 'Compliance with current GMP regulations as prescribed by Indian regulatory authorities, ensuring all manufacturing processes meet updated national standards.' },
  { category: 'certification', subcategory: 'AYUSH Approved',title: 'Ministry of AYUSH — Manufacturing Approval', period: 'Herbal & nutraceutical lines', description: 'Licensed to manufacture Ayurvedic, Unani, Siddha, and Homeopathic (AYUSH) formulations under the Ministry of AYUSH regulations.' },
  { category: 'certification', subcategory: 'FSSAI',         title: 'Food Safety and Standards Authority of India', period: 'Food supplements & nutraceuticals', description: 'FSSAI licensing for food supplement and nutraceutical product manufacturing, ensuring compliance with Indian food safety standards.' },
  { category: 'certification', subcategory: 'USFDA OTC',     title: 'US Food and Drug Administration — OTC Audit', period: 'OTC product lines', description: 'USFDA audit completed for Over-the-Counter (OTC) product manufacturing, supporting export readiness for the North American market.' },
]

async function seedDocuments(items: SeedDoc[]) {
  let inserted = 0
  let updated = 0
  for (let i = 0; i < items.length; i++) {
    const doc = items[i]

    // Natural key: (category, title, period, entityId). Required because
    // multiple yearly rows share a title (e.g. "Annual Financial Statements").
    const conditions: SQL[] = [
      eq(documents.category, doc.category),
      eq(documents.title, doc.title),
    ]
    conditions.push(doc.period ? eq(documents.period, doc.period) : isNull(documents.period))
    conditions.push(doc.entityId ? eq(documents.entityId, doc.entityId) : isNull(documents.entityId))

    const existing = (
      await db
        .select({ id: documents.id })
        .from(documents)
        .where(and(...conditions))
        .limit(1)
    )[0]

    const payload = {
      ...doc,
      displayOrder: i,
      updatedAt: new Date(),
    }

    if (existing) {
      await db.update(documents).set(payload).where(eq(documents.id, existing.id))
      updated++
    } else {
      await db.insert(documents).values({ ...payload, displayOrder: i })
      inserted++
    }
  }
  return { inserted, updated }
}

/* ─── Run ────────────────────────────────────────────────────────────────── */

async function main() {
  console.log('[seed] starting…')
  await seedAdmin()

  const slugToId = await seedGroupCompanies()

  const groups: { name: string; items: SeedDoc[] }[] = [
    { name: 'annual_report',         items: annualReports },
    { name: 'financial_result',      items: financialResults },
    { name: 'policy_code_framework', items: policiesCodesFrameworks },
    { name: 'reg30',                 items: reg30 },
    { name: 'reg46',                 items: reg46 },
    { name: 'subsidiary_financial',  items: buildSubsidiaryFinancials(slugToId) },
    { name: 'certification',         items: certifications },
  ]

  let totalIns = 0
  let totalUpd = 0
  for (const g of groups) {
    const { inserted, updated } = await seedDocuments(g.items)
    totalIns += inserted
    totalUpd += updated
    console.log(`[seed] ${g.name}: +${inserted} new, ~${updated} updated  (${g.items.length} total)`)
  }
  console.log(`[seed] done — ${totalIns} inserted, ${totalUpd} updated`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
