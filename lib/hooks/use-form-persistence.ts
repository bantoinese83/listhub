"use client"

import { useEffect } from "react"
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form"
import { useBeforeUnload } from "@/hooks/use-before-unload"

export function useFormPersistence<T extends FieldValues>(
  key: string,
  form: UseFormReturn<T>
) {
  const { watch, setValue } = form
  const values = watch()
  const isDirty = Object.keys(form.formState.dirtyFields).length > 0

  // Load saved form data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(key)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as T
        Object.keys(parsedData).forEach((field) => {
          const path = field as Path<T>
          setValue(path, parsedData[field] as PathValue<T, Path<T>>)
        })
      } catch (error) {
        console.error("Error loading saved form data:", error)
      }
    }
  }, [key, setValue])

  // Save form data on change
  useEffect(() => {
    if (isDirty) {
      localStorage.setItem(key, JSON.stringify(values))
    }
  }, [key, values, isDirty])

  // Handle unsaved changes warning
  useBeforeUnload(
    isDirty,
    "You have unsaved changes. Are you sure you want to leave?"
  )

  return {
    clearSavedData: () => localStorage.removeItem(key),
  }
} 