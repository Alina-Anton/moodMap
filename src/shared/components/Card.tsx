import type { PropsWithChildren } from 'react'

interface CardProps extends PropsWithChildren {
  title?: string
  subtitle?: string
}

export function Card({ title, subtitle, children }: CardProps) {
  return (
    <section className="card">
      {title ? <h2 className="card-title">{title}</h2> : null}
      {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
      {children}
    </section>
  )
}
