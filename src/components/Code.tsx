export const availableVariables = [
  'fromName',
  'fromFirstName',
  'toName',
  'fromEmail',
  'toEmail',
  'currentDate',
  'currentTime'
]

function Component({
  children,
  onClick,
  title,
  style,
  errorCondition = false
}: {
  children: React.ReactNode
  onClick?: () => void
  title?: string
  style?: string
  errorCondition?: boolean
}) {
  return (
    <span>
      <code
        className={`tooltip tooltip-bottom text-left text-xs py-1 px-2 rounded-xl cursor-pointer bg-gray-200 hover:bg-gray-300 transition-all ${style} ${
          errorCondition ? 'text-red-400' : 'text-gray-600'
        }`}
        onClick={onClick}
        data-tip={title}>
        {children}
      </code>
    </span>
  )
}

export default Component
