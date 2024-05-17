function DescriptionText({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs text-gray-400 flex flex-row gap-1">
      {children}
    </span>
  )
}

export default DescriptionText
