"use client"

import { useState, useRef, useEffect } from "react"
import type { Message } from "@/types/chat"
import QuestionInput from "./question-input"
import ResponseDisplay from "./response-display"
import PreviousQuestions from "./previous-questions"
import TopicSuggestions from "./topic-suggestions"
import { Button } from "@/components/ui/button"
import { Sparkles, Trash2, Share2 } from "lucide-react"
import Image from "next/image"

interface ChatInterfaceProps {
  defaultTopic: string
}

export default function ChatInterface({ defaultTopic }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [topic, setTopic] = useState(defaultTopic)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (question: string) => {
    if (!question.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
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

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error generating response:", error)

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
    <div className="flex flex-col space-y-6 sm:space-y-8">
      {/* Topic Suggestions */}
      <div className="border border-meteor/50 rounded-lg p-3 sm:p-4 bg-meteor/30 backdrop-blur-sm">
        <div className="flex items-center mb-2 sm:mb-3">
          <Sparkles className="h-4 w-4 text-stellar mr-2" />
          <h3 className="text-sm font-medium text-moonlight">Suggested Topics</h3>
        </div>
        <TopicSuggestions onSelectTopic={handleTopicChange} currentTopic={topic} />
      </div>

      {/* Main Chat Interface */}
      <div className="flex flex-col h-[60vh] min-h-[350px] sm:h-[700px] border border-meteor/50 rounded-lg shadow-lg overflow-hidden bg-meteor/30 backdrop-blur-sm relative animate-pulse-glow">
        {/* Decorative elements for futuristic feel */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-stellar/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-aurora/10 rounded-full blur-xl"></div>

        {/* Chat header with actions */}
        <div className="border-b border-meteor/50 p-2 sm:p-3 bg-meteor/50 backdrop-blur-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 sm:sticky sm:top-0 sm:z-10">
          <div className="flex items-center">
            {/* <div className="w-6 h-6 rounded-full bg-gradient-to-r from-aurora to-stellar flex items-center justify-center mr-2">
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
            </div> */}
            <Image src="/ai-faq-logo-removebg-preview.png" alt="AI Assistant" width={24} height={24} />&nbsp;
            <span className="text-xs sm:text-sm font-medium text-moonlight">AI Assistant</span>
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-nebula hover:text-moonlight hover:bg-meteor/50 flex items-center"
              onClick={() => {}}
            >
              {/* <Share2 className="h-4 w-4 mr-1" /> */}
              {/* <span className="text-xs">Share</span> */}
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
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 scrollbar-thin scrollbar-thumb-cosmic scrollbar-track-meteor/30">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-nebula">
                <p className="mb-2">No messages yet</p>
                <p className="text-stellar">
                  Feel free to ask questions!
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
        <div className="border-t border-meteor/50 p-2 sm:p-4 bg-meteor/50 backdrop-blur-sm">
          <QuestionInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            topic={""}
            onTopicChange={handleTopicChange}
          />
        </div>
      </div>

      {/* Previous Questions Section */}
      {messages.length > 0 && (
        <div className="border border-meteor/50 rounded-lg shadow-lg p-3 sm:p-5 bg-meteor/30 backdrop-blur-sm relative animate-pulse-glow">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-stellar/10 rounded-full blur-xl"></div>
          <h3 className="text-base font-medium mb-2 text-moonlight sm:text-lg sm:mb-4 sm:bg-gradient-to-r sm:from-aurora sm:to-stellar sm:bg-clip-text sm:text-transparent">
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
        <div className="p-3 sm:p-5">
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="p-3 sm:p-4 bg-meteor/50 rounded-lg border border-meteor/70">
              <h4 className="font-medium text-moonlight mb-1 sm:mb-2 text-sm sm:text-base">1. Ask a Question</h4>
              <p className="text-xs sm:text-sm text-nebula">Type your question in the input box and click the Ask button.</p>
            </div>
            <div className="p-3 sm:p-4 bg-meteor/50 rounded-lg border border-meteor/70">
              <h4 className="font-medium text-moonlight mb-1 sm:mb-2 text-sm sm:text-base">2. Get AI Response</h4>
              <p className="text-xs sm:text-sm text-nebula">The AI will process your question and provide a helpful response.</p>
            </div>
            <div className="p-3 sm:p-4 bg-meteor/50 rounded-lg border border-meteor/70">
              <h4 className="font-medium text-moonlight mb-1 sm:mb-2 text-sm sm:text-base">3. Review History</h4>
              <p className="text-xs sm:text-sm text-nebula">View your previous questions and click to ask them again.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
