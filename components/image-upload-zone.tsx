"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
}

interface ImageUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  error?: string | null
  progress?: number
  maxFiles?: number
}

export default function ImageUploadZone({
  onFilesSelected,
  disabled = false,
  error,
  progress = 0,
  maxFiles = 5,
}: ImageUploadZoneProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Validate file count
      if (previews.length + acceptedFiles.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `You can only upload up to ${maxFiles} images.`,
          variant: "destructive",
        })
        return
      }

      // Validate and process each file
      const validFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          // Validate file size
          if (file.size > MAX_FILE_SIZE) {
            toast({
              title: "File too large",
              description: `${file.name} is larger than 5MB.`,
              variant: "destructive",
            })
            return null
          }

          // Validate file type
          if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
            toast({
              title: "Invalid file type",
              description: `${file.name} is not a valid image file.`,
              variant: "destructive",
            })
            return null
          }

          // Create preview URL
          const previewUrl = URL.createObjectURL(file)

          // Compress image
          const compressedFile = await compressImage(file)

          return { file: compressedFile, previewUrl }
        })
      )

      // Filter out invalid files and update state
      const validResults = validFiles.filter((result): result is { file: File; previewUrl: string } => result !== null)
      
      const newFiles = validResults.map((result) => result.file)
      const newPreviews = validResults.map((result) => result.previewUrl)
      
      setPreviews([...previews, ...newPreviews])
      setSelectedFiles([...selectedFiles, ...newFiles])
      onFilesSelected([...selectedFiles, ...newFiles])
    },
    [maxFiles, onFilesSelected, previews, selectedFiles, toast]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    disabled,
  })

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index])
    const newPreviews = previews.filter((_, i) => i !== index)
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setPreviews(newPreviews)
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive
            ? "Drop the files here"
            : "Drag and drop images here, or click to select files"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: JPG, PNG, WebP (max 5MB)
        </p>
      </div>

      {error && (
        <div className="text-sm text-destructive">
          <p>{error}</p>
        </div>
      )}

      {progress > 0 && (
        <div className="w-full">
          <div className="mb-2 flex justify-between text-sm">
            <span>Uploading images...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={preview} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width
        let height = img.height
        const maxDimension = 1920

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Could not compress image"))
              return
            }

            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })

            resolve(compressedFile)
          },
          file.type,
          0.8 // Quality setting (0.8 = 80%)
        )
      }

      img.onerror = () => {
        reject(new Error("Could not load image"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Could not read file"))
    }
  })
}

