import { Question } from '@phosphor-icons/react'

const helpComponent = ({
  help,
  direction
}: {
  help: string
  direction: string
}) => {
  const directionMapping: { [key: string]: string } = {
    left: 'tooltip-left',
    right: 'tooltip-right',
    top: 'tooltip-top',
    bottom: 'tooltip-bottom'
  }

  return (
    <span
      className={`text-sm text-gray-500 tooltip ${directionMapping[direction]}`}
      data-tip={help}>
      <Question />
    </span>
  )
}

export default helpComponent
