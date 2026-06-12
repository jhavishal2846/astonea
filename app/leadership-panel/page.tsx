import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { Reveal } from '@/components/StaggerReveal'
import { AnimatedPersonRow, type Person } from './AnimatedPersonRow'

export const metadata: Metadata = {
  title: 'Leadership Panel',
  description: 'Meet the executive team and senior management behind Astonea Labs Limited.',
}

const boardMembers: Person[] = [
  {
    name: 'Mr. Ashish Gulati',
    title: 'Founder and Managing Director',
    bio: "Ashish Gulati, Founder & Managing Director of Astonea Labs Limited, is a visionary leader driving the company's evolution into a global hub for pharmaceutical and cosmetic manufacturing. After completing his schooling at Hansraj Public School, he pursued Motorsport Engineering at Oxford Brookes University, United Kingdom. Combining exceptional entrepreneurial insight with strong organizational acumen, Mr. Gulati continues to spearhead strategic growth, innovation, and operational excellence across the organization.",
    img: '/leadership/ashish-gulati.webp',
  },
  {
    name: 'Mrs. Pooja Singh',
    title: 'Director',
    bio: 'Pooja Singh, Director at Astonea Labs Ltd., hails from Uttar Pradesh and holds a B. Pharma degree from Rajeev Gandhi College of Pharmacy. With over 8 years of expertise in Quality Assurance and Drug Regulatory Affairs, she began her career at Medwell Healthcare before joining Astonea Labs in 2021. She now leads the Drug Regulatory Affairs (DRA) department, ensuring rigorous compliance with regulatory standards and maintaining the highest quality benchmarks across the organization.',
    img: '/leadership/pooja-singh.avif',
  },
  {
    name: 'Dr Vikrant Narwal',
    title: 'Director',
    bio: 'A distinguished nutraceutical expert with 15+ years in R&D and 9 years in direct sales and marketing, Dr. Vikrant Narwal holds a Ph.D. from ICAR-NDRI. With over 350 commercial products developed, he is known for blending scientific precision with market insight to deliver innovative, high-impact nutraceutical solutions. His expertise spans formulation science, functional nutrition, and market-driven product innovation. He continues to play a key role in shaping advanced wellness solutions for the modern consumer.',
    img: '/leadership/vikrant-narwal.webp',
  },
  {
    name: 'Mr. Pradeep Dalal',
    title: 'Director',
    bio: "Mr. Pardeep Dalal holds a Bachelor's degree in Arts and has extensive professional experience in the field of finance. He has been appointed as an Additional Director at Astonea Labs Limited, bringing with him strong analytical skills, sound financial understanding, and a commitment to operational excellence. His expertise and leadership are expected to contribute significantly to the company's growth and strategic direction.",
    img: '/leadership/pradeep-dalal.avif',
  },
  {
    name: 'Mr. Arun Kumar Tripathi',
    title: 'Director',
    bio: 'With over two decades of experience in the pharmaceutical industry, brings strong expertise in manufacturing, quality assurance, regulatory compliance, and business operations. A B. Pharma graduate from 2002, he is also actively involved in product development, branding, and coordinating third-party manufacturing. His work reflects a passion for creating quality-focused healthcare solutions and a steady vision for sustainable growth in the pharma sector.',
    img: '/leadership/arun-kumar-tripathi.avif',
  },
  {
    name: 'Mr. Karan Vir Bindra',
    title: 'Independent Director',
    bio: "Mr. Karan Vir Bindra brings a multifaceted background to his role as both a Practicing Company Secretary (CS) and an Independent Director. He holds a dual degree in Commerce and Law, having pursued a Bachelor of Commerce and Bachelor of Laws (BCom LLB) degree. With over 12 years of extensive experience, Mr. Bindra has established himself as a seasoned professional in the field of corporate governance and compliance. His role as an Independent Director at Astonea Labs Limited, underscores his commitment to ensuring ethical conduct and robust governance practices within the organization.",
    img: '/leadership/karan-vir-bindra.avif',
  },
  {
    name: 'Ms. Salina Chalana',
    title: 'Independent Director',
    bio: "Ms. Salina Chalana brings a diverse background to her role as an Independent Director at Astonea Labs Limited, drawing from her experiences in the legal field. She holds a Bachelor of Arts and Bachelor of Laws (BA LLB) degree, reflecting her academic prowess in both humanities and law. With a decade of experience as a practicing lawyer, Ms. Chalana has honed her skills in legal advocacy and advisory services. As an Independent Director, her strategic counsel contributes to Astonea Labs's governance framework, fostering transparency and integrity within the organization.",
    img: '/leadership/salina-chalana.avif',
  },
  {
    name: 'Mr. Akash Arora',
    title: 'Independent Director',
    bio: "Mr. Akash Arora is an Independent Director in our Company. He holds a Bachelor of Commerce degree from S.D. College, Muzaffarnagar, which he completed in 2010. Additionally, he completed his Chartered Accountancy in March 2013. Mr. Arora's diverse background enriches his role as an Independent Director, drawing on his extensive experience in the banking and financial sectors. He worked as a senior manager at HDFC Bank Limited from January 11, 2016 to July 26, 2019, he also worked as senior associate credit - used car loan at Hero FinCorp from August 5, 2019 to January 10, 2020, making him a valuable asset to our team.",
    img: '/leadership/akash-arora.avif',
  },
]

const kmp: Person[] = [
  {
    name: 'Mr. Ankit Kapoor',
    title: 'Company Secretary and Compliance Officer',
    bio: 'Mr. Ankit Kapoor is an Associate Member of the Institute of Company Secretaries of India (ICSI) and a graduate in Bachelor of Commerce (Hons.) with a specialization in Accounting & Finance. He is also a semi-qualified Chartered Accountant. He brings strong domain expertise in Corporate Laws, SEBI Regulations, Accounting, Finance, and a wide spectrum of corporate compliance and governance matters. He excels in navigating complex regulatory frameworks and driving organizational compliance with strategic, efficient, and solution oriented approaches.',
    img: '/leadership/ankit-kapoor.avif',
  },
  {
    name: 'Mr. Sumit Kumar',
    title: 'Chief Financial Officer',
    bio: "Mr. Sumit Kumar, Chief Financial Officer (CFO) at Astonea Labs Ltd., is a highly accomplished finance professional with an M.Com, MBA, and MA in Economics. Bringing over 15 years of experience, he oversees the company's financial strategy, ensuring sustainable growth, robust financial health, and strategic decision-making to drive long-term business success. His deep financial insight, coupled with a strategic vision, enables Astonea to navigate complex markets and achieve its growth objectives with confidence.",
    img: '/leadership/sumit-kumar.avif',
  },
]

const seniorManagement: Person[] = [
  {
    name: 'Mr. Mushtaque Ahmed',
    title: 'Plant Head',
    bio: "Mr. Mushtaque Ahmed, Plant Head at Astonea labs ltd, holds a B. Pharma from Dr. A.P.J. Abdul Kalam Technical University and brings 20 years of manufacturing experience. His extensive expertise ensures efficient, safe, and compliant production processes, maintaining high-quality standards in Astonea's manufacturing operations.",
    img: '/leadership/mushtaque-ahmed.avif',
  },
  {
    name: 'Mr. Gaurav Kumar',
    title: 'VP Sales and Marketing',
    bio: 'Mr. Gaurav Kumar is VP sales and marketing for Astonea Labs Limited for own domestic brands. Mr. Kumar is a Software Engineer and holds an MBA Degree in Marketing from BITM, Pune. His Scope of work includes managing Marketing and Sales segment of the Company.',
    img: '/leadership/gaurav-kumar.avif',
  },
]

function SectionHeader({ title }: { title: string }) {
  return (
    <Reveal>
      <h2
        className="text-center font-display text-3xl font-bold leading-snug text-balance lg:text-4xl"
        style={{ color: 'var(--color-ink)' }}
      >
        {title}
      </h2>
    </Reveal>
  )
}

function PeopleList({ people }: { people: Person[] }) {
  return (
    <div className="mx-auto max-w-5xl space-y-14 lg:space-y-20">
      {people.map((p, i) => (
        <AnimatedPersonRow key={p.name} person={p} reverse={i % 2 === 1} />
      ))}
    </div>
  )
}

export default function LeadershipPanelPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        eyebrow="People"
        title="Leadership Panel"
        description="The experienced team of Directors, KMP's & SM driving Astonea Labs forward."
        breadcrumb={[{ label: 'Leadership Panel', href: '/leadership-panel' }]}
      />

      {/* Board of Directors */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="mb-14 lg:mb-20">
            <SectionHeader title="Board of Directors" />
          </div>
          <PeopleList people={boardMembers} />
        </div>
      </section>

      {/* Key Managerial Personnel */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--color-surface)' }}>
        <div className="container-wide">
          <div className="mb-14 lg:mb-20">
            <SectionHeader title="Key Managerial Personnel" />
          </div>
          <PeopleList people={kmp} />
        </div>
      </section>

      {/* Senior Managerial Personnel */}
      <section className="py-20 lg:py-28" style={{ background: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="mb-14 lg:mb-20">
            <SectionHeader title="Senior Managerial Personnel" />
          </div>
          <PeopleList people={seniorManagement} />
        </div>
      </section>
    </div>
  )
}
