"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageUpdate: (url: string) => void
  aspectRatio?: "square" | "video" | "landscape"
  maxWidth?: number
  maxHeight?: number
  className?: string
}

export function ImageUpload({ 
  currentImageUrl, 
  onImageUpdate, 
  aspectRatio = "square",
  maxWidth = 1280,
  maxHeight = 720,
  className = ""
}: ImageUploadProps) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { user, session, loading, signOut } = useAuth()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: maxWidth },
          height: { ideal: maxHeight }
        } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraActive(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Error",
        description: "Could not access camera. Please try again.",
        variant: "destructive",
      })
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
      const photoUrl = canvas.toDataURL('image/jpeg')
      setPreviewUrl(photoUrl)
      stopCamera()
    }
  }

  const uploadImage = async () => {
    if (!previewUrl) return

    try {
      if (loading) {
        console.log('Auth is still loading...')
        return
      }

      if (!user || !session) {
        console.log('No user or session found:', { user, session })
        toast({
          title: "Authentication Required",
          description: "Please sign in to upload images.",
          variant: "destructive",
        })
        router.push("/auth/signin")
        return
      }

      console.log('Uploading image for user:', user.id)

      // Convert base64 to blob
      const response = await fetch(previewUrl)
      const blob = await response.blob()
      const file = new File([blob], "image.jpg", { type: "image/jpeg" })

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      
      // For avatars, include the user's ID in the path
      const filePath = aspectRatio === "square" 
        ? `${user.id}/${fileName}`
        : fileName

      // Determine which bucket to use based on the aspect ratio
      const bucketName = aspectRatio === "square" ? "avatars" : "listing-images"

      console.log('Uploading to bucket:', bucketName, 'with path:', filePath)

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file)

      if (uploadError) {
        console.error("Upload error:", uploadError)
        if (uploadError.message.includes("Auth session missing")) {
          console.log('Session missing, attempting to refresh...')
          const { data: { session: newSession }, error: refreshError } = await supabase.auth.getSession()
          
          if (refreshError || !newSession) {
            console.error('Failed to refresh session:', refreshError)
            await signOut()
            router.push("/auth/signin")
            return
          }
          
          // Retry upload with new session
          const { error: retryError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file)
            
          if (retryError) throw retryError
        } else {
          throw uploadError
        }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      // Update the user's profile with the new avatar URL
      if (aspectRatio === "square") {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating profile:', updateError)
          throw updateError
        }

        // Update the user's metadata with the new avatar URL
        const { error: updateUserError } = await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        })

        if (updateUserError) {
          console.error('Error updating user metadata:', updateUserError)
          throw updateUserError
        }
      }

      onImageUpdate(publicUrl)
      setPreviewUrl(null)

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })

      // Refresh the page to show the new avatar
      router.refresh()
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    landscape: "aspect-[16/9]"
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {isCameraActive ? (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`w-full rounded-lg ${aspectRatioClasses[aspectRatio]}`}
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
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`relative ${aspectRatioClasses[aspectRatio]}`}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-muted flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex justify-center gap-2">
            <Button onClick={startCamera}>
              <Camera className="mr-2 h-4 w-4" />
              Use Camera
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </div>
      )}
      {previewUrl && (
        <Button onClick={uploadImage} className="w-full">
          Save Image
        </Button>
      )}
    </div>
  )
} 