"use client"

import { useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { useBeforeUnload } from "@/hooks/use-before-unload"

export function useFormPersistence(form: UseFormReturn<any>, key: string) {
  useEffect(() => {
    // Load saved form data
    const savedData = localStorage.getItem(key)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        form.reset(parsedData)
      } catch (error) {
        console.error("Error loading saved form data:", error)
      }
    }

    // Save form data on change
    const subscription = form.watch((value) => {
      localStorage.setItem(key, JSON.stringify(value))
    })

    return () => subscription.unsubscribe()
  }, [form, key])

  const isDirty = Object.keys(form.formState.dirtyFields).length > 0

  // Handle unsaved changes warning
  useBeforeUnload(
    isDirty,
    "You have unsaved changes. Are you sure you want to leave?"
  )

  return {
    clearSavedData: () => localStorage.removeItem(key),
  }
} 