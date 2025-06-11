import type { NextRequest } from "next/server"

// Define types for better type safety
interface ChatRequest {
  question: string;
  topic?: string;
}

interface ChatResponse {
  text: string;
}

interface ErrorResponse {
  error: string;
}

// API endpoint configuration
const API_ENDPOINT = "https://ai-faq-production.up.railway.app/ask";
const TIMEOUT_MS = 30000; // 30 seconds timeout

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    const body = await req.json();
    console.log("Received request body:", body); // Debug log

    if (!body.question || typeof body.question !== 'string') {
      return new Response(
        JSON.stringify({ error: "Question is required and must be a string" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      console.log("Making request to:", API_ENDPOINT); // Debug log
      
      // Call the Python backend API
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ question: body.question, topic: "general" }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("Response status:", response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", errorData); // Debug log
        throw new Error(
          `Backend API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      // Validate response data
      if (!data.response || typeof data.response !== 'string') {
        console.error("Invalid response format:", data); 
        throw new Error("Invalid response format from backend");
      }

      return new Response(
        JSON.stringify({ text: data.response }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        }
      );
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Request error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in chat route:", error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: "Request timed out" }),
          {
            status: 504,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
