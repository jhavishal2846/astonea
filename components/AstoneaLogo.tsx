import Image from 'next/image'

type AstoneaLogoProps = {
  className?: string
  priority?: boolean
}

/**
 * Astonea brand wordmark — the official PDF logo traced to SVG.
 * Colors are baked in (brand blue + gold arc) and must not be overridden.
 */
export default function AstoneaLogo({ className, priority }: AstoneaLogoProps) {
  return (
    <Image
      src="/astonea-logo.svg"
      alt="Astonea"
      width={240}
      height={68}
      priority={priority}
      className={className}
    />
  )
}
