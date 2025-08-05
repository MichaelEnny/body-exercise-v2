import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'feature' | 'pricing'
  hover?: boolean
  style?: React.CSSProperties
}

export function Card({
  children,
  className,
  variant = 'default',
  hover = true,
  style,
}: CardProps) {
  const baseClasses = 'bg-white rounded-2xl border border-gray-200 transition-all duration-300'
  
  const variants = {
    default: 'p-6 shadow-md',
    feature: 'feature-card',
    pricing: 'pricing-card',
  }
  
  const hoverClasses = hover ? 'hover:-translate-y-1 hover:shadow-xl' : ''

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        hoverClasses,
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}

export default Card