import type { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Authentication - ${APP_NAME}`,
  description: 'Sign in or create your account to access your fitness platform',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-mesh">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="max-w-md">
              <h1 className="text-4xl font-bold font-display mb-6">
                Transform Your Fitness Journey
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                Join thousands of users who've achieved their fitness goals with personalized workouts and advanced analytics.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent-400 rounded-full mr-3" />
                  <span>Personalized workout plans</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent-400 rounded-full mr-3" />
                  <span>Advanced progress tracking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent-400 rounded-full mr-3" />
                  <span>Seamless device synchronization</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M45.1,-55.8C58.3,-45.8,68.5,-32.9,73.2,-17.8C78,-2.7,77.3,14.6,71.8,30.7C66.3,46.8,56,61.7,42.2,69.8C28.4,77.9,11.1,79.2,-5.8,77.6C-22.7,76,-45.4,71.5,-59.6,59.3C-73.8,47.1,-79.5,27.2,-80.7,6.4C-81.9,-14.4,-78.6,-36.1,-68.8,-52.2C-59,-68.3,-42.7,-78.8,-26.1,-84.4C-9.5,-90,5.4,-90.7,20.1,-85.7C34.8,-80.7,49.3,-69.9,45.1,-55.8Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M34.7,-44.8C44.3,-35.6,50.5,-23.8,53.1,-10.7C55.7,2.4,54.7,16.8,48.9,28.4C43.1,40,32.5,48.8,20.5,54.2C8.5,59.6,-4.9,61.6,-17.6,58.3C-30.3,55,-42.3,46.4,-49.8,34.2C-57.3,22,-60.3,6.2,-58.8,-8.7C-57.3,-23.6,-51.3,-37.6,-41.4,-46.8C-31.5,-56,-17.7,-60.4,-3.8,-57.1C10.1,-53.8,25.1,-42.7,34.7,-44.8Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
        
        {/* Right side - Auth form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold font-display text-gray-900">
                Welcome to {APP_NAME}
              </h2>
              <p className="mt-2 text-gray-600">
                Your ultimate fitness platform awaits
              </p>
            </div>
            
            <div className="mt-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}