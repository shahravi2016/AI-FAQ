"use client"

import { Button } from "@/components/ui/button"

interface TopicSuggestionsProps {
  onSelectTopic: (topic: string) => void
  currentTopic: string
}

export default function TopicSuggestions({ onSelectTopic, currentTopic }: TopicSuggestionsProps) {
  const suggestedTopics = [
    "artificial intelligence",
    "machine learning",
    "web development",
    "quantum computing",
    "blockchain",
    "cybersecurity",
    "data science",
    "space exploration",
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {suggestedTopics.map((topic) => (
        <Button
          key={topic}
          variant="outline"
          size="sm"
          className={`rounded-full text-xs px-3 py-1 h-auto border ${
            currentTopic === topic
              ? "bg-meteor/30 border-meteor/50 text-nebula hover:bg-cosmic/20 hover:border-cosmic/30 hover:text-moonlight"
              : "bg-meteor/30 border-meteor/50 text-nebula hover:bg-cosmic/20 hover:border-cosmic/30 hover:text-moonlight"
          }`}
          // onClick={() => onSelectTopic(topic)}
        >
          {topic}
        </Button>
      ))}
    </div>
  )
}
