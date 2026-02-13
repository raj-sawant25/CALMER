'use client'

import React from "react"

import { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  life: number
  maxLife: number
}

interface Target {
  x: number
  y: number
  radius: number
  color: string
  health: number
  maxHealth: number
  type: 'normal' | 'tough' | 'explosive'
}

export function AngerReleaseGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [destroyedCount, setDestroyedCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [intensity, setIntensity] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const particlesRef = useRef<Particle[]>([])
  const targetsRef = useRef<Target[]>([])
  const animationRef = useRef<number>()
  const lastSpawnRef = useRef(0)

  const colors = {
    normal: ['#ef4444', '#f97316', '#eab308'],
    tough: ['#6366f1', '#8b5cf6', '#a855f7'],
    explosive: ['#ec4899', '#f43f5e', '#fb7185'],
  }

  const spawnTarget = useCallback((canvas: HTMLCanvasElement) => {
    const types: Target['type'][] = ['normal', 'normal', 'normal', 'tough', 'explosive']
    const type = types[Math.floor(Math.random() * types.length)]
    
    const baseRadius = type === 'tough' ? 50 : type === 'explosive' ? 35 : 40
    const radius = baseRadius + Math.random() * 20
    
    const target: Target = {
      x: radius + Math.random() * (canvas.width - radius * 2),
      y: radius + Math.random() * (canvas.height - radius * 2),
      radius,
      color: colors[type][Math.floor(Math.random() * colors[type].length)],
      health: type === 'tough' ? 5 : type === 'explosive' ? 1 : 3,
      maxHealth: type === 'tough' ? 5 : type === 'explosive' ? 1 : 3,
      type,
    }
    
    targetsRef.current.push(target)
  }, [])

  const createExplosion = useCallback((x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = 3 + Math.random() * 5
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 5,
        color,
        life: 60,
        maxLife: 60,
      })
    }
  }, [])

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying || gameOver) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)
    
    // Create click particles
    createExplosion(x, y, '#ffffff', 8)
    
    // Check target hits
    targetsRef.current = targetsRef.current.filter((target) => {
      const dx = x - target.x
      const dy = y - target.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < target.radius) {
        target.health--
        setIntensity((prev) => Math.min(100, prev + 5))
        
        if (target.health <= 0) {
          // Target destroyed
          const points = target.type === 'tough' ? 50 : target.type === 'explosive' ? 30 : 10
          setScore((prev) => prev + points)
          setDestroyedCount((prev) => prev + 1)
          
          // Explosion effect
          const particleCount = target.type === 'explosive' ? 40 : 20
          createExplosion(target.x, target.y, target.color, particleCount)
          
          // Chain explosion for explosive targets
          if (target.type === 'explosive') {
            targetsRef.current.forEach((otherTarget) => {
              const odx = target.x - otherTarget.x
              const ody = target.y - otherTarget.y
              const odist = Math.sqrt(odx * odx + ody * ody)
              if (odist < 150 && otherTarget !== target) {
                otherTarget.health -= 2
              }
            })
          }
          
          return false
        } else {
          // Target hit but not destroyed
          createExplosion(target.x, target.y, target.color, 5)
        }
      }
      return true
    })
  }, [isPlaying, gameOver, createExplosion])

  const startGame = useCallback(() => {
    setScore(0)
    setDestroyedCount(0)
    setTimeLeft(60)
    setIntensity(0)
    setGameOver(false)
    setIsPlaying(true)
    targetsRef.current = []
    particlesRef.current = []
  }, [])

  const saveSession = useCallback(async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase.from('game_sessions').insert({
        user_id: user.id,
        score,
        targets_destroyed: destroyedCount,
        duration_seconds: 60,
        intensity_level: intensity,
      })
    }
    setSaving(false)
  }, [score, destroyedCount, intensity])

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gameLoop = (timestamp: number) => {
      // Clear canvas
      ctx.fillStyle = `rgba(20, 24, 38, ${0.3 + intensity * 0.003})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Spawn targets
      if (timestamp - lastSpawnRef.current > 1000 - intensity * 5) {
        spawnTarget(canvas)
        lastSpawnRef.current = timestamp
      }

      // Update and draw targets
      targetsRef.current.forEach((target) => {
        // Pulsing effect
        const pulse = Math.sin(timestamp * 0.005) * 3
        
        // Glow
        const gradient = ctx.createRadialGradient(
          target.x, target.y, 0,
          target.x, target.y, target.radius + pulse + 20
        )
        gradient.addColorStop(0, target.color)
        gradient.addColorStop(0.7, target.color + '40')
        gradient.addColorStop(1, 'transparent')
        
        ctx.beginPath()
        ctx.arc(target.x, target.y, target.radius + pulse + 20, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Main circle
        ctx.beginPath()
        ctx.arc(target.x, target.y, target.radius + pulse, 0, Math.PI * 2)
        ctx.fillStyle = target.color
        ctx.fill()

        // Health indicator
        if (target.maxHealth > 1) {
          const healthPercent = target.health / target.maxHealth
          ctx.beginPath()
          ctx.arc(target.x, target.y, target.radius * 0.6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * healthPercent)
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 3
          ctx.stroke()
        }

        // Type indicator
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 16px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const icon = target.type === 'explosive' ? '!' : target.type === 'tough' ? 'X' : ''
        ctx.fillText(icon, target.x, target.y)
      })

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.1 // gravity
        particle.life--
        particle.vx *= 0.98
        particle.vy *= 0.98

        const alpha = particle.life / particle.maxLife
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius * alpha, 0, Math.PI * 2)
        ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()

        return particle.life > 0
      })

      // Intensity decay
      setIntensity((prev) => Math.max(0, prev - 0.1))

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, gameOver, intensity, spawnTarget])

  // Timer
  useEffect(() => {
    if (!isPlaying || gameOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true)
          setIsPlaying(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, gameOver])

  // Save on game over
  useEffect(() => {
    if (gameOver && score > 0) {
      saveSession()
    }
  }, [gameOver, score, saveSession])

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{score}</p>
            <p className="text-xs text-muted-foreground">Score</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{destroyedCount}</p>
            <p className="text-xs text-muted-foreground">Destroyed</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{timeLeft}s</p>
            <p className="text-xs text-muted-foreground">Time Left</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: `hsl(${Math.max(0, 30 - intensity * 0.3)}, 90%, 60%)` }}>
              {Math.round(intensity)}%
            </p>
            <p className="text-xs text-muted-foreground">Intensity</p>
          </CardContent>
        </Card>
      </div>

      {/* Game Canvas */}
      <div className="relative overflow-hidden rounded-xl border border-border game-glow">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onClick={handleCanvasClick}
          className="w-full cursor-crosshair bg-background"
          style={{ aspectRatio: '800/500' }}
        />
        
        {/* Overlay states */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
            <h2 className="mb-4 text-2xl font-bold">Ready to Release?</h2>
            <p className="mb-6 max-w-md text-center text-muted-foreground">
              Click on targets to destroy them. Different targets have different effects.
              Let out your frustration!
            </p>
            <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-red-500" />
                <p className="text-muted-foreground">Normal (10pts)</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-violet-500" />
                <p className="text-muted-foreground">Tough (50pts)</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-pink-500" />
                <p className="text-muted-foreground">Explosive (30pts)</p>
              </div>
            </div>
            <Button onClick={startGame} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Start Session
            </Button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
            <h2 className="mb-2 text-3xl font-bold">Session Complete</h2>
            <p className="mb-6 text-muted-foreground">
              {saving ? 'Saving your session...' : 'Great job releasing that energy!'}
            </p>
            <div className="mb-8 grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary">{score}</p>
                <p className="text-sm text-muted-foreground">Final Score</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent">{destroyedCount}</p>
                <p className="text-sm text-muted-foreground">Targets Destroyed</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={startGame} variant="outline">
                Play Again
              </Button>
              <Link href="/chat">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Find Peace Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> After releasing your anger here, 
            transition to our AI therapist chat to process your emotions and find lasting peace.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
