"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Sparkles } from "lucide-react"

interface QuestionInputProps {
  onSubmit: (question: string) => void
  isLoading: boolean
  topic: string
  onTopicChange: (topic: string) => void
}

export default function QuestionInput({ onSubmit, isLoading, topic, onTopicChange }: QuestionInputProps) {
  const [question, setQuestion] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || isLoading) return

    onSubmit(question)
    setQuestion("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`Ask me about any topic!`}
          disabled={isLoading}
          className="flex-1 bg-meteor/50 border-meteor text-moonlight placeholder:text-nebula/70 focus:border-stellar focus:ring-1 focus:ring-stellar/50"
          aria-label="Your question"
        />
        <Button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="bg-cosmic hover:bg-cosmic/80 text-moonlight border border-cosmic/50 hover:shadow-neon-sm transition-all duration-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-moonlight" />
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Ask
            </>
          )}
        </Button>
      </div>
      <div className="flex items-center gap-2 text-sm">
        {/* <span className="text-nebula flex items-center">
          <Sparkles className="h-3 w-3 mr-1 text-stellar" />
          Topic:
        </span>
        <Input
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          className="h-8 max-w-[200px] bg-meteor/50 border-meteor text-moonlight placeholder:text-nebula/70 focus:border-stellar focus:ring-1 focus:ring-stellar/50"
          aria-label="Topic"
        /> */}
        {/* <span className="text-nebula/70 text-xs">Change the topic to customize responses</span> */}
      </div>
    </form>
  )
}
