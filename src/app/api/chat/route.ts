// src/app/api/chat/route.ts

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Log messages to ensure they are being passed correctly
    console.log("Received messages:", messages)

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Smarty Chatbot',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick:free',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          ...messages,
        ],
      }),
    })

    const data = await res.json()

    if (!data?.choices?.[0]?.message?.content) {
      throw new Error('No valid response from the API')
    }

    const reply = data?.choices?.[0]?.message?.content
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error in API route:', error.message)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
