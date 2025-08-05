'use client'

import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { PricingTier } from '@/types'

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: 0,
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      '3 custom workout plans',
      '30-day progress history',
      'Basic device sync (1 device)',
      'Community access',
      'Email support'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Pro',
    price: 9.99,
    period: '/month',
    description: 'For serious fitness enthusiasts',
    features: [
      'Unlimited workout plans',
      'Full progress history',
      'Unlimited device sync',
      'Advanced analytics',
      'AI workout recommendations',
      'Export capabilities',
      'Priority support',
      'Custom goal setting'
    ],
    cta: 'Start 14-Day Free Trial',
    popular: true,
    highlight: true
  },
  {
    name: 'Enterprise',
    price: 29.99,
    period: '/month',
    description: 'For personal trainers & gyms',
    features: [
      'All Pro features',
      'Client management dashboard',
      'Custom branding',
      'Billing integration',
      'API access',
      'White-label options',
      'Dedicated account manager',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    popular: false
  },
]

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  const getPrice = (price: number) => {
    if (price === 0) return 0
    return isAnnual ? (price * 12 * 0.8) : price
  }

  const getPeriod = () => {
    return isAnnual ? '/year' : '/month'
  }

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container-section">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-h2 text-gray-900 mb-4">
            Choose Your{' '}
            <span className="text-primary-600">Fitness Journey</span>
          </h2>
          <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include core features 
            with advanced tools available for serious athletes and trainers.
          </p>
        </div>
        
        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                !isAnnual
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                isAnnual
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual{' '}
              <span className="text-success-600 font-semibold">
                (Save 20%)
              </span>
            </button>
          </div>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card
              key={tier.name}
              variant="pricing"
              className={`relative text-center animate-slide-up ${
                tier.highlight ? 'pricing-card featured' : 'pricing-card'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-h3 text-gray-900 mb-2">{tier.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900 font-display">
                    ${tier.price === 0 ? '0' : getPrice(tier.price).toFixed(2)}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-lg font-normal text-gray-600">
                      {getPeriod()}
                    </span>
                  )}
                </div>
                {isAnnual && tier.price > 0 && (
                  <div className="text-sm text-success-600 font-medium">
                    Save ${((tier.price * 12) - getPrice(tier.price)).toFixed(0)} per year
                  </div>
                )}
                <p className="text-gray-600">{tier.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8 text-left">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-success-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                variant={tier.highlight ? 'primary' : 'secondary'}
                className="w-full"
                trackingEvent="pricing_cta_clicked"
                trackingProperties={{
                  plan: tier.name,
                  price: getPrice(tier.price),
                  billing: isAnnual ? 'annual' : 'monthly'
                }}
              >
                {tier.cta}
              </Button>
            </Card>
          ))}
        </div>
        
        {/* Pricing FAQ */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Questions about pricing?{' '}
            <button className="text-primary-600 hover:text-primary-700 font-medium underline">
              Check our FAQ
            </button>
            {' '}or{' '}
            <button className="text-primary-600 hover:text-primary-700 font-medium underline">
              contact support
            </button>
          </p>
          <p className="text-sm text-gray-500">
            All plans include a 14-day free trial. No credit card required. 
            Cancel anytime.
          </p>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-12 flex items-center justify-center space-x-8 opacity-60">
          <div className="flex items-center space-x-2">
            <CheckIcon className="w-4 h-4 text-success-500" />
            <span className="text-sm text-gray-600">14-day free trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="w-4 h-4 text-success-500" />
            <span className="text-sm text-gray-600">No setup fees</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="w-4 h-4 text-success-500" />
            <span className="text-sm text-gray-600">Cancel anytime</span>
          </div>
        </div>
        
      </div>
    </section>
  )
}