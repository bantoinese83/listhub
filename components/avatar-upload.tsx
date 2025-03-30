"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ImageUpload } from "@/components/image-upload"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  onAvatarUpdate: (url: string) => void
}

export function AvatarUpload({ currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAvatarUpdate = async (url: string) => {
    try {
      setIsLoading(true)
      onAvatarUpdate(url)
      setOpen(false)
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Change Avatar"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogDescription>
            Take a photo with your camera or upload an image.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ImageUpload
            currentImageUrl={currentAvatarUrl}
            onImageUpdate={handleAvatarUpdate}
            aspectRatio="square"
            maxWidth={400}
            maxHeight={400}
            className="w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 