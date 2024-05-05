function Component({
  children,
  onClick,
  title,
  style
}: {
  children: React.ReactNode
  onClick?: () => void
  title?: string
  style?: string
}) {
  return (
    <code
      className={`tooltip tooltip-bottom text-left text-xs py-2 px-4 rounded-xl cursor-pointer bg-gray-200 hover:bg-gray-300 transition-all ${style}`}
      onClick={onClick}
      data-tip={title}>
      {children}
    </code>
  )
}

export default Component
