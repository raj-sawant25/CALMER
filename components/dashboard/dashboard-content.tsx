'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface GameSession {
  id: string
  created_at: string
  score: number
  targets_destroyed: number
  duration_seconds: number
  intensity_level: number
}

interface ChatSession {
  id: string
  created_at: string
  chat_messages: { count: number }[]
}

interface DashboardContentProps {
  gameSessions: GameSession[]
  chatSessions: ChatSession[]
  stats: {
    totalGameSessions: number
    totalChatSessions: number
    totalScore: number
    totalDestroyed: number
    avgIntensity: number
  }
}

export function DashboardContent({ gameSessions, chatSessions, stats }: DashboardContentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription>Game Sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{stats.totalGameSessions}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription>Chat Sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{stats.totalChatSessions}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription>Total Score</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.totalScore.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription>Targets Destroyed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{stats.totalDestroyed}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription>Avg. Intensity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold" style={{ color: `hsl(${Math.max(0, 30 - stats.avgIntensity * 0.3)}, 90%, 60%)` }}>
              {stats.avgIntensity}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/game">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Release Anger
          </Button>
        </Link>
        <Link href="/chat">
          <Button variant="outline" className="border-primary/50 hover:bg-primary/10 bg-transparent">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Find Peace
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Game Sessions */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              Recent Game Sessions
            </CardTitle>
            <CardDescription>Your anger release history</CardDescription>
          </CardHeader>
          <CardContent>
            {gameSessions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="mb-4 text-muted-foreground">No game sessions yet</p>
                <Link href="/game">
                  <Button variant="outline" size="sm">
                    Start Your First Session
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {gameSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{formatDate(session.created_at)}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.targets_destroyed} targets destroyed
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent">{session.score}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Sessions */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
              Recent Chat Sessions
            </CardTitle>
            <CardDescription>Your conversations with the AI therapist</CardDescription>
          </CardHeader>
          <CardContent>
            {chatSessions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="mb-4 text-muted-foreground">No chat sessions yet</p>
                <Link href="/chat">
                  <Button variant="outline" size="sm">
                    Start a Conversation
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{formatDate(session.created_at)}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.chat_messages?.[0]?.count || 0} messages exchanged
                      </p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Wellness Tip */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Wellness Tip</h3>
              <p className="text-sm text-muted-foreground">
                Regular practice makes progress. Try to use CALMER whenever you feel anger building up, 
                rather than waiting for it to overwhelm you. The game helps release immediate tension, 
                while the chat helps you understand and process the underlying emotions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
