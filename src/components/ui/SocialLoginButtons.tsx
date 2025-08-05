'use client'

import { Button } from './Button'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { Chrome, Apple, Github } from 'lucide-react'

interface SocialLoginButtonsProps {
  redirectTo?: string
}

export function SocialLoginButtons({ redirectTo = '/dashboard' }: SocialLoginButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'github') => {
    try {
      setLoading(provider)
      
      const scopes = provider === 'google' 
        ? 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read'
        : undefined

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          scopes
        }
      })

      if (error) {
        console.error(`${provider} login error:`, error.message)
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error(`${provider} login error:`, error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => handleSocialLogin('google')}
        disabled={loading !== null}
      >
        <Chrome className="mr-2 h-4 w-4" />
        {loading === 'google' ? 'Connecting...' : 'Continue with Google'}
      </Button>
      
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => handleSocialLogin('apple')}
        disabled={loading !== null}
      >
        <Apple className="mr-2 h-4 w-4" />
        {loading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
      </Button>
      
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => handleSocialLogin('github')}
        disabled={loading !== null}
      >
        <Github className="mr-2 h-4 w-4" />
        {loading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
      </Button>
    </div>
  )
}