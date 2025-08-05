'use client'

import { 
  CalendarIcon, 
  ChartBarIcon, 
  DevicePhoneMobileIcon,
  BoltIcon,
  UsersIcon,
  CloudArrowUpIcon,
  CheckIcon 
} from '@heroicons/react/24/outline'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Feature } from '@/types'

const features: Feature[] = [
  {
    title: 'Smart Workout Planning',
    description: 'Create customized workout plans with our intelligent exercise library. Set goals, track sets and reps, and get personalized recommendations.',
    icon: CalendarIcon,
    benefits: [
      'Personalized exercise selection',
      'Progress-based difficulty scaling',
      'Goal-oriented program design'
    ]
  },
  {
    title: 'Advanced Analytics',
    description: 'Visualize your progress with detailed charts and insights. Track strength gains, endurance improvements, and achieve your goals faster.',
    icon: ChartBarIcon,
    benefits: [
      'Comprehensive progress tracking',
      'Performance trend analysis',
      'Goal achievement insights'
    ]
  },
  {
    title: 'Seamless Device Sync',
    description: 'Connect with Apple HealthKit, Google Fit, Strava, and more. All your fitness data in one centralized dashboard.',
    icon: DevicePhoneMobileIcon,
    benefits: [
      'Multi-platform integration',
      'Real-time data synchronization',
      'Unified fitness dashboard'
    ]
  },
  {
    title: 'AI-Powered Recommendations',
    description: 'Get intelligent workout suggestions based on your performance, preferences, and fitness goals.',
    icon: BoltIcon,
    benefits: [
      'Machine learning algorithms',
      'Adaptive workout plans',
      'Performance optimization'
    ]
  },
  {
    title: 'Community Features',
    description: 'Connect with other fitness enthusiasts, share achievements, and stay motivated with our social features.',
    icon: UsersIcon,
    benefits: [
      'Social workout sharing',
      'Achievement celebrations',
      'Motivation support system'
    ]
  },
  {
    title: 'Cloud Backup',
    description: 'Never lose your data with automatic cloud backup and synchronization across all your devices.',
    icon: CloudArrowUpIcon,
    benefits: [
      'Automatic data backup',
      'Cross-device synchronization',
      'Enterprise-grade security'
    ]
  },
]

const aiFeatureBenefits = [
  'Personalized exercise selection',
  'Adaptive difficulty progression', 
  'Goal-oriented program design',
  'Real-time form feedback',
  'Injury prevention insights'
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container-section">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge variant="primary" className="mb-6">
            POWERFUL FEATURES
          </Badge>
          <h2 className="text-h2 text-gray-900 mb-4">
            Everything You Need to{' '}
            <span className="text-primary-600">Achieve Your Goals</span>
          </h2>
          <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
            From intelligent workout planning to comprehensive progress tracking, 
            FitPlatform provides all the tools you need for fitness success.
          </p>
        </div>
        
        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="feature"
              className="text-center group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-primary-100 group-hover:bg-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors">
                <feature.icon className="w-8 h-8 text-primary-600 group-hover:scale-110 transition-transform" />
              </div>
              
              <h3 className="text-h3 text-gray-900 mb-4">{feature.title}</h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <button 
                className="text-primary-600 font-medium hover:text-primary-700 transition-colors group-hover:translate-x-1 inline-flex items-center"
                onClick={() => {
                  // Track feature interest
                  console.log(`Feature interest: ${feature.title}`)
                }}
              >
                Learn more 
                <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </button>
            </Card>
          ))}
        </div>
        
        {/* Feature Spotlight - AI Recommendations */}
        <Card className="p-8 lg:p-12 shadow-xl border border-gray-200 animate-slide-up">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="accent" className="mb-6">
                AI-POWERED
              </Badge>
              
              <h3 className="text-h2 text-gray-900 mb-6">
                Intelligent Workout Recommendations
              </h3>
              
              <p className="text-body-lg text-gray-600 mb-8">
                Our advanced AI algorithm analyzes your performance data, preferences, 
                and goals to suggest the most effective workouts for your fitness journey.
              </p>
              
              {/* Feature Benefits */}
              <div className="space-y-4 mb-8">
                {aiFeatureBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CheckIcon className="w-5 h-5 text-success-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button
                variant="primary"
                trackingEvent="ai_feature_cta_clicked"
                trackingProperties={{ location: 'features_section' }}
              >
                Try AI Recommendations
              </Button>
            </div>
            
            <div className="relative">
              {/* AI Feature Visualization */}
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 border border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">AI Recommendation</h4>
                    <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-full">
                      97% Match
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h5 className="font-medium text-gray-900 mb-2">Upper Body Strength</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      Based on your progress, try increasing weight by 5lbs
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Optimal timing</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-lg font-bold text-primary-600">12</div>
                      <div className="text-xs text-gray-500">Reps</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-lg font-bold text-accent-600">3</div>
                      <div className="text-xs text-gray-500">Sets</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-lg font-bold text-success-600">65lbs</div>
                      <div className="text-xs text-gray-500">Weight</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating AI Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-float">
                AI Powered
              </div>
            </div>
          </div>
        </Card>
        
      </div>
    </section>
  )
}