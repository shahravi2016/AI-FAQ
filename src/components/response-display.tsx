"use client"

import type { Message } from "@/types/chat"
import { cn } from "@/lib/utils"
import { ThumbsUp, ThumbsDown, Copy } from "lucide-react"
import { useState } from "react"

interface ResponseDisplayProps {
  messages: Message[]
  isLoading: boolean
}

export default function ResponseDisplay({ messages, isLoading }: ResponseDisplayProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, string>>({})

  const handleFeedback = (messageId: string, type: "positive" | "negative") => {
    setFeedbackGiven((prev) => ({ ...prev, [messageId]: type }))
    // In a real app, you would send this feedback to your backend
    console.log(`Feedback for message ${messageId}: ${type}`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex flex-col p-4 rounded-lg border transition-all duration-300",
            message.role === "user"
              ? "bg-cosmic/20 border-cosmic/30 ml-8 hover:shadow-neon-sm"
              : "bg-meteor/50 border-meteor/50 mr-8 hover:border-aurora/50",
            message.isError && "bg-mars/20 border-mars/50",
          )}
        >
          <div className="flex items-center mb-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                message.role === "user"
                  ? "bg-cosmic border border-cosmic/50"
                  : "bg-gradient-to-r from-aurora to-stellar border border-stellar/50",
                message.isError && "bg-mars border-mars/50",
              )}
            >
              {message.role === "user" ? "U" : "AI"}
            </div>
            <span className="ml-2 text-sm text-nebula">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="whitespace-pre-wrap text-moonlight">{message.content}</div>

          {/* Feedback and copy buttons for AI responses */}
          {message.role === "assistant" && !message.isError && (
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={() => copyToClipboard(message.content)}
                className="p-1 rounded-full hover:bg-meteor/70 text-nebula hover:text-moonlight transition-colors"
                aria-label="Copy response"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={() => handleFeedback(message.id, "positive")}
                className={`p-1 rounded-full hover:bg-meteor/70 transition-colors ${
                  feedbackGiven[message.id] === "positive"
                    ? "text-stellar bg-meteor/70"
                    : "text-nebula hover:text-moonlight"
                }`}
                aria-label="Thumbs up"
              >
                <ThumbsUp size={14} />
              </button>
              <button
                onClick={() => handleFeedback(message.id, "negative")}
                className={`p-1 rounded-full hover:bg-meteor/70 transition-colors ${
                  feedbackGiven[message.id] === "negative"
                    ? "text-mars bg-meteor/70"
                    : "text-nebula hover:text-moonlight"
                }`}
                aria-label="Thumbs down"
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex flex-col p-4 rounded-lg bg-meteor/50 border border-meteor/50 mr-8">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-gradient-to-r from-aurora to-stellar border border-stellar/50">
              AI
            </div>
            <span className="ml-2 text-sm text-nebula">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-nebula">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-stellar animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-stellar animate-pulse delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-stellar animate-pulse delay-300"></div>
            </div>
            <span>Processing your request...</span>
          </div>
        </div>
      )}
    </div>
  )
}
