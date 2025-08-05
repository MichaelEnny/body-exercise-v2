import Navigation from '@/components/common/Navigation'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import Integrations from '@/components/sections/Integrations'
import Pricing from '@/components/sections/Pricing'
import TrainerSection from '@/components/sections/TrainerSection'
import Testimonials from '@/components/sections/Testimonials'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/sections/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary-600 text-white p-4 z-50 rounded-br-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div id="main-content">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* Integrations Section */}
        <Integrations />

        {/* Pricing Section */}
        <Pricing />

        {/* Trainer-focused Section */}
        <TrainerSection />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Final CTA Section */}
        <FinalCTA />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}