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

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  onAvatarUpdate: (url: string) => void
}

export function AvatarUpload({ currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleAvatarUpdate = (url: string) => {
    onAvatarUpdate(url)
    setOpen(false)
    toast({
      title: "Success",
      description: "Your profile picture has been updated.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Change Profile Picture
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture or take a photo using your camera.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ImageUpload
            currentImageUrl={currentAvatarUrl}
            onImageUpdate={handleAvatarUpdate}
            aspectRatio="square"
            maxWidth={400}
            maxHeight={400}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 