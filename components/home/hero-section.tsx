import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      
      {/* Decorative circles */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
          Your mental wellness companion
        </div>

        <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Release Your Anger.{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Find Your Peace.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          CALMER is a therapeutic platform that helps you express and release intense emotions 
          through an interactive game, then guides you to tranquility with an AI-powered 
          therapist chat.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/game">
            <Button 
              size="lg" 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
            >
              <span className="mr-2">Release Anger</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Button>
          </Link>
          <Link href="/chat">
            <Button 
              size="lg" 
              variant="outline"
              className="w-full border-primary/50 hover:bg-primary/10 sm:w-auto bg-transparent"
            >
              <span className="mr-2">Find Peace</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border/40 pt-8">
          <div>
            <p className="text-3xl font-bold text-primary">100%</p>
            <p className="text-sm text-muted-foreground">Private & Secure</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">24/7</p>
            <p className="text-sm text-muted-foreground">Available</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">AI</p>
            <p className="text-sm text-muted-foreground">Powered Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}
