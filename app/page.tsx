import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturesSection } from '@/components/home/features-section'
import { CTASection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
  )
}
