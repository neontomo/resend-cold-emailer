import { useState } from 'react'

function Input({
  id,
  type,
  value,
  size = 'md',
  which = 'primary',
  style = '',
  disabled = false,
  iconSide = 'right',
  icon,
  onClick
}: {
  id?: string
  type: 'button' | 'submit' | 'reset' | undefined
  placeholder?: string
  value?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  which?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'accent'
    | 'info'
    | 'light'
    | 'dark'
    | 'link'
  style?: string
  disabled?: boolean
  iconSide?: 'left' | 'right'
  icon?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  const buttonSizes = {
    xs: 'text-xs btn-xs',
    sm: 'text-xs btn-sm',
    md: 'text-sm btn-md',
    lg: 'text-lg btn-lg'
  }

  const buttonWhich = {
    primary: 'btn-primary',
    secondary: 'btn-secondary text-white',
    success: 'btn-success',
    danger: 'btn-error',
    warning: 'btn-warning',
    accent: 'btn-accent',
    info: 'btn-info',
    light: 'btn-light',
    dark: 'btn-dark',
    link: 'btn-link'
  }

  return (
    <button
      id={id}
      type={type}
      className={`btn rounded-xl ${buttonSizes[size]} ${buttonWhich[which]} ${style}`}
      disabled={disabled}
      onClick={onClick}>
      {iconSide === 'left' && icon}
      {value && value.length > 28 ? value?.slice(0, 28) + ' ...' : value}
      {iconSide === 'right' && icon}
    </button>
  )
}

export default Input
