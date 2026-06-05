import type { ProductDetail } from './types'
import { toSlug } from './utils'
import {
  apiListing,
  intermediatesListing,
  industrialListing,
  excipientListing,
  herbalListing,
  nutraceuticalListing,
  foodListing,
  dyeListing,
  impurityListing,
  organicListing,
  inorganicListing,
  pelletListing,
} from './listings'

/* ─── APIs ─────────────────────────────────────────────────────────────────── */

export const apiProducts: ProductDetail[] = [
  {
    name: 'Abacavir Sulfate', slug: 'abacavir-sulfate', cas: '188062-50-2', grade: 'USP', category: 'Antiviral',
    molecularFormula: 'C₁₄H₁₈N₆O·H₂SO₄', molecularWeight: '670.74 g/mol', purity: '≥99.0%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 20–25°C, protect from light and moisture',
    description: 'Abacavir Sulfate is a nucleoside reverse transcriptase inhibitor (NRTI) used as an antiretroviral medication for treatment of HIV/AIDS. It interferes with the HIV reverse transcriptase enzyme to block viral replication. Supplied as the sulfate salt for enhanced solubility and stability, meeting USP pharmacopoeial standards.',
    applications: ['Antiretroviral therapy for HIV-1 infection', 'Component of fixed-dose combination ARV regimens', 'Paediatric HIV treatment formulations', 'Tablet and oral solution dosage forms'],
    packaging: [{ size: '100 g', type: 'Amber glass bottle' }, { size: '500 g', type: 'HDPE drum' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Acetaminophen (Paracetamol)', slug: 'acetaminophen-paracetamol', cas: '103-90-2', grade: 'USP/BP', category: 'Analgesic',
    molecularFormula: 'C₈H₉NO₂', molecularWeight: '151.16 g/mol', purity: '≥99.5%',
    appearance: 'White crystalline powder', storageConditions: 'Store at room temperature, protect from moisture',
    description: 'Acetaminophen (Paracetamol) is a widely used analgesic and antipyretic active pharmaceutical ingredient. It is one of the most commonly prescribed pain relievers and fever reducers worldwide. This USP/BP-grade material meets strict pharmacopoeial specifications for use in pharmaceutical formulations including tablets, capsules, suspensions, and suppositories.',
    applications: ['Analgesic tablets and capsules (500 mg, 1000 mg)', 'Paediatric oral suspensions and syrups', 'Effervescent tablet formulations', 'Combined cold and flu preparations', 'Injectable formulations (IV paracetamol)'],
    packaging: [{ size: '25 kg', type: 'Double polyethylene bag in fibre drum' }, { size: '50 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Acyclovir', slug: 'acyclovir', cas: '59277-89-3', grade: 'USP/BP', category: 'Antiviral',
    molecularFormula: 'C₈H₁₁N₅O₃', molecularWeight: '225.21 g/mol', purity: '≥98.5%',
    appearance: 'White crystalline powder', storageConditions: 'Store at 15–30°C in a dry place',
    description: 'Acyclovir is a synthetic nucleoside analogue antiviral drug active against herpes simplex viruses (HSV-1, HSV-2) and varicella-zoster virus (VZV). It selectively inhibits viral DNA polymerase after activation by viral thymidine kinase. Available in USP and BP grades for oral, topical, and injectable formulations.',
    applications: ['Herpes simplex (cold sores, genital herpes) oral tablets and capsules', 'Varicella-zoster (chickenpox, shingles) treatment', 'IV injection for severe viral infections', 'Topical creams and ointments (5%)', 'Ophthalmic ointments'],
    packaging: [{ size: '500 g', type: 'HDPE drum' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }, { size: '25 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Amlodipine Besylate', slug: 'amlodipine-besylate', cas: '111470-99-6', grade: 'USP', category: 'Cardiovascular',
    molecularFormula: 'C₂₀H₂₅ClN₂O₅·C₆H₆O₃S', molecularWeight: '567.05 g/mol', purity: '≥99.0%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store below 30°C, protect from light',
    description: 'Amlodipine Besylate is a calcium channel blocker used in the treatment of hypertension and angina pectoris. As the besylate (benzenesulfonate) salt, it offers improved solubility and stability compared to the free base. Meets USP specifications and is widely used in 5 mg and 10 mg tablet formulations.',
    applications: ['Antihypertensive tablet formulations (5 mg, 10 mg)', 'Stable angina management', 'Vasospastic angina treatment', 'Fixed-dose combinations with ACE inhibitors', 'Fixed-dose combinations with statins'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Amoxicillin Trihydrate', slug: 'amoxicillin-trihydrate', cas: '61336-70-7', grade: 'BP/EP', category: 'Antibiotic',
    molecularFormula: 'C₁₆H₁₉N₃O₅S·3H₂O', molecularWeight: '419.45 g/mol', purity: '≥96.0% (on anhydrous basis)',
    appearance: 'White to almost white crystalline powder', storageConditions: 'Store at 15–25°C in a dry place, protect from moisture',
    description: 'Amoxicillin Trihydrate is a broad-spectrum beta-lactam antibiotic of the penicillin class. It acts by inhibiting bacterial cell wall synthesis and is effective against many gram-positive and gram-negative organisms. Supplied as the trihydrate form for formulation stability, meeting BP and EP pharmacopoeial requirements.',
    applications: ['Oral capsules and tablets (250 mg, 500 mg)', 'Paediatric oral suspensions and dry syrups', 'Combined formulations with clavulanic acid', 'Dental and veterinary antibiotic preparations'],
    packaging: [{ size: '5 kg', type: 'Aluminium laminated bag' }, { size: '25 kg', type: 'Fibre drum with polyethylene liner' }],
    documents: ['COA', 'MSDS', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Aspirin', slug: 'aspirin', cas: '50-78-2', grade: 'USP/BP', category: 'Analgesic',
    molecularFormula: 'C₉H₈O₄', molecularWeight: '180.16 g/mol', purity: '≥99.5%',
    appearance: 'White crystalline powder', storageConditions: 'Store at 15–25°C, protect from moisture',
    description: 'Aspirin (Acetylsalicylic Acid) is a widely used non-steroidal analgesic, antipyretic, and anti-inflammatory agent. It irreversibly inhibits cyclooxygenase enzymes (COX-1 and COX-2), reducing prostaglandin synthesis. At low doses (75–100 mg), it is used as an antiplatelet agent for cardiovascular prophylaxis.',
    applications: ['Analgesic and antipyretic tablets (300 mg, 500 mg)', 'Low-dose antiplatelet therapy (75 mg, 100 mg) tablets', 'Enteric-coated tablet formulations', 'Dispersible tablet formulations', 'Combined analgesic preparations'],
    packaging: [{ size: '25 kg', type: 'Double polyethylene bag in fibre drum' }, { size: '50 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Atorvastatin Calcium', slug: 'atorvastatin-calcium', cas: '134523-00-5', grade: 'USP', category: 'Cardiovascular',
    molecularFormula: '(C₃₃H₃₄FN₂O₅)₂Ca', molecularWeight: '1209.42 g/mol', purity: '≥98.0%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 20–25°C, protect from light and moisture',
    description: 'Atorvastatin Calcium is an HMG-CoA reductase inhibitor (statin) used for the management of hyperlipidaemia and prevention of cardiovascular disease. Supplied as the calcium salt form (trihydrate) meeting USP specifications, it is used in tablet dosage forms ranging from 10 mg to 80 mg.',
    applications: ['Hyperlipidaemia treatment tablets (10–80 mg)', 'Primary prevention of cardiovascular disease', 'Secondary prevention after myocardial infarction', 'Fixed-dose combinations with amlodipine'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Azithromycin', slug: 'azithromycin', cas: '83905-01-5', grade: 'USP/BP', category: 'Antibiotic',
    molecularFormula: 'C₃₈H₇₂N₂O₁₂', molecularWeight: '748.98 g/mol', purity: '≥96.0%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 15–30°C, protect from moisture',
    description: 'Azithromycin is a broad-spectrum macrolide antibiotic effective against a wide range of gram-positive, gram-negative, and atypical bacterial pathogens. It acts by binding to the 50S ribosomal subunit, inhibiting protein synthesis. Widely used in respiratory, skin, and sexually transmitted infections.',
    applications: ['Community-acquired pneumonia treatment', 'Acute bacterial exacerbations of COPD', 'Pharyngitis and tonsillitis treatment', 'Skin and soft tissue infections', 'Chlamydia and gonorrhoea treatment', 'Paediatric oral suspensions'],
    packaging: [{ size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }, { size: '25 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Cetirizine HCl', slug: 'cetirizine-hcl', cas: '83881-51-0', grade: 'USP', category: 'Antihistamine',
    molecularFormula: 'C₂₁H₂₅ClN₂O₃·2HCl', molecularWeight: '461.82 g/mol', purity: '≥98.0%',
    appearance: 'White crystalline powder', storageConditions: 'Store at 20–25°C, protect from moisture',
    description: 'Cetirizine Hydrochloride is a second-generation antihistamine that selectively antagonises peripheral H₁-receptors. It provides effective, non-sedating relief from allergic rhinitis, urticaria, and related allergic conditions. USP grade material suitable for tablet and oral solution formulations.',
    applications: ['Antiallergic tablets (10 mg)', 'Paediatric oral syrups and solutions', 'Treatment of seasonal and perennial allergic rhinitis', 'Chronic idiopathic urticaria management'],
    packaging: [{ size: '500 g', type: 'HDPE drum' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Ciprofloxacin HCl', slug: 'ciprofloxacin-hcl', cas: '86393-32-0', grade: 'USP/BP', category: 'Antibiotic',
    molecularFormula: 'C₁₇H₁₈FN₃O₃·HCl·H₂O', molecularWeight: '385.82 g/mol', purity: '≥99.0%',
    appearance: 'Pale yellow crystalline powder', storageConditions: 'Store at 15–25°C, protect from light',
    description: 'Ciprofloxacin Hydrochloride is a broad-spectrum fluoroquinolone antibiotic with potent bactericidal activity against gram-negative and some gram-positive organisms. It inhibits DNA gyrase (topoisomerase II) and topoisomerase IV. The hydrochloride monohydrate form is used in oral tablets and intravenous infusions.',
    applications: ['Urinary tract infections treatment tablets', 'Respiratory tract infections', 'Intravenous infusion bags and ampoules', 'Ophthalmic drops (0.3%)', 'Anthrax post-exposure prophylaxis'],
    packaging: [{ size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }, { size: '25 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Clarithromycin', slug: 'clarithromycin', cas: '81103-11-9', grade: 'USP/EP', category: 'Antibiotic',
    molecularFormula: 'C₃₈H₆₉NO₁₃', molecularWeight: '747.95 g/mol', purity: '≥96.0%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 15–30°C, protect from moisture',
    description: 'Clarithromycin is a macrolide antibiotic derived from erythromycin with improved acid stability and broader spectrum activity. It is used for respiratory tract infections, Helicobacter pylori eradication, and atypical mycobacterial infections. Available in immediate and extended-release formulations.',
    applications: ['Community-acquired pneumonia and bronchitis', 'Helicobacter pylori eradication (triple therapy)', 'Mycobacterium avium complex (MAC) infection', 'Extended-release tablets (500 mg)', 'Paediatric oral suspension'],
    packaging: [{ size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Diclofenac Sodium', slug: 'diclofenac-sodium', cas: '15307-79-6', grade: 'BP/EP', category: 'NSAID',
    molecularFormula: 'C₁₄H₁₀Cl₂NNaO₂', molecularWeight: '318.13 g/mol', purity: '≥99.0%',
    appearance: 'White to slightly yellowish crystalline powder', storageConditions: 'Store at 15–25°C, protect from moisture',
    description: 'Diclofenac Sodium is a non-steroidal anti-inflammatory drug (NSAID) that inhibits both COX-1 and COX-2 enzymes. It is widely used for pain and inflammation management in musculoskeletal conditions and post-operative pain. Available in oral, injectable, topical, and ophthalmic formulations.',
    applications: ['Enteric-coated oral tablets (25 mg, 50 mg, 75 mg)', 'Sustained-release capsules (100 mg)', 'Injectable ampoules (75 mg/3 mL)', 'Topical diclofenac gels (1%, 3%)', 'Ophthalmic drops (0.1%)', 'Diclofenac EC pellets for capsule filling'],
    packaging: [{ size: '5 kg', type: 'HDPE drum' }, { size: '25 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Doxycycline Hyclate', slug: 'doxycycline-hyclate', cas: '24390-14-5', grade: 'USP', category: 'Antibiotic',
    molecularFormula: 'C₂₂H₂₄N₂O₈·HCl·½C₂H₅OH·½H₂O', molecularWeight: '512.94 g/mol', purity: '≥90.0%',
    appearance: 'Yellow crystalline powder', storageConditions: 'Store below 25°C, protect from light and moisture',
    description: 'Doxycycline Hyclate is a tetracycline-class antibiotic with broad-spectrum activity against gram-positive, gram-negative, and atypical pathogens. It inhibits bacterial protein synthesis by binding to the 30S ribosomal subunit. The hyclate form (hydrochloride hemiethanolate hemihydrate) offers better water solubility for formulation.',
    applications: ['Respiratory infections (pneumonia, bronchitis)', 'Sexually transmitted infections (chlamydia)', 'Malaria prophylaxis', 'Lyme disease treatment', 'Oral capsules (50 mg, 100 mg)', 'Intravenous infusion'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Esomeprazole Magnesium', slug: 'esomeprazole-magnesium', cas: '161796-78-7', grade: 'USP/EP', category: 'GI',
    molecularFormula: '(C₁₇H₁₈N₃O₃S)₂Mg·3H₂O', molecularWeight: '767.18 g/mol', purity: '≥98.0%',
    appearance: 'White to slightly coloured crystalline powder', storageConditions: 'Store at 15–25°C, protect from light and moisture',
    description: 'Esomeprazole Magnesium is the S-isomer of omeprazole, a proton pump inhibitor (PPI) that irreversibly blocks the gastric H⁺/K⁺-ATPase enzyme. It provides potent and long-lasting suppression of gastric acid secretion. Supplied as the magnesium trihydrate salt for enteric-coated capsule and delayed-release tablet formulations.',
    applications: ['Gastro-oesophageal reflux disease (GERD) treatment', 'Erosive oesophagitis healing and maintenance', 'Helicobacter pylori eradication combination therapy', 'Enteric-coated pellet capsules (20 mg, 40 mg)', 'Intravenous injection for IV formulations'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Fluconazole', slug: 'fluconazole', cas: '86386-73-4', grade: 'USP/BP', category: 'Antifungal',
    molecularFormula: 'C₁₃H₁₂F₂N₆O', molecularWeight: '306.27 g/mol', purity: '≥99.0%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 15–30°C',
    description: 'Fluconazole is a triazole antifungal agent that inhibits ergosterol biosynthesis by blocking the fungal cytochrome P450 enzyme lanosterol 14α-demethylase. It has excellent oral bioavailability (>90%) and is effective against Candida and Cryptococcus species. Used in oral and intravenous formulations.',
    applications: ['Oropharyngeal and oesophageal candidiasis', 'Vulvovaginal candidiasis (150 mg single dose)', 'Cryptococcal meningitis treatment and prophylaxis', 'Systemic candida infections (IV)', 'Oral capsules (50 mg, 150 mg, 200 mg)', 'Paediatric oral suspension'],
    packaging: [{ size: '500 g', type: 'HDPE drum' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Gabapentin', slug: 'gabapentin', cas: '60142-96-3', grade: 'USP', category: 'Neurological',
    molecularFormula: 'C₉H₁₇NO₂', molecularWeight: '171.24 g/mol', purity: '≥99.0%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 15–30°C, protect from moisture',
    description: 'Gabapentin is an anticonvulsant and neuropathic pain agent structurally related to GABA, though it does not bind to GABA receptors. It modulates voltage-gated calcium channels in the CNS. Used for partial seizures, post-herpetic neuralgia, and as adjunctive therapy in various neuropathic pain conditions.',
    applications: ['Partial seizures (adjunctive therapy)', 'Post-herpetic neuralgia (100 mg, 300 mg, 400 mg capsules)', 'Neuropathic pain management', 'Restless legs syndrome', 'Alcohol withdrawal (off-label)'],
    packaging: [{ size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }, { size: '25 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Ibuprofen', slug: 'ibuprofen', cas: '15687-27-1', grade: 'USP/BP', category: 'NSAID',
    molecularFormula: 'C₁₃H₁₈O₂', molecularWeight: '206.29 g/mol', purity: '≥99.0%',
    appearance: 'White crystalline powder with slight characteristic odour', storageConditions: 'Store at 15–25°C',
    description: 'Ibuprofen is a widely used non-steroidal anti-inflammatory drug (NSAID) that non-selectively inhibits COX-1 and COX-2, reducing prostaglandin synthesis. It is indicated for pain, inflammation, and fever. Available in racemic form (standard) or as the S-enantiomer (dexibuprofen) for enhanced potency.',
    applications: ['Oral tablets and capsules (200 mg, 400 mg, 600 mg)', 'Paediatric oral suspension (100 mg/5 mL)', 'Topical gels (5%)', 'IV ibuprofen (injectable)', 'Effervescent sachet formulations', 'Combined analgesic preparations'],
    packaging: [{ size: '25 kg', type: 'Double polyethylene bag in fibre drum' }, { size: '50 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Ivermectin', slug: 'ivermectin', cas: '70288-86-7', grade: 'USP', category: 'Antiparasitic',
    molecularFormula: 'C₄₈H₇₄O₁₄ (B1a) / C₄₇H₇₂O₁₄ (B1b)', molecularWeight: '875.10 g/mol (B1a)', purity: '≥95.0% (B1a ≥80%)',
    appearance: 'White to yellowish-white crystalline powder', storageConditions: 'Store at 15–25°C, protect from light and moisture',
    description: 'Ivermectin is a macrocyclic lactone antiparasitic agent derived from Streptomyces avermitilis fermentation. It acts by binding to glutamate-gated chloride channels in invertebrate nerve and muscle cells, causing paralysis and death of parasites. Active against a broad spectrum of nematodes, ectoparasites, and scabies.',
    applications: ['Onchocerciasis (river blindness) treatment', 'Lymphatic filariasis mass drug administration', 'Strongyloidiasis treatment (oral tablets)', 'Scabies treatment', 'Head lice lotion formulations', 'Veterinary anthelmintic preparations'],
    packaging: [{ size: '100 g', type: 'Amber glass bottle' }, { size: '500 g', type: 'HDPE drum' }, { size: '1 kg', type: 'HDPE drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Losartan Potassium', slug: 'losartan-potassium', cas: '124750-99-8', grade: 'USP', category: 'Cardiovascular',
    molecularFormula: 'C₂₂H₂₂ClKN₆O', molecularWeight: '461.00 g/mol', purity: '≥98.5%',
    appearance: 'White to off-white powder', storageConditions: 'Store at 20–25°C, protect from moisture',
    description: 'Losartan Potassium is an angiotensin II receptor blocker (ARB) used for hypertension, diabetic nephropathy, and heart failure. It selectively blocks the AT₁ receptor, preventing the vasoconstrictive effects of angiotensin II. The potassium salt formulation provides improved solubility for tablet manufacturing.',
    applications: ['Antihypertensive tablets (25 mg, 50 mg, 100 mg)', 'Diabetic nephropathy in type 2 diabetes', 'Reduction of stroke risk in hypertensive LVH patients', 'Fixed-dose combinations with hydrochlorothiazide'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Metformin HCl', slug: 'metformin-hcl', cas: '1115-70-4', grade: 'USP/BP', category: 'Antidiabetic',
    molecularFormula: 'C₄H₁₁N₅·HCl', molecularWeight: '165.62 g/mol', purity: '≥99.0%',
    appearance: 'White crystalline powder', storageConditions: 'Store at 20–25°C, protect from moisture',
    description: 'Metformin Hydrochloride is a biguanide oral antidiabetic agent and first-line therapy for type 2 diabetes mellitus. It reduces hepatic glucose production, decreases intestinal glucose absorption, and improves insulin sensitivity. Also used for polycystic ovary syndrome (PCOS) and as adjunctive therapy in insulin-treated type 2 diabetes.',
    applications: ['Type 2 diabetes oral tablets (500 mg, 850 mg, 1000 mg)', 'Extended-release (ER) tablet formulations', 'PCOS management', 'Fixed-dose combinations with other antidiabetics', 'Paediatric diabetes treatment (10+ years)'],
    packaging: [{ size: '25 kg', type: 'Double polyethylene bag in fibre drum' }, { size: '50 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Metronidazole', slug: 'metronidazole', cas: '443-48-1', grade: 'USP/BP', category: 'Antibiotic',
    molecularFormula: 'C₆H₉N₃O₃', molecularWeight: '171.16 g/mol', purity: '≥99.0%',
    appearance: 'White to pale yellow crystalline powder', storageConditions: 'Store at 15–25°C, protect from light',
    description: 'Metronidazole is a nitroimidazole antibiotic and antiprotozoal agent active against anaerobic bacteria and protozoa including Trichomonas, Giardia, and Entamoeba. It is converted to toxic metabolites that disrupt DNA synthesis in target organisms. Available for oral, intravenous, topical, and vaginal routes.',
    applications: ['Anaerobic bacterial infections (oral, IV)', 'Helicobacter pylori eradication (triple therapy)', 'Trichomoniasis and bacterial vaginosis', 'Topical gels for rosacea (0.75%, 1%)', 'Vaginal creams and gels', 'Dental (periodontal) gel formulations'],
    packaging: [{ size: '5 kg', type: 'HDPE drum' }, { size: '25 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Montelukast Sodium', slug: 'montelukast-sodium', cas: '151767-02-1', grade: 'USP', category: 'Respiratory',
    molecularFormula: 'C₃₅H₃₅ClNNaO₃S', molecularWeight: '608.17 g/mol', purity: '≥98.0%',
    appearance: 'White to off-white hygroscopic powder', storageConditions: 'Store at 20–25°C, protect from moisture and light',
    description: 'Montelukast Sodium is a selective cysteinyl leukotriene receptor antagonist (LTRA) used for the prophylaxis and chronic treatment of asthma, and for relieving symptoms of seasonal and perennial allergic rhinitis. It blocks the action of leukotrienes on airway smooth muscle, reducing inflammation and bronchoconstriction.',
    applications: ['Asthma prophylaxis and chronic treatment tablets (10 mg)', 'Paediatric chewable tablets (4 mg, 5 mg)', 'Oral granule sachets for infants/toddlers', 'Seasonal and perennial allergic rhinitis', 'Exercise-induced bronchoconstriction prevention'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Omeprazole', slug: 'omeprazole', cas: '73590-58-6', grade: 'USP/BP', category: 'GI',
    molecularFormula: 'C₁₇H₁₉N₃O₃S', molecularWeight: '345.42 g/mol', purity: '≥98.5%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 15–25°C, protect from light and moisture',
    description: 'Omeprazole is a benzimidazole proton pump inhibitor (PPI) that covalently binds to and inactivates the gastric H⁺/K⁺-ATPase enzyme, reducing gastric acid secretion. It is used for GERD, peptic ulcer disease, and Helicobacter pylori eradication. Supplied as the racemic mixture (unlike esomeprazole which is the S-enantiomer).',
    applications: ['Enteric-coated pellets for capsule filling (20 mg, 40 mg)', 'Delayed-release tablets', 'Helicobacter pylori eradication therapy', 'GERD and erosive oesophagitis', 'Zollinger-Ellison syndrome management', 'OTC low-dose formulations'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Pantoprazole Sodium', slug: 'pantoprazole-sodium', cas: '138786-67-1', grade: 'USP/EP', category: 'GI',
    molecularFormula: 'C₁₆H₁₄F₂N₃NaO₄S·1.5H₂O', molecularWeight: '432.37 g/mol', purity: '≥98.5%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 20–25°C, protect from light and moisture',
    description: 'Pantoprazole Sodium Sesquihydrate is a substituted benzimidazole proton pump inhibitor. It is activated in acidic compartments and irreversibly binds to and inhibits the H⁺/K⁺-ATPase pump on gastric parietal cells. It shows greater selectivity for gastric over non-gastric H⁺/K⁺-ATPase compared to older PPIs.',
    applications: ['GERD treatment tablets (20 mg, 40 mg)', 'Enteric-coated pellets for capsule filling', 'Intravenous injection formulation', 'Peptic ulcer disease healing', 'Helicobacter pylori eradication regimens', 'Zollinger-Ellison syndrome'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Paracetamol', slug: 'paracetamol', cas: '103-90-2', grade: 'USP/BP', category: 'Analgesic',
    molecularFormula: 'C₈H₉NO₂', molecularWeight: '151.16 g/mol', purity: '≥99.5%',
    appearance: 'White crystalline powder', storageConditions: 'Store at room temperature, protect from moisture',
    description: 'Paracetamol (Acetaminophen) is a para-aminophenol derivative widely used as an over-the-counter analgesic and antipyretic. It acts centrally on pain-modulating pathways with minimal peripheral anti-inflammatory action. Manufactured to USP and BP specifications for all solid, liquid, and injectable dosage forms.',
    applications: ['Tablets and caplets (500 mg, 1000 mg)', 'Paediatric syrups and suspensions', 'IV infusion (Perfalgan) formulations', 'Suppositories', 'Effervescent sachets', 'Combined cold, flu, and pain relief preparations'],
    packaging: [{ size: '25 kg', type: 'Double polyethylene bag in fibre drum' }, { size: '50 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Pioglitazone HCl', slug: 'pioglitazone-hcl', cas: '112529-15-4', grade: 'USP', category: 'Antidiabetic',
    molecularFormula: 'C₁₉H₂₀N₂O₃S·HCl', molecularWeight: '392.90 g/mol', purity: '≥99.0%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 20–25°C, protect from moisture',
    description: 'Pioglitazone Hydrochloride is a thiazolidinedione insulin-sensitising agent used for type 2 diabetes. It activates the PPARγ nuclear receptor, improving insulin sensitivity in adipose tissue, muscle, and liver. The hydrochloride salt provides stability and processability for tablet manufacturing.',
    applications: ['Type 2 diabetes monotherapy tablets (15 mg, 30 mg, 45 mg)', 'Combination therapy with metformin or sulfonylureas', 'Fixed-dose combinations with metformin'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Pregabalin', slug: 'pregabalin', cas: '148553-50-8', grade: 'USP', category: 'Neurological',
    molecularFormula: 'C₈H₁₇NO₂', molecularWeight: '159.23 g/mol', purity: '≥99.5%',
    appearance: 'White crystalline powder', storageConditions: 'Store at 20–25°C',
    description: 'Pregabalin is a structural analogue of GABA that binds to the α₂δ subunit of voltage-gated calcium channels, reducing neurotransmitter release. It is used for neuropathic pain, fibromyalgia, partial seizures, and generalised anxiety disorder. Pregabalin shows superior pharmacokinetic properties compared to gabapentin.',
    applications: ['Neuropathic pain capsules (25 mg to 300 mg)', 'Fibromyalgia treatment', 'Partial seizures (adjunctive therapy)', 'Generalised anxiety disorder', 'Post-herpetic neuralgia', 'Diabetic peripheral neuropathy'],
    packaging: [{ size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }, { size: '25 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Ranitidine HCl', slug: 'ranitidine-hcl', cas: '66357-59-3', grade: 'USP/BP', category: 'GI',
    molecularFormula: 'C₁₃H₂₂N₄O₃S·HCl', molecularWeight: '350.86 g/mol', purity: '≥98.0%',
    appearance: 'White to pale yellow crystalline powder', storageConditions: 'Store at 15–25°C, protect from light and moisture',
    description: 'Ranitidine Hydrochloride is an H₂-receptor antagonist that inhibits gastric acid secretion. It is used for peptic ulcer disease, GERD, and Zollinger-Ellison syndrome. Note: Products must be verified to meet NDMA specifications per regulatory guidance; our material is manufactured and tested to current guidelines.',
    applications: ['Peptic ulcer disease treatment tablets (150 mg, 300 mg)', 'GERD management', 'Intravenous injection formulations', 'OTC heartburn treatment', 'Gastric acid hypersecretion conditions'],
    packaging: [{ size: '5 kg', type: 'HDPE drum' }, { size: '25 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Rosuvastatin Calcium', slug: 'rosuvastatin-calcium', cas: '147098-20-2', grade: 'USP', category: 'Cardiovascular',
    molecularFormula: '(C₂₂H₂₇FN₃O₆S)₂Ca', molecularWeight: '1001.14 g/mol', purity: '≥98.0%',
    appearance: 'White to off-white amorphous powder', storageConditions: 'Store at 15–25°C, protect from light and moisture',
    description: 'Rosuvastatin Calcium is a highly potent synthetic HMG-CoA reductase inhibitor ("statin") with a longer half-life than other statins, allowing once-daily dosing. It effectively reduces LDL cholesterol, total cholesterol, and triglycerides while increasing HDL. Supplied as the calcium salt for pharmaceutical tablet manufacturing.',
    applications: ['Hyperlipidaemia and dyslipidaemia tablets (5–40 mg)', 'Primary prevention of cardiovascular events', 'Heterozygous familial hypercholesterolaemia', 'Homozygous familial hypercholesterolaemia', 'Fixed-dose combinations with ezetimibe'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Salbutamol Sulfate', slug: 'salbutamol-sulfate', cas: '51022-70-9', grade: 'BP/EP', category: 'Respiratory',
    molecularFormula: '(C₁₃H₂₁NO₃)₂·H₂SO₄', molecularWeight: '576.70 g/mol', purity: '≥98.0%',
    appearance: 'White crystalline powder', storageConditions: 'Store at 15–25°C, protect from light and moisture',
    description: 'Salbutamol Sulfate (Albuterol Sulfate) is a short-acting β₂-adrenergic receptor agonist (SABA) used as a bronchodilator for the treatment and prevention of bronchospasm in asthma and COPD. It provides rapid relief (onset 5–15 min) and is the standard rescue inhaler API worldwide.',
    applications: ['Pressurised metered-dose inhaler (pMDI) formulations', 'Dry powder inhaler (DPI) formulations', 'Nebuliser solution (2.5 mg/2.5 mL)', 'Oral tablets and syrups for systemic use', 'Intravenous/intramuscular injection'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Sertraline HCl', slug: 'sertraline-hcl', cas: '79617-96-2', grade: 'USP', category: 'CNS',
    molecularFormula: 'C₁₇H₁₇Cl₂N·HCl', molecularWeight: '342.70 g/mol', purity: '≥99.0%',
    appearance: 'Off-white to light yellow crystalline powder', storageConditions: 'Store at 20–25°C, protect from moisture',
    description: 'Sertraline Hydrochloride is a selective serotonin reuptake inhibitor (SSRI) antidepressant used for major depressive disorder, obsessive-compulsive disorder, panic disorder, PTSD, and social anxiety disorder. The hydrochloride salt provides improved stability and solubility for oral formulations.',
    applications: ['Antidepressant tablets and film-coated tablets (25 mg, 50 mg, 100 mg)', 'OCD and panic disorder management', 'PTSD treatment', 'Oral concentrate solution (20 mg/mL)', 'Paediatric liquid formulations'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Sildenafil Citrate', slug: 'sildenafil-citrate', cas: '171599-83-0', grade: 'USP', category: 'Cardiovascular',
    molecularFormula: 'C₂₂H₃₀N₆O₄S·C₆H₈O₇', molecularWeight: '666.70 g/mol', purity: '≥99.0%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 20–25°C, protect from moisture and light',
    description: 'Sildenafil Citrate is a phosphodiesterase type 5 (PDE5) inhibitor used for erectile dysfunction and pulmonary arterial hypertension. It enhances the effect of nitric oxide on smooth muscle relaxation and vasodilation. Supplied as the citrate salt for improved aqueous solubility in tablet and oral suspension formulations.',
    applications: ['Erectile dysfunction tablets (25 mg, 50 mg, 100 mg)', 'Pulmonary arterial hypertension treatment (PAH)', 'Oral suspension for paediatric PAH', 'Fixed-dose revatio® tablet formulations'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'TDS'],
  },
  {
    name: 'Simvastatin', slug: 'simvastatin', cas: '79902-63-9', grade: 'USP', category: 'Cardiovascular',
    molecularFormula: 'C₂₅H₃₈O₅', molecularWeight: '418.57 g/mol', purity: '≥98.0%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 5–30°C, protect from moisture',
    description: 'Simvastatin is a semisynthetic HMG-CoA reductase inhibitor derived from lovastatin. It reduces LDL cholesterol, total cholesterol, and triglycerides, and is used for primary and secondary prevention of cardiovascular disease. As a prodrug (lactone form), it is converted to its active hydroxy acid form in the liver.',
    applications: ['Lipid-lowering tablets (5 mg, 10 mg, 20 mg, 40 mg, 80 mg)', 'Primary and secondary cardiovascular prevention', 'Familial hypercholesterolaemia', 'Fixed-dose combinations with ezetimibe'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Tamoxifen Citrate', slug: 'tamoxifen-citrate', cas: '54965-24-1', grade: 'BP/EP', category: 'Oncology',
    molecularFormula: 'C₂₆H₂₉NO·C₆H₈O₇', molecularWeight: '563.64 g/mol', purity: '≥98.5%',
    appearance: 'White to off-white crystalline powder', storageConditions: 'Store at 20–25°C, protect from light',
    description: 'Tamoxifen Citrate is a selective estrogen receptor modulator (SERM) used as adjuvant therapy in hormone receptor-positive breast cancer. It competitively inhibits estrogen binding in breast tissue while exhibiting partial agonist activity in other tissues. Supplied as the citrate salt for oral tablet formulations.',
    applications: ['Adjuvant breast cancer treatment tablets (10 mg, 20 mg)', 'Breast cancer prevention in high-risk women', 'Ductal carcinoma in situ (DCIS) treatment', 'Infertility treatment (off-label)', 'Gynecomastia management (off-label)'],
    packaging: [{ size: '100 g', type: 'Amber glass bottle' }, { size: '500 g', type: 'HDPE drum' }, { size: '1 kg', type: 'HDPE drum' }],
    documents: ['COA', 'MSDS', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Valsartan', slug: 'valsartan', cas: '137862-53-4', grade: 'USP/EP', category: 'Cardiovascular',
    molecularFormula: 'C₂₄H₂₉N₅O₃', molecularWeight: '435.52 g/mol', purity: '≥99.0%',
    appearance: 'White to off-white powder', storageConditions: 'Store at 20–25°C, protect from moisture',
    description: 'Valsartan is an angiotensin II receptor blocker (ARB) of the AT₁ receptor subtype. It is used for hypertension, heart failure (HFrEF), and post-myocardial infarction management. As a non-peptide, non-competitive antagonist, it provides long-lasting blood pressure control with once-daily dosing.',
    applications: ['Antihypertensive tablets (40 mg, 80 mg, 160 mg, 320 mg)', 'Heart failure management (40–160 mg twice daily)', 'Post-MI cardiac protection', 'Fixed-dose combinations with sacubitril (entresto)', 'Fixed-dose combinations with HCT'],
    packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }, { size: '5 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'DMF', 'CEP/COS', 'TDS'],
  },
  {
    name: 'Vitamin C (Ascorbic Acid)', slug: 'vitamin-c-ascorbic-acid', cas: '50-81-7', grade: 'USP/BP', category: 'Vitamin',
    molecularFormula: 'C₆H₈O₆', molecularWeight: '176.12 g/mol', purity: '≥99.0%',
    appearance: 'White to almost white crystalline powder', storageConditions: 'Store at 15–25°C, protect from light and moisture',
    description: 'Ascorbic Acid (Vitamin C) is an essential water-soluble vitamin and antioxidant. In pharmaceutical applications, it is used as an active ingredient in vitamin supplements and as an antioxidant excipient. Meets USP and BP specifications for pharmaceutical and food supplement use. Available in fine powder and granular forms.',
    applications: ['Vitamin C tablets and chewable tablets (500 mg, 1000 mg)', 'Effervescent tablet and sachet formulations', 'Parenteral (IV/IM) injection', 'Antioxidant in injectable formulations', 'Nutritional supplement capsules', 'Combined multivitamin preparations'],
    packaging: [{ size: '25 kg', type: 'Double polyethylene bag in fibre drum' }, { size: '50 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'TDS'],
  },
  {
    name: 'Zinc Sulfate Heptahydrate', slug: 'zinc-sulfate-heptahydrate', cas: '7446-20-0', grade: 'USP', category: 'Supplement',
    molecularFormula: 'ZnSO₄·7H₂O', molecularWeight: '287.56 g/mol', purity: '≥99.5%',
    appearance: 'Colourless crystalline solid', storageConditions: 'Store at 15–25°C, protect from moisture',
    description: 'Zinc Sulfate Heptahydrate is a zinc supplementation agent used pharmaceutically for zinc deficiency and as an astringent/antiseptic. USP-grade material is suitable for oral syrup, tablet, and injection formulations. Also used as a fertiliser-grade nutrient supplement and in topical ophthalmic preparations.',
    applications: ['Oral zinc supplement syrup and tablets', 'Zinc ophthalmic solution (0.25%)', 'IV zinc replacement therapy', 'Combined oral rehydration supplements', 'Wound care and antiseptic preparations'],
    packaging: [{ size: '5 kg', type: 'HDPE drum' }, { size: '25 kg', type: 'Fibre drum' }],
    documents: ['COA', 'MSDS', 'TDS'],
  },
]

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

function defaultDetail(name: string, cas: string, grade: string, category: string): Omit<ProductDetail, 'name' | 'slug' | 'cas' | 'grade' | 'category'> {
  return {
    purity: grade.includes('HPLC') ? '≥99.9%' : grade.includes('AR') ? '≥99.5%' : '≥98.0%',
    appearance: 'White to off-white powder or crystalline solid',
    storageConditions: 'Store at 15–25°C in a dry place, protected from light and moisture',
    description: `${name} is a premium-quality product supplied in ${grade} grade. Manufactured and tested to rigorous quality standards; Certificate of Analysis, MSDS, and Technical Data Sheet are available with every shipment. Suitable for pharmaceutical, nutraceutical, food, or industrial applications as applicable to its grade specification.`,
    applications: [
      'Pharmaceutical formulation and drug development',
      'Research and analytical chemistry',
      'Quality control and method validation',
      'Industrial process chemistry',
    ],
    packaging: [
      { size: '500 g', type: 'HDPE bottle' },
      { size: '1 kg',  type: 'HDPE drum'  },
      { size: '5 kg',  type: 'Fibre drum' },
      { size: '25 kg', type: 'Fibre drum' },
    ],
    documents: ['COA', 'MSDS', 'TDS'],
  }
}

function makeSimple(
  name: string, cas: string, grade: string, category: string,
  extras: Partial<ProductDetail> = {}
): ProductDetail {
  return { name, slug: toSlug(name), cas, grade, category, ...defaultDetail(name, cas, grade, category), ...extras }
}

/**
 * Merge a hand-written detailed array with a listing-style array. Listings
 * that already have a matching slug in `detailed` are skipped; the rest are
 * generated via makeSimple so every listed product gets a working detail
 * page.
 */
type ListingShape = { name: string; cas?: string; grade?: string; category?: string; type?: string; api?: string; use?: string }
function mergeListing(
  detailed: ProductDetail[],
  listing: ListingShape[],
  defaultGrade = 'Pharma Grade',
  defaultCategory = 'Specialty Chemical',
): ProductDetail[] {
  const seen = new Set(detailed.map(p => p.slug))
  const extras = listing
    .filter(item => !seen.has(toSlug(item.name)))
    .map(item => makeSimple(
      item.name,
      item.cas ?? '—',
      item.grade ?? defaultGrade,
      item.category ?? item.type ?? item.api ?? item.use ?? defaultCategory,
    ))
  return [...detailed, ...extras]
}

/* ─── Food Chemicals ─────────────────────────────────────────────────────── */

const foodChemicalProducts: ProductDetail[] = [
  { name: 'Acesulfame Potassium (Ace-K)', slug: 'acesulfame-potassium', cas: '55589-62-3', grade: 'Food Grade', category: 'Sweetener', molecularFormula: 'C₄H₄KNO₄S', molecularWeight: '201.24 g/mol', purity: '≥99.0%', appearance: 'White crystalline powder', storageConditions: 'Store at 20–25°C, dry place', description: 'Acesulfame Potassium (Ace-K, E950) is a calorie-free synthetic sweetener approximately 200× sweeter than sucrose. It has excellent heat and pH stability, making it ideal for baked goods, beverages, and dairy products. Often blended with aspartame or sucralose to mask the slight bitter aftertaste.', applications: ['Zero-calorie beverages and soft drinks', 'Tabletop sweetener sachets', 'Baked goods and confectionery', 'Dairy products and ice cream', 'Pharmaceutical syrup formulations'], packaging: [{ size: '25 kg', type: 'Fibre drum' }], documents: ['COA', 'MSDS', 'FSSAI', 'TDS'] },
  { name: 'Citric Acid Anhydrous', slug: 'citric-acid-anhydrous', cas: '77-92-9', grade: 'Food Grade', category: 'Acidulant', molecularFormula: 'C₆H₈O₇', molecularWeight: '192.12 g/mol', purity: '≥99.5%', appearance: 'White crystalline granules or powder', storageConditions: 'Store at 20–25°C, dry conditions', description: 'Citric Acid Anhydrous (E330) is the most widely used food acidulant worldwide, providing a tart flavour and acting as a natural preservative and antioxidant synergist. It is derived from fermentation of glucose by Aspergillus niger. Meets food grade, pharmaceutical BP/USP, and Codex Alimentarius standards.', applications: ['Beverages and carbonated drinks', 'Confectionery and candy', 'Preserves and jams', 'Effervescent tablet formulations', 'Cleaning and descaling products'], packaging: [{ size: '25 kg', type: 'Poly woven bag' }, { size: '50 kg', type: 'Poly woven bag' }], documents: ['COA', 'MSDS', 'FSSAI', 'TDS'] },
  { name: 'Potassium Sorbate', slug: 'potassium-sorbate', cas: '24634-61-5', grade: 'Food Grade', category: 'Preservative', molecularFormula: 'C₆H₇KO₂', molecularWeight: '150.22 g/mol', purity: '≥99.0%', appearance: 'White crystalline powder or granules', storageConditions: 'Store in dry conditions, avoid direct sunlight', description: 'Potassium Sorbate (E202) is the most widely used food preservative globally. It inhibits the growth of moulds, yeasts, and some bacteria by disrupting cellular membrane function and enzyme activity. It is soluble in water, odourless at normal use concentrations, and effective at pH up to 6.5.', applications: ['Bread and bakery products', 'Cheese and dairy products', 'Wine and beverages', 'Dried fruits and vegetable products', 'Personal care and cosmetic products'], packaging: [{ size: '25 kg', type: 'Poly woven bag' }], documents: ['COA', 'MSDS', 'FSSAI', 'TDS'] },
  { name: 'Sodium Benzoate', slug: 'sodium-benzoate', cas: '532-32-1', grade: 'Food Grade', category: 'Preservative', molecularFormula: 'C₇H₅NaO₂', molecularWeight: '144.11 g/mol', purity: '≥99.0%', appearance: 'White crystalline granules or powder', storageConditions: 'Store in dry, cool place', description: 'Sodium Benzoate (E211) is a widely used antimicrobial preservative that is effective in acidic foods (pH < 4.5) where it converts to benzoic acid, the active inhibitory form. It is effective against bacteria, yeasts, and moulds, and is highly water-soluble for ease of incorporation into liquid formulations.', applications: ['Soft drinks and carbonated beverages', 'Fruit juices and cordials', 'Pickles and condiments', 'Pharmaceutical syrups and suspensions', 'Personal care products'], packaging: [{ size: '25 kg', type: 'Poly woven bag' }], documents: ['COA', 'MSDS', 'FSSAI', 'TDS'] },
  { name: 'Xanthan Gum', slug: 'xanthan-gum', cas: '11138-66-2', grade: 'Food Grade', category: 'Hydrocolloid', purity: '≥91.0%', appearance: 'Cream to white free-flowing powder', storageConditions: 'Store at 20–25°C, cool and dry place', description: 'Xanthan Gum (E415) is a polysaccharide biopolymer produced by fermentation of glucose or sucrose by Xanthomonas campestris bacteria. It is an exceptionally effective thickener, stabiliser, and suspending agent with excellent pseudoplastic (shear-thinning) behaviour. Soluble in both hot and cold water.', applications: ['Salad dressings and sauces', 'Dairy products and ice cream', 'Gluten-free bakery products', 'Pharmaceutical suspensions', 'Oil field drilling fluids', 'Personal care thickeners'], packaging: [{ size: '25 kg', type: 'Fibre drum' }], documents: ['COA', 'MSDS', 'FSSAI', 'TDS'] },
  { name: 'Sucralose', slug: 'sucralose', cas: '56038-13-2', grade: 'Food Grade', category: 'Sweetener', molecularFormula: 'C₁₂H₁₉Cl₃O₈', molecularWeight: '397.64 g/mol', purity: '≥98.0%', appearance: 'White crystalline powder', storageConditions: 'Store at 20–25°C, away from moisture', description: 'Sucralose (E955) is a high-intensity non-caloric sweetener derived from sucrose by selective chlorination. It is approximately 600× sweeter than sucrose with excellent stability across wide pH and temperature ranges, making it ideal for heat-processed and baked foods. Unlike aspartame, sucralose does not break down at high temperatures.', applications: ['Baked goods and confectionery', 'Tabletop sweetener', 'Diet beverages and sports drinks', 'Pharmaceutical oral solutions and syrups', 'Nutraceutical formulations'], packaging: [{ size: '25 kg', type: 'Fibre drum' }], documents: ['COA', 'MSDS', 'FSSAI', 'TDS'] },
]

/* ─── Nutraceuticals ─────────────────────────────────────────────────────── */

export const nutraceuticalProducts: ProductDetail[] = [
  { name: 'Vitamin D3 (Cholecalciferol)', slug: 'vitamin-d3-cholecalciferol', cas: '67-97-0', grade: 'USP', category: 'Fat-Soluble Vitamin', molecularFormula: 'C₂₇H₄₄O', molecularWeight: '384.64 g/mol', purity: '≥97.0% (100,000 IU/g)', appearance: 'White to off-white crystalline powder', storageConditions: 'Store at −20°C to −15°C under nitrogen, protect from light', description: 'Cholecalciferol (Vitamin D3) is the natural form of vitamin D synthesised in skin on UV light exposure. It is used for vitamin D deficiency prevention and treatment, calcium metabolism support, and immune function. Available in oil-based solutions, dry powder, and emulsified forms for various dosage forms.', applications: ['Vitamin D supplement tablets and capsules (400–5000 IU)', 'Fortification of milk and dairy products', 'Combined calcium+D3 tablets', 'Paediatric drops and syrups', 'Injectable formulations for severe deficiency'], packaging: [{ size: '100 g', type: 'Amber glass bottle' }, { size: '500 g', type: 'HDPE drum under nitrogen' }], documents: ['COA', 'MSDS', 'TDS'] },
  { name: 'Coenzyme Q10 (Ubiquinone)', slug: 'coenzyme-q10', cas: '303-98-0', grade: 'Pharma Grade', category: 'Coenzyme', molecularFormula: 'C₅₉H₉₀O₄', molecularWeight: '863.34 g/mol', purity: '≥98.0%', appearance: 'Orange-yellow crystalline powder', storageConditions: 'Store at 15–25°C, protect from light and oxygen', description: 'Coenzyme Q10 (CoQ10, Ubiquinone) is a fat-soluble antioxidant essential for mitochondrial electron transport chain function and cellular energy production. It is used as a nutraceutical for cardiovascular support, statin-induced myopathy management, and anti-ageing applications. High-purity pharmaceutical grade available.', applications: ['Cardiovascular health softgel capsules', 'Statin-associated myopathy supplementation', 'Anti-ageing formulations', 'Sports nutrition and energy products', 'Oral emulsion and suspension formulations'], packaging: [{ size: '500 g', type: 'Amber glass bottle' }, { size: '1 kg', type: 'HDPE drum' }], documents: ['COA', 'MSDS', 'TDS'] },
  { name: 'L-Glutamine', slug: 'l-glutamine', cas: '56-85-9', grade: 'USP', category: 'Amino Acid', molecularFormula: 'C₅H₁₀N₂O₃', molecularWeight: '146.15 g/mol', purity: '≥99.5%', appearance: 'White crystalline powder', storageConditions: 'Store at 15–25°C, dry conditions', description: 'L-Glutamine is the most abundant free amino acid in the human body and a conditionally essential amino acid. It serves as a primary fuel source for intestinal cells, lymphocytes, and rapidly dividing cells. Widely used in clinical nutrition (parenteral and enteral), sports nutrition, and gut health supplements.', applications: ['Clinical/medical nutrition (enteral & parenteral)', 'Sports and post-workout recovery supplements', 'Gut health and leaky gut formulations', 'Wound healing and critical care nutrition', 'Protein powder blends'], packaging: [{ size: '25 kg', type: 'Fibre drum' }], documents: ['COA', 'MSDS', 'TDS'] },
]

/* ─── Excipients ─────────────────────────────────────────────────────────── */

export const excipientProducts: ProductDetail[] = [
  { name: 'Microcrystalline Cellulose (MCC) PH 101', slug: 'microcrystalline-cellulose-ph-101', cas: '9004-34-6', grade: 'NF/EP', category: 'Diluent/Binder', purity: '≥97.0% (as dried)', appearance: 'White, free-flowing powder', storageConditions: 'Store at 15–25°C, protect from moisture', description: 'Microcrystalline Cellulose (MCC) PH 101 is a purified, partially depolymerised cellulose used extensively as a direct compression diluent and dry binder in pharmaceutical tablet manufacturing. PH 101 is a fine-particle grade (average particle size ~50 µm) with excellent compressibility and flow properties, ideal for wet and dry granulation and direct compression.', applications: ['Direct compression tablet filler/binder', 'Wet and dry granulation binder', 'MCC pellet starter cores (non-pareils)', 'Controlled-release matrix tablets', 'Herbal and nutraceutical tablet compression'], packaging: [{ size: '25 kg', type: 'Poly bag in fibre drum' }], documents: ['COA', 'MSDS', 'TDS'] },
  { name: 'Hydroxypropyl Methylcellulose (HPMC) K4M', slug: 'hpmc-k4m', cas: '9004-65-3', grade: 'USP/EP', category: 'Matrix Former/Film Coat', purity: '≥98.0%', appearance: 'White to off-white powder', storageConditions: 'Store at 15–30°C, low humidity', description: 'Hydroxypropyl Methylcellulose (HPMC / Hypromellose) K4M is a hydrophilic cellulose ether widely used as a matrix former in extended-release tablet formulations, viscosity builder in oral liquids, and film-coating polymer. K4M indicates 4000 mPa·s nominal viscosity (2% aqueous solution). Forms a gel barrier controlling drug release.', applications: ['Extended-release hydrophilic matrix tablets', 'Ophthalmic artificial tears and viscosity agent', 'Film coating for tablets and pellets', 'Suspending agent in oral liquid formulations', 'Controlled-release capsule filling'], packaging: [{ size: '25 kg', type: 'Fibre drum' }], documents: ['COA', 'MSDS', 'TDS'] },
  { name: 'Polyvinylpyrrolidone (PVP) K30', slug: 'pvp-k30', cas: '9003-39-8', grade: 'USP/EP', category: 'Binder', purity: '≥98.0%', appearance: 'White to slightly yellow amorphous powder', storageConditions: 'Store at 15–25°C, dry conditions (hygroscopic)', description: 'Polyvinylpyrrolidone (Povidone) K30 is a synthetic water-soluble polymer widely used as a wet granulation binder in tablet and capsule manufacturing. The "K30" designation refers to Fikentscher K-value of approximately 30 (MW ~40,000). It provides excellent binding action, improves tablet hardness, and acts as a solubiliser for BCS class II drugs.', applications: ['Wet granulation binder for tablets and capsules', 'Co-precipitation/solid dispersion with poorly soluble drugs', 'Film-coating subcoat layer', 'Ophthalmic and contact lens solutions', 'Injectable formulations (plasma expander)'], packaging: [{ size: '25 kg', type: 'Fibre drum' }], documents: ['COA', 'MSDS', 'TDS'] },
]

/* ─── Organic / Inorganic (Lab Chemicals) ─────────────────────────────────── */

const organoInorganicDefaults = (name: string, cas: string, grade: string, type: string): ProductDetail => ({
  name, slug: toSlug(name),
  cas, grade, category: type === 'Organic' ? 'Organic Solvent/Reagent' : 'Inorganic Salt/Reagent', type,
  ...defaultDetail(name, cas, grade, type),
})

export const organicInorganicProducts: ProductDetail[] = [
  { ...organoInorganicDefaults('Acetic Anhydride', '108-24-7', 'AR', 'Organic'), molecularFormula: '(CH₃CO)₂O', molecularWeight: '102.09 g/mol', purity: '≥99.0%', appearance: 'Colourless liquid with pungent odour', description: 'Acetic Anhydride AR grade is used as an acetylating reagent in organic synthesis, pharmaceutical manufacturing (aspirin synthesis), and analytical chemistry. Reacts with hydroxyl and amino groups to form esters and amides. Handle with care — corrosive and moisture-sensitive.' },
  { ...organoInorganicDefaults('Acetonitrile (HPLC)', '75-05-8', 'HPLC', 'Organic'), molecularFormula: 'CH₃CN', molecularWeight: '41.05 g/mol', purity: '≥99.9%', appearance: 'Colourless liquid', description: 'Acetonitrile HPLC Grade is a polar aprotic solvent with low UV absorbance cutoff (~190 nm), making it ideal as a mobile phase for reverse-phase HPLC, LC-MS, and related analytical techniques. Supplied with low water content (<50 ppm) and certificate of UV/MS suitability.' },
  { ...organoInorganicDefaults('Silver Nitrate', '7761-88-8', 'AR', 'Inorganic'), molecularFormula: 'AgNO₃', molecularWeight: '169.87 g/mol', purity: '≥99.8%', appearance: 'Colourless crystalline solid', description: 'Silver Nitrate AR grade is a versatile inorganic oxidising agent and silver salt used in analytical chemistry (Volhard titration, halide precipitation), photographic chemicals, histological staining, antimicrobial wound care preparations, and as a cauterising agent. Store in amber glass, away from organic material.' },
]

/* ─── Detailed entries kept for richer copy on key products ───────────────── */

const intermediateDetailed: ProductDetail[] = [
  makeSimple('4-Aminoacetophenone', '99-92-3', 'AR', 'Pharmaceutical Intermediate', { molecularFormula: 'C₈H₉NO', molecularWeight: '135.17 g/mol', purity: '≥98.0%' }),
  makeSimple('4-Chlorobenzaldehyde', '104-88-1', 'LR', 'Pharmaceutical Intermediate', { molecularFormula: 'C₇H₅ClO', molecularWeight: '140.57 g/mol', purity: '≥98.0%' }),
  makeSimple('2-Amino-5-nitrothiazole', '121-66-4', 'LR', 'Pharmaceutical Intermediate'),
  makeSimple('Benzyl Chloride', '100-44-7', 'LR', 'Pharmaceutical Intermediate', { molecularFormula: 'C₇H₇Cl', molecularWeight: '126.58 g/mol', purity: '≥99.0%' }),
  makeSimple('N-Bromosuccinimide (NBS)', '128-08-5', 'AR', 'Brominating Reagent', { molecularFormula: 'C₄H₄BrNO₂', molecularWeight: '177.99 g/mol', purity: '≥99.0%' }),
  makeSimple('2-Chloro-4-nitroaniline', '121-87-9', 'LR', 'Dye Intermediate'),
  makeSimple('Dimethyl Sulfoxide (DMSO)', '67-68-5', 'AR', 'Solvent/Reagent', { molecularFormula: 'C₂H₆OS', molecularWeight: '78.13 g/mol', purity: '≥99.8%' }),
  makeSimple('Ethyl Acetate', '141-78-6', 'AR', 'Solvent', { molecularFormula: 'C₄H₈O₂', molecularWeight: '88.11 g/mol', purity: '≥99.5%' }),
  makeSimple('Glycine', '56-40-6', 'USP', 'Amino Acid / Pharmaceutical Intermediate', { molecularFormula: 'C₂H₅NO₂', molecularWeight: '75.03 g/mol', purity: '≥99.5%' }),
  makeSimple('Imidazole', '288-32-4', 'AR', 'Pharmaceutical Intermediate', { molecularFormula: 'C₃H₄N₂', molecularWeight: '68.08 g/mol', purity: '≥99.0%' }),
  makeSimple('Isopropanol (IPA)', '67-63-0', 'AR', 'Solvent', { molecularFormula: 'C₃H₈O', molecularWeight: '60.10 g/mol', purity: '≥99.8%' }),
  makeSimple('Malononitrile', '109-77-3', 'AR', 'Pharmaceutical Intermediate', { molecularFormula: 'C₃H₂N₂', molecularWeight: '66.06 g/mol', purity: '≥99.0%' }),
  makeSimple('o-Phenylenediamine', '95-54-5', 'AR', 'Pharmaceutical Intermediate'),
  makeSimple('Piperazine Anhydrous', '110-85-0', 'USP', 'Pharmaceutical Intermediate', { molecularFormula: 'C₄H₁₀N₂', molecularWeight: '86.14 g/mol', purity: '≥99.0%' }),
  makeSimple('p-Toluenesulfonamide', '70-55-3', 'LR', 'Pharmaceutical Intermediate'),
  makeSimple('Sodium Azide', '26628-22-8', 'AR', 'Reagent', { molecularFormula: 'NaN₃', molecularWeight: '65.01 g/mol', purity: '≥99.5%' }),
  makeSimple('Thionyl Chloride', '7719-09-7', 'LR', 'Pharmaceutical Intermediate', { molecularFormula: 'SOCl₂', molecularWeight: '118.97 g/mol', purity: '≥97.0%' }),
  makeSimple('Trimethylsilyl Chloride (TMCS)', '75-77-4', 'AR', 'Protecting Reagent', { molecularFormula: 'C₃H₉ClSi', molecularWeight: '108.64 g/mol', purity: '≥98.0%' }),
]

const industrialDetailed: ProductDetail[] = [
  makeSimple('Acetic Acid (Glacial)', '64-19-7', 'Industrial', 'Organic Acid', { molecularFormula: 'CH₃COOH', molecularWeight: '60.05 g/mol', purity: '≥99.5%' }),
  makeSimple('Acetone', '67-64-1', 'Industrial', 'Ketone Solvent', { molecularFormula: 'C₃H₆O', molecularWeight: '58.08 g/mol', purity: '≥99.5%' }),
  makeSimple('Caustic Soda (NaOH) Flakes', '1310-73-2', 'Industrial', 'Strong Base', { molecularFormula: 'NaOH', molecularWeight: '40.00 g/mol', purity: '≥98.0%' }),
  makeSimple('Chloroform', '67-66-3', 'Industrial/LR', 'Chlorinated Solvent', { molecularFormula: 'CHCl₃', molecularWeight: '119.38 g/mol', purity: '≥99.0%' }),
  makeSimple('Ethanol 95%', '64-17-5', 'Industrial', 'Alcohol Solvent', { molecularFormula: 'C₂H₅OH', molecularWeight: '46.07 g/mol', purity: '95% v/v' }),
  makeSimple('Formaldehyde Solution 37%', '50-00-0', 'Industrial', 'Aldehyde', { molecularFormula: 'CH₂O', molecularWeight: '30.03 g/mol', purity: '37% w/v (formalin)' }),
  makeSimple('Hydrochloric Acid 33%', '7647-01-0', 'Industrial', 'Mineral Acid', { molecularFormula: 'HCl', molecularWeight: '36.46 g/mol', purity: '33–35% w/w' }),
  makeSimple('Hydrogen Peroxide 50%', '7722-84-1', 'Industrial', 'Oxidising Agent', { molecularFormula: 'H₂O₂', molecularWeight: '34.01 g/mol', purity: '50% w/w' }),
  makeSimple('Methanol', '67-56-1', 'Industrial', 'Alcohol Solvent', { molecularFormula: 'CH₃OH', molecularWeight: '32.04 g/mol', purity: '≥99.8%' }),
  makeSimple('Nitric Acid 68%', '7697-37-2', 'Industrial', 'Mineral Acid', { molecularFormula: 'HNO₃', molecularWeight: '63.01 g/mol', purity: '68% w/w' }),
  makeSimple('Potassium Hydroxide (KOH) Flakes', '1310-58-3', 'Industrial', 'Strong Base', { molecularFormula: 'KOH', molecularWeight: '56.11 g/mol', purity: '≥90.0%' }),
  makeSimple('Sodium Hydroxide Pellets', '1310-73-2', 'Industrial', 'Strong Base', { molecularFormula: 'NaOH', molecularWeight: '40.00 g/mol', purity: '≥98.0%' }),
  makeSimple('Sulfuric Acid 98%', '7664-93-9', 'Industrial', 'Mineral Acid', { molecularFormula: 'H₂SO₄', molecularWeight: '98.08 g/mol', purity: '≥98.0%' }),
  makeSimple('Toluene', '108-88-3', 'Industrial', 'Aromatic Solvent', { molecularFormula: 'C₇H₈', molecularWeight: '92.14 g/mol', purity: '≥99.5%' }),
]

const herbalDetailed: ProductDetail[] = [
  makeSimple('Ashwagandha Root Extract 5%', '—', 'Pharma Grade', 'Adaptogen', { description: 'Ashwagandha (Withania somnifera) root extract standardised to ≥5% withanolides by HPLC. Used in stress management, adaptogen, and men\'s health formulations. Available as fine powder for capsule and tablet use.' }),
  makeSimple('Boswellia Serrata Extract 65%', '—', 'Pharma Grade', 'Anti-inflammatory', { description: 'Boswellia Serrata dry extract standardised to ≥65% total boswellic acids, including ≥30% AKBA (3-O-acetyl-11-keto-beta-boswellic acid) by HPLC. Used for joint health, inflammatory bowel conditions, and arthritis management.' }),
  makeSimple('Curcumin 95% (Turmeric Extract)', '458-37-7', 'Pharma Grade', 'Antioxidant/Anti-inflammatory', { molecularFormula: 'C₂₁H₂₀O₆', molecularWeight: '368.38 g/mol', purity: '≥95.0% curcuminoids', description: 'Curcumin Extract standardised to ≥95% curcuminoids (curcumin, bisdemethoxycurcumin, demethoxycurcumin) by HPLC from Curcuma longa rhizome. Wide applications in anti-inflammatory, antioxidant, and joint health supplements.' }),
  makeSimple('Green Tea Extract 98% EGCG', '989-51-5', 'Pharma Grade', 'Antioxidant', { purity: '≥98% EGCG', description: 'Green Tea Leaf Extract standardised to ≥98% Epigallocatechin Gallate (EGCG) by HPLC. Potent antioxidant used in weight management, cardiovascular health, and anti-ageing nutraceutical formulations.' }),
  makeSimple('Milk Thistle Extract 80%', '84604-20-6', 'Pharma Grade', 'Hepatoprotective', { purity: '≥80% silymarin', description: 'Milk Thistle (Silybum marianum) fruit extract standardised to ≥80% silymarin (silybinin, silydianin, silychristin) by spectrophotometry. Used for liver health, hepatoprotection, and as adjuvant therapy in liver disease management.' }),
  makeSimple('Senna Leaf Extract 20%', '—', 'Pharma Grade', 'Laxative', { description: 'Senna Alexandrina leaf extract standardised to ≥20% total sennosides (as sennoside B) by HPLC. Used as an active ingredient in laxative tablet and syrup formulations.' }),
  makeSimple('Valerian Root Extract 0.8% Valerenic Acid', '—', 'Pharma Grade', 'Sedative/Sleep Aid', { description: 'Valerian (Valeriana officinalis) root extract standardised to ≥0.8% valerenic acid by HPLC. Used in sleep and relaxation supplement formulations.' }),
]

const dyeDetailed: ProductDetail[] = [
  makeSimple('Acid Red 1', '3734-67-6', 'Commercial', 'Azo Dye', { description: 'Acid Red 1 (C.I. 18050) is a water-soluble azo dye used for dyeing wool, nylon, and silk in the textile industry. Also used as a food colourant (E127 banned in some markets) and in pharmaceutical analytical applications.' }),
  makeSimple('Indigo Carmine', '860-22-0', 'BP Grade', 'Indigoid Dye', { molecularFormula: 'C₁₆H₈N₂Na₂O₈S₂', molecularWeight: '466.35 g/mol', purity: '≥85% dye content', description: 'Indigo Carmine (FD&C Blue No. 2, E132) is a water-soluble blue dye used as a food colourant, diagnostic dye in urology/ophthalmology, and textile dye. Pharmaceutical/BP grade available for injectable diagnostic use.' }),
  makeSimple('Methylene Blue', '61-73-4', 'AR/BP', 'Thiazine Dye', { molecularFormula: 'C₁₆H₁₈ClN₃S·3H₂O', molecularWeight: '373.90 g/mol', purity: '≥82% dye content (AR)', description: 'Methylene Blue is a thiazine dye with wide applications as a biological stain, pharmaceutical diagnostic agent (methemoglobinaemia antidote), and redox indicator. Pharmaceutical grade for IV injection formulations.' }),
  makeSimple('Patent Blue V', '3536-49-0', 'Food Grade', 'Triphenylmethane Dye', { description: 'Patent Blue V (E131) is a synthetic food colourant used in confectionery, beverages, and pharmaceutical coated tablets. Also used as a diagnostic sentinel lymph node dye in breast cancer surgery.' }),
  makeSimple('Sunset Yellow FCF', '2783-94-0', 'Food Grade', 'Azo Dye', { description: 'Sunset Yellow FCF (FD&C Yellow No. 6, E110) is a synthetic azo food colourant providing an orange-yellow colour. Used in confectionery, soft drinks, and pharmaceutical film coatings. Food/cosmetic grade available.' }),
  makeSimple('H-Acid (1-Amino-8-naphthol-3,6-disulfonic acid)', '90-20-0', 'Industrial', 'Dye Intermediate', { description: 'H-Acid is a key naphthalene-based intermediate for the production of azo dyes (particularly reactive dyes like Reactive Red), used in the textile dyeing industry. Also an intermediate for direct and acid dyes.' }),
]

const impurityDetailed: ProductDetail[] = [
  makeSimple('Acetaminophen Related Compound A (p-Aminophenol)', '123-30-8', 'Reference Standard', 'Degradation Impurity', { purity: '≥99.0%', description: 'p-Aminophenol is the primary degradation product and process-related impurity in acetaminophen (paracetamol) synthesis. Certified reference standard for ICH Q3A/Q3B impurity profiling and finished product testing per USP/BP monograph requirements.' }),
  makeSimple('Metformin Impurity A (Cyanoguanidine)', '461-58-5', 'Reference Standard', 'Process Impurity', { molecularFormula: 'C₂H₄N₄', molecularWeight: '84.08 g/mol', purity: '≥99.0%', description: 'Cyanoguanidine (Dicyandiamide) is a process-related impurity arising during metformin synthesis. Required as a reference standard for impurity testing of metformin drug substance and drug product per pharmacopoeial monographs.' }),
  makeSimple('Ciprofloxacin Ethylene Diamine Analogue', '86393-33-1', 'Reference Standard', 'Process Impurity', { purity: '≥95.0%', description: 'Ciprofloxacin-related impurity standard for HPLC identification and quantification per USP monograph related substances test. Supplied with certificate of analysis and complete characterisation data.' }),
  makeSimple('Sildenafil N-Desmethyl Impurity', '139756-02-8', 'Reference Standard', 'Metabolite/Impurity', { purity: '≥95.0%', description: 'N-Desmethylsildenafil is the primary active metabolite and a reportable impurity in sildenafil citrate drug substance. Reference standard for related substances HPLC testing per ICH guidelines.' }),
  makeSimple('Omeprazole Sulfone', '73590-57-5', 'Reference Standard', 'Degradation Impurity', { molecularFormula: 'C₁₇H₁₉N₃O₄S', molecularWeight: '361.41 g/mol', purity: '≥98.0%', description: 'Omeprazole Sulfone is a key degradation product and oxidative impurity of omeprazole. Used as a reference standard for related substances determination in omeprazole drug substance and finished products per USP/EP monographs.' }),
]

const pelletDetailed: ProductDetail[] = [
  makeSimple('MCC Pellets (Cellets 90)', '9004-34-6', 'Pharma Grade', 'Starter Pellets', { description: 'MCC Starter Pellets, Cellets 90 (90–150 µm particle size range) are spherical microcrystalline cellulose non-pareil seeds used as a substrate for drug layering in multi-particulate formulations. High sphericity (aspect ratio >0.9), smooth surface, and excellent mechanical strength ensure uniform drug coating.' }),
  makeSimple('Sugar Pellets (Non-Pareil)', '57-50-1', 'NF', 'Starter Pellets', { description: 'Sugar Spheres (Non-Pareils) are sucrose-based starter pellets used as a drug layering substrate for immediate-release multi-particulate oral dosage forms. Available in 250–500 µm size range. Complies with NF and EP standards for sugar spheres.' }),
  makeSimple('Omeprazole Pellets 8.5%', '73590-58-6', 'Pharma Grade', 'Enteric Coated', { description: 'Omeprazole Enteric-Coated Pellets containing 8.5% w/w omeprazole, coated with Eudragit L30D-55 to provide acid resistance and targeted intestinal release. Suitable for filling into hard gelatin or HPMC capsules for 20 mg and 40 mg omeprazole products.' }),
  makeSimple('Metformin Extended-Release', '1115-70-4', 'Pharma Grade', 'ER Pellets', { description: 'Metformin HCl Extended-Release Pellets containing 500 mg metformin per gram of pellets, with controlled-release polymer coating (Eudragit RS/RL or HPMC). Provides once-daily dosing release profile reducing GI side effects compared to immediate-release tablets.' }),
  makeSimple('Pantoprazole Pellets 8.5%', '138786-67-1', 'Pharma Grade', 'Enteric Coated', { description: 'Pantoprazole Sodium Enteric-Coated Pellets containing 8.5% w/w pantoprazole sodium, coated with enteric polymer for acid resistance. Suitable for capsule filling in 20 mg and 40 mg pantoprazole products per USP/EP specifications.' }),
  makeSimple('Vitamin C SR Pellets', '50-81-7', 'Pharma Grade', 'SR Pellets', { description: 'Vitamin C Sustained-Release Pellets containing Ascorbic Acid with a controlled-release polymer coat, providing extended vitamin C release over 8–12 hours. Suitable for 500 mg SR capsule formulations reducing GI irritation associated with high-dose ascorbic acid.' }),
  makeSimple('Ambroxol Hydrochloride SR Pellets 40% w/w', '23828-92-4', 'Pharma Grade', 'SR Pellets', {
    molecularFormula: 'C₁₃H₁₈Br₂N₂O·HCl',
    molecularWeight: '414.56 g/mol',
    purity: '40% w/w drug loading',
    appearance: 'Off-white to pale-yellow spherical pellets',
    description: 'Ambroxol Hydrochloride Sustained-Release Pellets at 40% w/w drug loading, designed for capsule filling in once- and twice-daily mucolytic formulations. The pellets combine an MCC starter core, drug-layering with HPMC binder, and a Eudragit RS/RL sustained-release coat to deliver a controlled 12-hour release profile. Manufactured under cGMP with full release-rate characterisation (USP Apparatus 1, basket).',
    applications: ['Once-daily Ambroxol SR capsules (75 mg)', 'Twice-daily Ambroxol SR formulations', 'Combination cough/expectorant capsule fills', 'Paediatric multi-particulate sprinkle formulations'],
    packaging: [{ size: '5 kg', type: 'Aluminium-laminate bag in fibre drum' }, { size: '25 kg', type: 'Fibre drum with double polyethylene liner' }],
    documents: ['COA', 'MSDS', 'TDS', 'DMF'],
  }),
]

/* ─── All products map (category slug → product list) ─────────────────────── */

export const allProductsByCategory: Record<string, ProductDetail[]> = {
  apis:                     mergeListing(apiProducts,            apiListing,            'USP',                    'Active Pharmaceutical Ingredient'),
  intermediates:            mergeListing(intermediateDetailed,    intermediatesListing,  'AR',                     'Pharmaceutical Intermediate'),
  'industrial-chemicals':   mergeListing(industrialDetailed,      industrialListing,     'Industrial',             'Industrial Chemical'),
  excipients:               mergeListing(excipientProducts,       excipientListing,      'USP/NF',                 'Pharmaceutical Excipient'),
  'herbal-extracts':        mergeListing(herbalDetailed,          herbalListing,         'Pharma Grade',           'Herbal Extract'),
  nutraceuticals:           mergeListing(nutraceuticalProducts,   nutraceuticalListing,  'USP',                    'Nutraceutical'),
  'food-chemicals':         mergeListing(foodChemicalProducts,    foodListing,           'Food Grade',             'Food Additive'),
  'dyes-and-intermediates': mergeListing(dyeDetailed,             dyeListing,            'Commercial',             'Dye / Colourant'),
  impurities:               mergeListing(impurityDetailed,        impurityListing,       'Reference Standard',     'Reference Standard'),
  'organic-inorganic':      mergeListing(organicInorganicProducts,[...organicListing, ...inorganicListing], 'AR', 'Lab Chemical'),
  pellets:                  mergeListing(pelletDetailed,          pelletListing,         'Pharma Grade',           'Pellet System'),
}
