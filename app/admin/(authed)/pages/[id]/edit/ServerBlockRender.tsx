import 'server-only'
import { getBlockDescriptor } from '@/lib/cms/blocks'

export default function ServerBlockRender({
  blockType,
  props,
}: {
  blockType: string
  props: Record<string, unknown>
}) {
  const descriptor = getBlockDescriptor(blockType)
  if (!descriptor) {
    return (
      <div className="p-6 border-2 border-dashed border-rose-300 bg-rose-50 text-rose-700 text-sm">
        Unknown block type: <span className="font-mono">{blockType}</span>
      </div>
    )
  }
  const parsed = descriptor.schema.safeParse({ ...descriptor.defaults, ...props })
  const data = parsed.success ? parsed.data : descriptor.defaults
  const Component = descriptor.component
  return <Component props={data} />
}
