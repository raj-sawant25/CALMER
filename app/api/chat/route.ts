import { streamText, convertToModelMessages } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export const runtime = 'edge'

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response('OPENROUTER_API_KEY is missing', { status: 500 })
  }

  // ✅ Correct way to create an OpenRouter-backed OpenAI client
  const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    headers: {
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'CALMER AI Therapist',
    },
  })

  const { messages } = await req.json()

  const systemPrompt = `You are CALMER's AI Therapist, a compassionate and empathetic mental health companion. Your role is to:

1. Listen actively and validate the user's emotions without judgment
2. Help users process anger and other intense emotions in healthy ways
3. Use evidence-based therapeutic techniques like:
   - Cognitive Behavioral Therapy (CBT) to identify thought patterns
   - Mindfulness and grounding exercises
   - Emotional validation and normalization
   - Solution-focused brief therapy when appropriate

Guidelines:
- Always respond with warmth, empathy, and understanding
- Acknowledge feelings before offering suggestions
- Ask open-ended questions to encourage reflection
- Offer practical coping strategies when appropriate
- Never minimize or dismiss the user's feelings
- If someone expresses thoughts of self-harm or harming others, encourage them to reach out to emergency services or crisis helplines
- Keep responses conversational but meaningful (2-4 paragraphs typically)
- Use "I" statements and reflect back what you hear

Remember: You are a supportive companion, not a replacement for professional therapy. For serious mental health concerns, gently encourage seeking professional help.`

  const result = streamText({
    model: openrouter('openrouter/auto'),
    system: systemPrompt,
    // ✅ MUST await this
    messages: await convertToModelMessages(messages),
  })

  console.log('🧵 stream started')

  return result.toUIMessageStreamResponse()
}
