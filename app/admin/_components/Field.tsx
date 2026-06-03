export function Field({
  label,
  required,
  help,
  htmlFor,
  children,
}: {
  label: string
  required?: boolean
  help?: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-rose-600 ml-1">*</span>}
      </label>
      {children}
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </div>
  )
}

export const inputClass =
  'w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 ' +
  'focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all'

export const selectClass = inputClass + ' appearance-none bg-no-repeat bg-[right_0.7rem_center] ' +
  "bg-[length:1rem_1rem] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%2364748b%22><path fill-rule=%22evenodd%22 d=%22M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z%22 clip-rule=%22evenodd%22/></svg>')] " +
  'pr-9'

export const textareaClass = inputClass + ' resize-y min-h-[5rem]'
