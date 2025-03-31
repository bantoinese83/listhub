"use client"

import type React from "react"

import { useState, useRef, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
  maxTags?: number
  className?: string
}

export default function TagInput({
  value = [],
  onChange,
  placeholder = "Add tags...",
  disabled = false,
  maxTags = 10,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Ensure value is always an array
  const tags = Array.isArray(value) ? value : []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    // Add tag on Enter or comma
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue.trim())
    }

    // Remove last tag on Backspace if input is empty
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = (tag: string) => {
    // Normalize tag (lowercase, remove special chars)
    const normalizedTag = tag
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim()

    if (!normalizedTag) return

    // Don't add if already exists or max tags reached
    if (tags.includes(normalizedTag) || tags.length >= maxTags) {
      setInputValue("")
      return
    }

    onChange([...tags, normalizedTag])
    setInputValue("")
  }

  const removeTag = (index: number) => {
    if (disabled) return
    const newTags = [...tags]
    newTags.splice(index, 1)
    onChange(newTags)
  }

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-md border border-input bg-background p-2 focus-within:ring-1 focus-within:ring-ring",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onClick={handleContainerClick}
    >
      {tags.map((tag, index) => (
        <Badge key={`${tag}-${index}`} variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
          {tag}
          {!disabled && (
            <button type="button" onClick={() => removeTag(index)} className="ml-1 rounded-full hover:bg-muted p-0.5">
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          )}
        </Badge>
      ))}

      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        disabled={disabled || tags.length >= maxTags}
        className="flex-1 border-0 p-0 text-sm focus-visible:ring-0 min-w-[120px]"
      />
    </div>
  )
}

