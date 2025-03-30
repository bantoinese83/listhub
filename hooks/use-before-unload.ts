"use client"

import { useEffect } from "react"

export function useBeforeUnload(watch: any, message: string) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (watch) {
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [watch, message])
} 