'use client'

import { 
  UsersIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CreditCardIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const trainerBenefits = [
  {
    icon: UsersIcon,
    title: 'Client Management Dashboard',
    description: 'Centralized hub to manage all your clients, track their progress, and communicate seamlessly through in-app messaging.',
    color: 'accent'
  },
  {
    icon: DocumentTextIcon,
    title: 'Custom Program Builder',
    description: 'Create personalized workout programs tailored to each client\'s goals, fitness level, and available equipment.',
    color: 'primary'
  },
  {
    icon: ChartBarIcon,
    title: 'Advanced Analytics',
    description: 'Monitor client progress with detailed analytics, identify trends, and make data-driven adjustments to their programs.',
    color: 'success'
  },
  {
    icon: CreditCardIcon,
    title: 'Integrated Billing',
    description: 'Streamline your business with built-in payment processing, subscription management, and automated invoicing.',
    color: 'purple'
  },
]

const successMetrics = [
  { value: '3x', label: 'Average client capacity increase', color: 'primary' },
  { value: '85%', label: 'Client retention improvement', color: 'accent' },
  { value: '40%', label: 'Time saved on admin tasks', color: 'success' },
]

export default function TrainerSection() {
  return (
    <section id="trainers" className="py-24 bg-white">
      <div className="container-section">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="accent" className="mb-6">
            FOR PERSONAL TRAINERS
          </Badge>
          <h2 className="text-h2 text-gray-900 mb-4">
            Scale Your Training Business{' '}
            <span className="text-accent-600">Digitally</span>
          </h2>
          <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
            Manage unlimited clients, create custom workout programs, track progress remotely, 
            and grow your personal training business with professional-grade tools.
          </p>
        </div>
        
        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* Left Column - Benefits */}
          <div className="animate-slide-up">
            <h3 className="text-h3 text-gray-900 mb-8">
              Everything You Need to Manage Your Clients
            </h3>
            
            {/* Benefit Cards */}
            <div className="space-y-6">
              {trainerBenefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="flex items-start space-x-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 ${
                    benefit.color === 'accent' ? 'bg-accent-100' :
                    benefit.color === 'primary' ? 'bg-primary-100' :
                    benefit.color === 'success' ? 'bg-success-100' :
                    'bg-purple-100'
                  } rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <benefit.icon className={`w-6 h-6 ${
                      benefit.color === 'accent' ? 'text-accent-600' :
                      benefit.color === 'primary' ? 'text-primary-600' :
                      benefit.color === 'success' ? 'text-success-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                variant="accent"
                trackingEvent="trainer_trial_clicked"
                trackingProperties={{ location: 'trainer_section' }}
              >
                Start Free Trial
              </Button>
              <Button
                variant="secondary"
                trackingEvent="trainer_demo_clicked"
                trackingProperties={{ location: 'trainer_section' }}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
          
          {/* Right Column - Visual */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Trainer Dashboard Mockup */}
            <div className="relative z-10">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">Client Dashboard</h4>
                    <span className="text-sm bg-success-100 text-success-700 px-2 py-1 rounded-full">
                      32 Active
                    </span>
                  </div>
                  
                  {/* Client List */}
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Johnson', status: 'Workout Complete', progress: '85%' },
                      { name: 'Mike Rodriguez', status: 'In Progress', progress: '60%' },
                      { name: 'Emily Chen', status: 'Rest Day', progress: '100%' },
                    ].map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{client.name}</div>
                            <div className="text-xs text-gray-500">{client.status}</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-primary-600">{client.progress}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                    <div className="text-center p-3 bg-primary-50 rounded-lg">
                      <div className="text-lg font-bold text-primary-600">24</div>
                      <div className="text-xs text-gray-600">This Week</div>
                    </div>
                    <div className="text-center p-3 bg-accent-50 rounded-lg">
                      <div className="text-lg font-bold text-accent-600">96%</div>
                      <div className="text-xs text-gray-600">Retention</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Success Metrics */}
            <div className="absolute top-4 -left-8 bg-white rounded-xl shadow-lg p-4 border border-gray-200 animate-float">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 font-display">150+</div>
                <div className="text-sm text-gray-500">Active Clients</div>
              </div>
            </div>
            
            <div className="absolute bottom-4 -right-8 bg-white rounded-xl shadow-lg p-4 border border-gray-200 animate-float" style={{ animationDelay: '-1s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-success-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">$12K/month</div>
                  <div className="text-xs text-gray-500">Revenue Growth</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Trainer Success Stories */}
        <div className="bg-gradient-to-r from-gray-50 to-primary-50 rounded-3xl p-8 lg:p-12 animate-slide-up">
          <div className="text-center mb-8">
            <h3 className="text-h3 text-gray-900 mb-4">Join 500+ Successful Trainers</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how FitPlatform is helping personal trainers scale their businesses 
              and deliver better results for their clients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {successMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`text-4xl font-bold mb-2 font-display ${
                  metric.color === 'primary' ? 'text-primary-600' :
                  metric.color === 'accent' ? 'text-accent-600' :
                  'text-success-600'
                }`}>
                  {metric.value}
                </div>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            ))}
          </div>
          
          {/* CTA */}
          <div className="text-center mt-8">
            <Button
              variant="primary"
              size="lg"
              trackingEvent="trainer_success_cta_clicked"
              trackingProperties={{ location: 'trainer_success_section' }}
            >
              Start Growing Your Business
            </Button>
          </div>
        </div>
        
      </div>
    </section>
  )
}