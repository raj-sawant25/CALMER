import { Navigation } from '@/components/navigation'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard - CALMER',
  description: 'View your emotional wellness journey and session history.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch user data
  const [gameSessionsResult, chatSessionsResult] = await Promise.all([
    supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('chat_sessions')
      .select('*, chat_messages(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const gameSessions = gameSessionsResult.data || []
  const chatSessions = chatSessionsResult.data || []

  // Calculate stats
  const totalGameSessions = gameSessions.length
  const totalChatSessions = chatSessions.length
  const totalScore = gameSessions.reduce((sum, s) => sum + (s.score || 0), 0)
  const totalDestroyed = gameSessions.reduce((sum, s) => sum + (s.targets_destroyed || 0), 0)
  const avgIntensity = gameSessions.length > 0
    ? Math.round(gameSessions.reduce((sum, s) => sum + (s.intensity_level || 0), 0) / gameSessions.length)
    : 0

  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="px-4 pt-24 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">Your Journey</h1>
            <p className="text-muted-foreground">
              Track your progress toward emotional wellness
            </p>
          </div>
          <DashboardContent
            gameSessions={gameSessions}
            chatSessions={chatSessions}
            stats={{
              totalGameSessions,
              totalChatSessions,
              totalScore,
              totalDestroyed,
              avgIntensity,
            }}
          />
        </div>
      </section>
    </main>
  )
}
