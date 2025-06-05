"use client"

import { useState, useRef, useEffect } from "react"
import type { Message } from "@/types/chat"
import QuestionInput from "./question-input"
import ResponseDisplay from "./response-display"
import PreviousQuestions from "./previous-questions"
import TopicSuggestions from "./topic-suggestions"
import { Button } from "@/components/ui/button"
import { Sparkles, Trash2, Share2 } from "lucide-react"

interface ChatInterfaceProps {
  defaultTopic: string
}

export default function ChatInterface({ defaultTopic }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [topic, setTopic] = useState(defaultTopic)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (question: string) => {
    if (!question.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call our API route instead of the backend directly
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API error: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API response:", data)

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text, // Use data.text as that's what our API route returns
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error generating response:", error)

      // Add error message with more specific error details
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error ? error.message : "Sorry, I couldn't generate a response. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        isError: true,
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTopicChange = (newTopic: string) => {
    setTopic(newTopic)
  }

  const clearConversation = () => {
    setMessages([])
  }

  return (
    <div className="flex flex-col space-y-8">
      {/* Topic Suggestions */}
      <div className="border border-meteor/50 rounded-lg p-4 bg-meteor/30 backdrop-blur-sm">
        <div className="flex items-center mb-3">
          <Sparkles className="h-4 w-4 text-stellar mr-2" />
          <h3 className="text-sm font-medium text-moonlight">Suggested Topics</h3>
        </div>
        <TopicSuggestions onSelectTopic={handleTopicChange} currentTopic={topic} />
      </div>

      {/* Main Chat Interface */}
      <div className="flex flex-col h-[700px] border border-meteor/50 rounded-lg shadow-lg overflow-hidden bg-meteor/30 backdrop-blur-sm relative animate-pulse-glow">
        {/* Decorative elements for futuristic feel */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-stellar/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-aurora/10 rounded-full blur-xl"></div>

        {/* Chat header with actions */}
        <div className="border-b border-meteor/50 p-3 bg-meteor/50 backdrop-blur-sm flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-aurora to-stellar flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-moonlight"
              >
                <path d="M21 12.7a9 9 0 1 1-2.1-5.8"></path>
                <path d="M9 17l6-6"></path>
                <path d="M9 11l6 6"></path>
              </svg>
            </div>
            <span className="text-sm font-medium text-moonlight">AI Assistant</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-nebula hover:text-moonlight hover:bg-meteor/50 flex items-center"
              onClick={() => {}}
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="text-xs">Share</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-nebula hover:text-moonlight hover:bg-meteor/50 flex items-center"
              onClick={clearConversation}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span className="text-xs">Clear</span>
            </Button>
          </div>
        </div>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cosmic scrollbar-track-meteor/30">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-nebula">
                <p className="mb-2">No messages yet</p>
                <p className="text-stellar">
                  Ask me anything about <span className="font-semibold">{topic}</span>!
                </p>
              </div>
            </div>
          ) : (
            <>
              <ResponseDisplay messages={messages} isLoading={isLoading} />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-meteor/50 p-4 bg-meteor/50 backdrop-blur-sm">
          <QuestionInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            topic={topic}
            onTopicChange={handleTopicChange}
          />
        </div>
      </div>

      {/* Previous Questions Section */}
      {messages.length > 0 && (
        <div className="border border-meteor/50 rounded-lg shadow-lg p-5 bg-meteor/30 backdrop-blur-sm relative animate-pulse-glow">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-stellar/10 rounded-full blur-xl"></div>
          <h3 className="text-lg font-medium mb-4 bg-gradient-to-r from-aurora to-stellar bg-clip-text text-transparent">
            Conversation History
          </h3>
          <PreviousQuestions
            messages={messages.filter((m) => m.role === "user")}
            onSelect={(question) => handleSubmit(question)}
          />
        </div>
      )}

      {/* Video Tutorial Section */}
      <div className="border border-meteor/50 rounded-lg shadow-lg overflow-hidden bg-meteor/30 backdrop-blur-sm relative">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-aurora/10 rounded-full blur-xl"></div>
        <div className="p-5">
          <h3 className="text-xl font-medium mb-2 bg-gradient-to-r from-stellar to-cosmic bg-clip-text text-transparent">
            How to Use This AI Assistant
          </h3>
          <p className="text-nebula mb-4">
            Watch this quick tutorial to learn how to get the most out of your AI assistant.
          </p>

          <div className="aspect-video bg-starfield rounded-lg overflow-hidden border border-meteor/50 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-cosmic/30 border border-cosmic/50 flex items-center justify-center mx-auto mb-4 hover:bg-cosmic/50 transition-all cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-moonlight"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <p className="text-nebula">Click to play tutorial video</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-meteor/50 rounded-lg border border-meteor/70">
              <h4 className="font-medium text-moonlight mb-2">1. Ask a Question</h4>
              <p className="text-sm text-nebula">Type your question in the input box and click the Ask button.</p>
            </div>
            <div className="p-4 bg-meteor/50 rounded-lg border border-meteor/70">
              <h4 className="font-medium text-moonlight mb-2">2. Get AI Response</h4>
              <p className="text-sm text-nebula">The AI will process your question and provide a helpful response.</p>
            </div>
            <div className="p-4 bg-meteor/50 rounded-lg border border-meteor/70">
              <h4 className="font-medium text-moonlight mb-2">3. Review History</h4>
              <p className="text-sm text-nebula">View your previous questions and click to ask them again.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
