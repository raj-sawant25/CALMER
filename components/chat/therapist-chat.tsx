'use client'

import React from "react"

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

function getUIMessageText(
  msg: { parts?: Array<{ type: 'text' | string; text?: string }> }): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ''
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

export function TherapistChat() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [input, setInput] = useState('')

  const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isStreaming = status === 'streaming'
  const isSubmitting = status === 'submitted'

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Create session on first message
  useEffect(() => {
    const createSession = async () => {
      if (messages.length === 1 && !sessionId) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data } = await supabase
            .from('chat_sessions')
            .insert({ user_id: user.id })
            .select('id')
            .single()
          
          if (data) {
            setSessionId(data.id)
          }
        }
      }
    }
    createSession()
  }, [messages.length, sessionId])

  // Save messages to database
  useEffect(() => {
    const saveMessage = async () => {
      if (!sessionId || messages.length === 0 || isSaving) return
      
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant' && status === 'ready') {
        setIsSaving(true)
        const supabase = createClient()
        
        // Save all unsaved messages
        const messagesToSave = messages.map((msg) => ({
          session_id: sessionId,
          role: msg.role,
          content: getUIMessageText(msg),
        }))
        
        // Clear existing and insert all
        await supabase.from('chat_messages').delete().eq('session_id', sessionId)
        await supabase.from('chat_messages').insert(messagesToSave)
        
        setIsSaving(false)
      }
    }
    saveMessage()
  }, [messages, sessionId, status, isSaving])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming || isSubmitting) return
    
    sendMessage({ text: input.trim() })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const suggestedPrompts = [
    "I've been feeling really angry lately and I don't know why",
    "I just finished the anger release game. Can we talk?",
    "I need help calming down after a stressful day",
    "I want to understand my emotions better",
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card/30 chat-glow">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium">Welcome to Your Safe Space</h3>
            <p className="mb-6 max-w-md text-sm text-muted-foreground">
              I&apos;m here to listen and support you. Share what&apos;s on your mind, 
              and we&apos;ll work through it together.
            </p>
            <div className="grid w-full max-w-md gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt)
                    inputRef.current?.focus()
                  }}
                  className="rounded-lg border border-border bg-secondary/50 p-3 text-left text-sm transition-colors hover:bg-secondary"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {getUIMessageText(message)}
                  </p>
                </div>
              </div>
            ))}
            {(isStreaming || isSubmitting) && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-secondary px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary animation-delay-150" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary animation-delay-300" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind..."
            className="flex-1 resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            rows={1}
            disabled={isStreaming || isSubmitting}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isStreaming || isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </form>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          This is an AI companion, not a substitute for professional therapy. 
          In crisis? Call 988 (Suicide & Crisis Lifeline)
        </p>
      </div>
    </div>
  )
}
