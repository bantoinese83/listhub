"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ImagePlus, X, Upload, AlertCircle, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MAX_FILE_SIZE, MAX_IMAGES_PER_LISTING } from "@/lib/constants"

interface ImageUploadZoneProps {
  images: File[]
  setImages: React.Dispatch<React.SetStateAction<File[]>>

  disabled?: boolean
  error?: string | null
  onError?: (error: string) => void
}

export default function ImageUploadZone({ images, setImages, disabled = false, error, onError }: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const validateFiles = (files: File[]): boolean => {
    // Check file types
    const invalidFiles = files.filter((file) => !file.type.startsWith("image/"))
    if (invalidFiles.length > 0) {
      onError?.("Only image files are allowed")
      return false
    }

    // Check file sizes
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE)
    if (oversizedFiles.length > 0) {
      onError?.(`Files must be smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
      return false
    }

    // Check total number of images
    if (images.length + files.length > MAX_IMAGES_PER_LISTING) {
      onError?.(`Maximum ${MAX_IMAGES_PER_LISTING} images allowed`)
      return false
    }

    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files)

      if (validateFiles(fileArray)) {
        setImages((prev) => [...prev, ...fileArray])
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const files = e.target.files
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)

    if (validateFiles(fileArray)) {
      setImages((prev) => [...prev, ...fileArray])
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraActive(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      onError?.("Could not access camera. Please try again.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
      setCountdown(null)
    }
  }

  const startCountdown = () => {
    setCountdown(3)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          capturePhoto()
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" })
          if (validateFiles([file])) {
            setImages((prev) => [...prev, file])
          }
        }
        stopCamera()
      }, 'image/jpeg')
    }
  }

  const removeImage = (index: number) => {
    if (disabled) return
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || images.length >= MAX_IMAGES_PER_LISTING}
          className="relative overflow-hidden"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Images
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleFileChange}
            disabled={disabled || images.length >= MAX_IMAGES_PER_LISTING}
          />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={startCamera}
          disabled={disabled || images.length >= MAX_IMAGES_PER_LISTING}
        >
          <Camera className="mr-2 h-4 w-4" />
          Use Camera
        </Button>
        <p className="text-sm text-muted-foreground">Upload up to {MAX_IMAGES_PER_LISTING} images (PNG, JPG, WEBP)</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AnimatePresence>
        {isCameraActive ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold text-white bg-black/50 rounded-full w-20 h-20 flex items-center justify-center">
                    {countdown}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-2">
              <Button onClick={startCountdown}>Take Photo</Button>
              <Button variant="outline" onClick={stopCamera}>Cancel</Button>
            </div>
          </motion.div>
        ) : images.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
          >
            {images.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="group relative aspect-square"
              >
                <Image
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  fill
                  className="rounded-md object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6 rounded-full p-0 opacity-80 transition-opacity group-hover:opacity-100"
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </motion.div>
            ))}
            {images.length < MAX_IMAGES_PER_LISTING && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex aspect-square items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:bg-muted"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <ImagePlus className="h-8 w-8" />
                <span className="sr-only">Add more images</span>
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex h-40 flex-col items-center justify-center rounded-md border-2 border-dashed ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/50"
            } text-center transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">Drag and drop images here or click to browse</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Recommended: High-quality images help your listing stand out
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

