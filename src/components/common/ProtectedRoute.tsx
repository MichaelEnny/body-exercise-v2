'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireTrainer?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requireTrainer = false, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) {
  const { user, userProfile, initialized } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!initialized) return

    if (!user) {
      router.push(redirectTo)
      return
    }

    if (requireTrainer && userProfile && !userProfile.is_trainer) {
      router.push('/dashboard')
      return
    }
  }, [user, userProfile, initialized, requireTrainer, redirectTo, router])

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireTrainer && userProfile && !userProfile.is_trainer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">This page is only available to trainers.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}