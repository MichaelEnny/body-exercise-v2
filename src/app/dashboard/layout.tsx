'use client'

import { useEffect } from 'react'
import type { Metadata } from 'next'
import { useAuthStore } from '@/stores/auth'
import { APP_NAME } from '@/lib/constants'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, initialized, initialize } = useAuthStore()

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="text-primary-600 mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <a 
            href="/auth/signin" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary-600">{APP_NAME}</h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a href="/dashboard" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Dashboard
                </a>
                <a href="/dashboard/workouts" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Workouts
                </a>
                <a href="/dashboard/progress" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Progress
                </a>
                <a href="/dashboard/nutrition" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Nutrition
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-700">Welcome, </span>
                <span className="font-medium text-gray-900">
                  {user.full_name || user.email}
                </span>
              </div>
              
              <div className="relative">
                <button className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}