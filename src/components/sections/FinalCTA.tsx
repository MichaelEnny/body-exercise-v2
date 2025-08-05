'use client'

import { CheckIcon, PlayIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'

const trustIndicators = [
  '14-day free trial',
  'No setup fees', 
  'Cancel anytime'
]

export default function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary-600 to-accent-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '-1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      </div>
      
      <div className="relative container-section text-center">
        
        <div className="animate-slide-up">
          <h2 className="text-h2 text-white mb-6">
            Ready to Transform Your{' '}
            <span className="text-yellow-300 font-display">Fitness Journey?</span>
          </h2>
          
          <p className="text-body-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of fitness enthusiasts and personal trainers who are already 
            achieving their goals with FitPlatform. Start your free trial today.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
              trackingEvent="final_cta_trial_clicked"
              trackingProperties={{ 
                location: 'final_cta_section',
                cta_text: 'Start Free Trial'
              }}
            >
              Start Free Trial - No Credit Card Required
            </Button>
            <Button
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200 hover:-translate-y-1"
              trackingEvent="final_cta_demo_clicked"
              trackingProperties={{ location: 'final_cta_section' }}
            >
              <PlayIcon className="mr-2 w-5 h-5" />
              Schedule a Demo
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 text-white/80 text-sm">
            {trustIndicators.map((indicator, index) => (
              <div
                key={indicator}
                className="flex items-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckIcon className="w-5 h-5 mr-2" />
                {indicator}
              </div>
            ))}
          </div>
          
          {/* Additional Social Proof */}
          <div className="mt-12 flex items-center justify-center space-x-12 text-white/60">
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-2xl font-bold text-white font-display">4.9★</div>
              <div className="text-sm">App Store Rating</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-2xl font-bold text-white font-display">10K+</div>
              <div className="text-sm">Active Users</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-2xl font-bold text-white font-display">500+</div>
              <div className="text-sm">Trainers</div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  )
}