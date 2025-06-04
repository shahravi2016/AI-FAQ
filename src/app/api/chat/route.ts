import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { question, topic } = await req.json()

    // Call the Python backend API
    const response = await fetch("http://localhost:8000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`)
    }

    const data = await response.json()
    return new Response(JSON.stringify({ text: data.response }), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error in chat route:", error)
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
