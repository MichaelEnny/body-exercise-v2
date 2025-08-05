'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'

export function AuthInitializer() {
  const { initialize, initialized } = useAuthStore()

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialize, initialized])

  return null
}