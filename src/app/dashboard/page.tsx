'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'

export default function Dashboard() {
  const { user, loading, initialized } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (initialized && !user) {
      router.push('/')
    }
  }, [user, initialized, router])

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.full_name || 'User'}!
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {user.is_trainer ? 'Trainer Dashboard' : 'Your Fitness Journey'}
            </p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.is_trainer ? 'Personal Trainer' : 'Fitness Enthusiast'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Subscription</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {user.subscription_tier.toUpperCase()}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {user.is_trainer ? (
                <>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <h3 className="font-medium text-gray-900">Manage Clients</h3>
                    <p className="text-sm text-gray-500">View and manage your client relationships</p>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <h3 className="font-medium text-gray-900">Create Workout Plan</h3>
                    <p className="text-sm text-gray-500">Design custom workout plans for clients</p>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <h3 className="font-medium text-gray-900">View Analytics</h3>
                    <p className="text-sm text-gray-500">Track client progress and engagement</p>
                  </button>
                </>
              ) : (
                <>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <h3 className="font-medium text-gray-900">Start Workout</h3>
                    <p className="text-sm text-gray-500">Begin a new workout session</p>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <h3 className="font-medium text-gray-900">View Progress</h3>
                    <p className="text-sm text-gray-500">Track your fitness journey</p>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <h3 className="font-medium text-gray-900">Connect Devices</h3>
                    <p className="text-sm text-gray-500">Sync with Apple Health, Google Fit, or Strava</p>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}