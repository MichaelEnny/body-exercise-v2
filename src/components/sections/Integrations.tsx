'use client'

import { PlusIcon, CloudArrowUpIcon, ShieldCheckIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { Integration } from '@/types'

const integrations: Integration[] = [
  { name: 'Apple Health', logo: '📱', description: 'Sync with HealthKit' },
  { name: 'Google Fit', logo: '🔷', description: 'Android health data' },
  { name: 'Strava', logo: '🟠', description: 'Running & cycling' },
  { name: 'Fitbit', logo: '🔵', description: 'Activity tracking' },
  { name: 'Garmin', logo: '🔴', description: 'GPS & sports' },
  { name: 'MyFitnessPal', logo: '🔵', description: 'Nutrition tracking' },
  { name: 'Polar', logo: '⚪', description: 'Heart rate data' },
  { name: 'Suunto', logo: '🟡', description: 'Outdoor sports' },
]

const benefits = [
  {
    icon: CloudArrowUpIcon,
    title: 'Automatic Sync',
    description: 'Real-time data synchronization from all your devices',
    color: 'primary'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Private',
    description: 'Enterprise-grade security for your health data',
    color: 'success'
  },
  {
    icon: ChartBarIcon,
    title: 'Smart Insights',
    description: 'AI-powered analysis across all your fitness data',
    color: 'accent'
  },
]

export default function Integrations() {
  return (
    <section id="integrations" className="py-24 bg-white">
      <div className="container-section">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-h2 text-gray-900 mb-4">
            Connect With Your Favorite{' '}
            <span className="text-primary-600">Fitness Platforms</span>
          </h2>
          <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
            Seamlessly sync your data from popular fitness apps and devices. 
            All your health and fitness information in one unified dashboard.
          </p>
        </div>
        
        {/* Integration Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 mb-16">
          
          {integrations.slice(0, 7).map((integration, index) => (
            <div
              key={integration.name}
              className="flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-200 group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {integration.logo}
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">
                {integration.name}
              </span>
              <span className="text-xs text-gray-500 text-center mt-1">
                {integration.description}
              </span>
            </div>
          ))}
          
          {/* More integrations indicator */}
          <div className="flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-200 group animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-3 group-hover:bg-gray-300 transition-colors">
              <PlusIcon className="h-6 w-6 text-gray-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">10+ More</span>
            <span className="text-xs text-gray-500 text-center mt-1">
              And growing
            </span>
          </div>
          
        </div>
        
        {/* Integration Benefits */}
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 lg:p-12 animate-slide-up">
          <div className="text-center mb-8">
            <h3 className="text-h3 text-gray-900 mb-4">One Dashboard, All Your Data</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stop switching between apps. FitPlatform aggregates all your fitness data 
              into one powerful, unified experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`w-12 h-12 ${
                  benefit.color === 'primary' ? 'bg-primary-100' :
                  benefit.color === 'success' ? 'bg-success-100' :
                  'bg-accent-100'
                } rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className={`w-6 h-6 ${
                    benefit.color === 'primary' ? 'text-primary-600' :
                    benefit.color === 'success' ? 'text-success-600' :
                    'text-accent-600'
                  }`} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
          
          {/* Visual Data Flow */}
          <div className="mt-12 flex items-center justify-center space-x-4 opacity-60">
            <div className="text-2xl">📱</div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>
            <div className="text-2xl">⚡</div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>
            <div className="text-2xl">📊</div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></div>
            <div className="text-2xl">🎯</div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Device → Sync → Analysis → Insights
          </p>
        </div>
        
      </div>
    </section>
  )
}