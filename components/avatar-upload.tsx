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

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  onAvatarUpdate: (url: string) => void
}

export function AvatarUpload({ currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Change Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Avatar</DialogTitle>
          <DialogDescription>
            Take a photo with your camera or upload an image.
          </DialogDescription>
        </DialogHeader>
        <ImageUpload
          currentImageUrl={currentAvatarUrl}
          onImageUpdate={(url) => {
            onAvatarUpdate(url)
            setIsOpen(false)
          }}
          aspectRatio="square"
          maxWidth={400}
          maxHeight={400}
        />
      </DialogContent>
    </Dialog>
  )
} 