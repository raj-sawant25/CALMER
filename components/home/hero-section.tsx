import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      
      {/* Decorative circles */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-secondary/50 px-5 py-2 text-sm font-medium text-foreground backdrop-blur-md shadow-sm shadow-primary/5">
          <span className="mr-2 inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
          Your mental wellness companion
        </div>

        <h1 className="mb-6 text-balance text-6xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl drop-shadow-sm">
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent hover:scale-105 inline-block transition-transform duration-500 cursor-default">
            CALMER
          </span>
        </h1>
        <h2 className="mb-8 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
          Release Your Anger.{' '}
          <span className="text-muted-foreground">
            Find Your Peace.
          </span>
        </h2>

        <p className="mx-auto mb-12 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl leading-relaxed">
          A therapeutic platform that helps you express and release intense emotions 
          through an interactive game, then guides you to tranquility with an AI-powered 
          therapist chat.
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link href="/game">
            <Button 
              size="lg" 
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-accent to-primary px-8 py-7 text-lg font-bold text-accent-foreground shadow-xl shadow-accent/20 transition-all hover:scale-105 hover:shadow-accent/40 sm:w-auto mt-2"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative mr-2">Release Anger</span>
              <svg className="relative h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Button>
          </Link>
          <Link href="/chat">
            <Button 
              size="lg" 
              variant="outline"
              className="group w-full rounded-full border-2 border-primary/50 bg-background/50 px-8 py-7 text-lg font-bold backdrop-blur-md transition-all hover:scale-105 hover:border-primary hover:bg-primary/10 shadow-lg shadow-primary/10 hover:shadow-primary/30 sm:w-auto mt-2"
            >
              <span className="mr-2">Find Peace</span>
              <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
