import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

interface ButtonProps
  extends PropsWithChildren,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button {...props} className={`btn btn-${variant}`}>
      {children}
    </button>
  )
}
