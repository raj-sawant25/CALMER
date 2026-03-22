import { Navigation } from '@/components/navigation'
import { TherapistChat } from '@/components/chat/therapist-chat'

export const metadata = {
  title: 'Find Peace - CALMER',
  description: 'Talk to our AI therapist to process your emotions and find inner peace.',
}

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navigation />
      <section className="flex flex-1 flex-col px-4 pt-20 pb-4">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
          <div className="mb-4 text-center">
            <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Find Your Peace
            </h1>
            <p className="text-sm text-muted-foreground">
              A safe space to process your emotions with compassionate AI guidance
            </p>
          </div>
          <TherapistChat />
        </div>
      </section>
    </main>
  )
}
