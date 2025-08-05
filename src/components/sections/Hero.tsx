'use client'

import { ArrowRightIcon, PlayIcon, CheckIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import Image from 'next/image'

const stats = [
  { value: 10000, label: 'Active Users', suffix: '+' },
  { value: 500, label: 'Personal Trainers', suffix: '+' },
  { value: 1000000, label: 'Workouts Tracked', suffix: '+' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-mesh min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '-1s' }} />
      
      <div className="relative container-section py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left animate-slide-up">
            {/* Trust Badge */}
            <Badge variant="primary" className="mb-6">
              <span className="w-2 h-2 bg-success-500 rounded-full mr-2"></span>
              Trusted by 10,000+ fitness enthusiasts
            </Badge>
            
            {/* Main Headline */}
            <h1 className="text-display text-gray-900 mb-6">
              Your Ultimate{' '}
              <span className="text-gradient font-display">
                Fitness Journey
              </span>{' '}
              Starts Here
            </h1>
            
            {/* Subheadline */}
            <p className="text-body-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Create personalized workout plans, track your progress with advanced analytics, 
              and sync seamlessly with your favorite fitness devices. All in one powerful platform.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                variant="primary"
                size="lg"
                trackingEvent="hero_cta_clicked"
                trackingProperties={{ 
                  location: 'hero_section',
                  cta_text: 'Start Your Free Trial' 
                }}
                className="group"
              >
                Start Your Free Trial
                <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                trackingEvent="hero_demo_clicked"
                trackingProperties={{ location: 'hero_section' }}
                className="group"
              >
                <PlayIcon className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
            
            {/* Social Proof Stats */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="text-2xl font-bold text-gray-900 font-display">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Visual */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Main App Screenshot */}
            <div className="relative z-10">
              <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                {/* Mock Dashboard */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Today's Workout</h3>
                    <span className="text-sm text-success-600 font-medium">85% Complete</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg h-2">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-lg w-[85%]"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">425</div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="bg-accent-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-accent-600">45m</div>
                      <div className="text-sm text-gray-600">Duration</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Success Card */}
            <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Workout Complete!</div>
                  <div className="text-xs text-gray-500">425 calories burned</div>
                </div>
              </div>
            </div>
            
            {/* Floating Progress Card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200 animate-float" style={{ animationDelay: '-2s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Progress Update</div>
                  <div className="text-xs text-gray-500">+15% strength this month</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}