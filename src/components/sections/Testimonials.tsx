'use client'

import { StarIcon } from '@heroicons/react/24/solid'
import Card from '@/components/ui/Card'
import { Testimonial } from '@/types'

const testimonials: Testimonial[] = [
  {
    quote: "FitPlatform completely transformed my fitness routine. The AI recommendations are spot-on, and seeing my progress visualized keeps me incredibly motivated. Best fitness app I've ever used!",
    author: "Sarah Johnson",
    role: "Fitness Enthusiast",
    avatar: "👩‍💼",
    metrics: "Lost 25 lbs in 4 months",
    rating: 5
  },
  {
    quote: "As a personal trainer, FitPlatform has been a game-changer for my business. I can now manage 3x more clients efficiently while providing better service. The client progress tracking is phenomenal.",
    author: "Mike Rodriguez",
    role: "Certified Personal Trainer",
    avatar: "👨‍💪",
    metrics: "3x client growth, $15K/month revenue",
    rating: 5
  },
  {
    quote: "The device sync feature is flawless. All my Apple Watch data, Strava runs, and gym workouts sync perfectly. Finally, one app that brings everything together. Highly recommend!",
    author: "Emily Chen",
    role: "Marathon Runner",
    avatar: "👩‍🏃",
    metrics: "Completed 3 marathons this year",
    rating: 5
  },
  {
    quote: "The analytics are incredible. I can see exactly where I'm improving and what areas need work. It's like having a personal coach that never sleeps.",
    author: "David Kim",
    role: "Bodybuilder",
    avatar: "👨‍🏋️",
    metrics: "25% strength increase in 6 months",
    rating: 5
  },
  {
    quote: "Managing my yoga studio clients has never been easier. The custom program builder and client communication features are exactly what I needed.",
    author: "Lisa Martinez",
    role: "Yoga Instructor",
    avatar: "👩‍🧘",
    metrics: "50+ clients managed seamlessly",
    rating: 5
  },
  {
    quote: "The free tier gave me everything I needed to start, and upgrading to Pro was a no-brainer. The AI recommendations alone are worth the subscription.",
    author: "Alex Thompson",
    role: "College Student",
    avatar: "👨‍🎓",
    metrics: "40 lbs gained in healthy muscle",
    rating: 5
  }
]

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex space-x-1 mb-4">
    {[...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))}
  </div>
)

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container-section">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-h2 text-gray-900 mb-4">
            Loved by{' '}
            <span className="text-primary-600">Thousands</span>
            {' '}of Users
          </h2>
          <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our community of 
            fitness enthusiasts and trainers are saying about FitPlatform.
          </p>
        </div>
        
        {/* Testimonial Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-8 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <StarRating rating={testimonial.rating} />
              
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              {testimonial.metrics && (
                <div className="bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium mb-6 inline-block">
                  📈 {testimonial.metrics}
                </div>
              )}
              
              <div className="flex items-center">
                <div className="text-3xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Aggregate Review Score */}
        <div className="text-center animate-slide-up">
          <div className="inline-flex items-center space-x-6 bg-white rounded-2xl px-8 py-6 shadow-lg border border-gray-200">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-6 h-6 text-yellow-400" />
              ))}
            </div>
            <div className="text-left">
              <div className="text-3xl font-bold text-gray-900 font-display">4.9/5</div>
              <div className="text-sm text-gray-500">Based on 2,500+ reviews</div>
            </div>
            <div className="hidden sm:block border-l border-gray-200 pl-6">
              <div className="text-2xl font-bold text-primary-600 font-display">10K+</div>
              <div className="text-sm text-gray-500">Happy Users</div>
            </div>
          </div>
        </div>
        
        {/* Social Proof Logos */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6">Featured in</p>
          <div className="flex items-center justify-center space-x-8 opacity-50">
            <div className="text-2xl font-bold">TechCrunch</div>
            <div className="text-2xl font-bold">Forbes</div>
            <div className="text-2xl font-bold">Wired</div>
            <div className="text-2xl font-bold">Men's Health</div>
          </div>
        </div>
        
      </div>
    </section>
  )
}