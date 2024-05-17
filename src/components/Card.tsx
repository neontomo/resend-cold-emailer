function Card({
  active = true,
  children,
  actions,
  actionsJustify = 'end',
  onClick,
  title,
  style,
  id
}: {
  active?: boolean
  children?: React.ReactNode
  actions?: React.ReactNode
  actionsJustify?: string
  onClick?: () => void
  title?: string
  style?: string
  id?: string
}) {
  return (
    <>
      <div
        className={`card bg-base-100 shadow-xl w-full ${
          active ? 'opacity-100' : 'opacity-60'
        } ${style}`}
        id={id}>
        <div className="card-body">
          <h2 className="card-title mb-4">{title}</h2>
          <div className="card-content">{children}</div>
          <div
            className={`card-actions ${
              actionsJustify ? `justify-${actionsJustify}` : 'justify-end'
            } items-end flex-grow mt-4`}>
            {actions}
          </div>
        </div>
      </div>
    </>
  )
}

export default Card
