'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  startIcon?: LucideIcon
  endIcon?: LucideIcon
  onStartIconClick?: () => void
  onEndIconClick?: () => void
  onChange?: (value: string) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helperText,
    startIcon: StartIcon,
    endIcon: EndIcon,
    onStartIconClick,
    onEndIconClick,
    onChange,
    className,
    ...props
  }, ref) => {
    const inputClasses = cn(
      'flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base',
      'placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
      'disabled:cursor-not-allowed disabled:opacity-50',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
      StartIcon && 'pl-12',
      EndIcon && 'pr-12',
      className
    )

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {StartIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <StartIcon 
                className={cn(
                  'h-5 w-5 text-gray-400',
                  onStartIconClick && 'cursor-pointer hover:text-gray-600'
                )}
                onClick={onStartIconClick}
              />
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            {...props}
            onChange={(e) => {
              if (onChange) {
                onChange(e.target.value)
              }
            }}
          />
          
          {EndIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <EndIcon 
                className={cn(
                  'h-5 w-5 text-gray-400',
                  onEndIconClick && 'cursor-pointer hover:text-gray-600'
                )}
                onClick={onEndIconClick}
              />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input