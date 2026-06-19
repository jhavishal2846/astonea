import 'server-only'
import { getBlockDescriptor } from '@/lib/cms/blocks'
import type { ResolvedBlock } from '@/lib/cms/pages'

/**
 * Render a list of resolved blocks. Each block is parsed through its
 * registered Zod schema so we always pass clean defaults to the component
 * even if the stored props are partial or stale.
 */
export function BlockRenderer({ blocks }: { blocks: ResolvedBlock[] }) {
  return (
    <>
      {blocks.map((b) => {
        const descriptor = getBlockDescriptor(b.blockType)
        if (!descriptor) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`[blocks] unknown block type: ${b.blockType}`)
          }
          return null
        }
        const parsed = descriptor.schema.safeParse({
          ...descriptor.defaults,
          ...b.props,
        })
        const props = parsed.success ? parsed.data : descriptor.defaults
        const Component = descriptor.component
        return <Component key={b.id} props={props} />
      })}
    </>
  )
}
