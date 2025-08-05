'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

const navigation = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Integrations', href: '#integrations' },
    { name: 'API Documentation', href: '#' },
    { name: 'Changelog', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'System Status', href: '#' },
    { name: 'Contact Support', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'GDPR', href: '#' },
  ],
}

const socialLinks = [
  { name: 'Twitter', href: '#', icon: '🐦' },
  { name: 'Facebook', href: '#', icon: '📘' },
  { name: 'Instagram', href: '#', icon: '📷' },
  { name: 'LinkedIn', href: '#', icon: '💼' },
  { name: 'YouTube', href: '#', icon: '📺' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Handle newsletter subscription
      console.log('Newsletter subscription:', email)
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container-section">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">FP</span>
              </div>
              <span className="text-xl font-bold font-display">FitPlatform</span>
            </div>
            
            <p className="text-gray-400 mb-6 max-w-md">
              The ultimate workout and wellness platform for fitness enthusiasts 
              and personal trainers. Transform your fitness journey with AI-powered insights.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter Signup */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Get the latest fitness tips, product updates, and exclusive offers.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                required
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isSubscribed}
                trackingEvent="newsletter_signup"
                trackingProperties={{ location: 'footer' }}
              >
                {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
              </Button>
            </form>
          </div>
          
        </div>
        
        {/* Support & Legal Links */}
        <div className="grid md:grid-cols-2 gap-8 mb-8 pt-8 border-t border-gray-800">
          <div>
            <h4 className="font-semibold mb-3 text-white">Support</h4>
            <div className="flex flex-wrap gap-6">
              {navigation.support.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-white">Legal</h4>
            <div className="flex flex-wrap gap-6">
              {navigation.legal.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 FitPlatform. All rights reserved.
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-6 opacity-60">
              <div className="flex items-center space-x-2">
                <span className="text-sm">🔒</span>
                <span className="text-xs text-gray-400">SSL Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">🛡️</span>
                <span className="text-xs text-gray-400">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">✓</span>
                <span className="text-xs text-gray-400">SOC 2 Certified</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  )
}