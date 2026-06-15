import { PageHeader } from '@/components/PageHeader'
import { MilestoneStats, MilestoneTimeline } from '@/components/MilestoneTimeline'
import type { Milestone, Stat } from '@/components/MilestoneTimeline'
import { pageMeta } from '@/lib/seo/generate-metadata'

export const generateMetadata = () =>
  pageMeta('/key-milestone', {
    title: 'Key Milestones',
    description: 'Astonea Labs\' journey from incorporation in 2017 to its 2025 BSE SME listing as a pan-India manufacturer.',
  })

const milestones: Milestone[] = [
  {
    year: '2017',
    title: 'Incorporation',
    icon: 'building',
    events: [
      'Incorporated as a Private Limited Company under the name AHU Laboratories Private Limited.',
      'Acquired 2.5 acres of land at Village Haripar, Haryana for the manufacturing facility.',
    ],
  },
  {
    year: '2018',
    title: 'Construction Begins',
    icon: 'hardhat',
    events: [
      'Construction commenced for the manufacturing facility.',
      'Initiated procurement of plant and machinery for production.',
    ],
  },
  {
    year: '2019',
    title: 'Rebrand & First Production',
    icon: 'flask',
    events: [
      'Company name changed from AHU Laboratories Private Limited to Astonea Labs Private Limited.',
      'Began production of cosmetic products under the Astonea Labs banner.',
    ],
  },
  {
    year: '2020',
    title: 'Exports Begin',
    icon: 'globe',
    events: [
      'Initiated exports via merchant exporters.',
    ],
  },
  {
    year: '2021',
    title: 'Capacity Expansion',
    icon: 'layers',
    events: [
      'Commissioned the second production block for tablets, capsules, softgels, and oral powders.',
    ],
  },
  {
    year: '2022',
    title: 'Direct Exports & Brand Launch',
    icon: 'package',
    events: [
      'Began direct exports of pharmaceutical products.',
      'Launched the brand "Glow Up".',
    ],
  },
  {
    year: '2023',
    title: 'Global Certifications',
    icon: 'shield',
    events: [
      'Achieved WHO GMP Certification and Eco-Cert COSMOS for sustainable cosmetic manufacturing.',
    ],
  },
  {
    year: '2024',
    title: 'Brand Expansion',
    icon: 'sparkles',
    events: [
      'Launched the brand "Regero".',
    ],
  },
  {
    year: '2025',
    title: 'BSE SME Listing',
    icon: 'trending',
    events: [
      'Successfully listed on BSE through SME platform.',
    ],
  },
]

const stats: Stat[] = [
  { value: '2017', label: 'Year Founded' },
  { value: '3,200+', label: 'Client Brands' },
  { value: '2,500+', label: 'Product Approvals' },
  { value: 'BSE SME', label: 'Listed On June 2025' },
]

export default function KeyMilestonePage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="Our Journey"
        title="Key Milestones"
        description="From a Chandigarh startup in 2017 to a BSE SME–listed, pan-India manufacturer in 2025."
        breadcrumb={[{ label: 'Key Milestones', href: '/key-milestone' }]}
      />

      <MilestoneStats stats={stats} />
      <MilestoneTimeline milestones={milestones} />
    </div>
  )
}
