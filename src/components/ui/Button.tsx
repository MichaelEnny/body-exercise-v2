'use client'

import { cn, trackEvent } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  trackingEvent?: string
  trackingProperties?: Record<string, any>
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  trackingEvent,
  trackingProperties = {},
  onClick,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (trackingEvent) {
      trackEvent(trackingEvent, trackingProperties)
    }
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button