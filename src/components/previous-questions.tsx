"use client"

import type { Message } from "@/types/chat"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, History } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface PreviousQuestionsProps {
  messages: Message[]
  onSelect: (question: string) => void
}

export default function PreviousQuestions({ messages, onSelect }: PreviousQuestionsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Get only user messages and reverse to show newest first
  const userMessages = [...messages].reverse().slice(0, isExpanded ? messages.length : 3)

  if (messages.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-moonlight flex items-center">
          <History className="h-3 w-3 mr-1 text-stellar" />
          Previous Questions
        </h3>
        {messages.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 px-2 text-nebula hover:text-moonlight hover:bg-meteor/50"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show More
              </>
            )}
          </Button>
        )}
      </div>

      <ul className="space-y-1">
        {userMessages.map((message, index) => (
          <li key={message.id}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start text-left text-nebula hover:text-moonlight truncate h-auto py-1 px-2 rounded border border-transparent",
                "hover:bg-cosmic/20 hover:border-cosmic/30 transition-all duration-200",
                index === 0 && "border-cosmic/30 bg-cosmic/10",
              )}
              onClick={() => onSelect(message.content)}
            >
              {message.content}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
