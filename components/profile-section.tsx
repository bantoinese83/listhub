"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Calendar } from "lucide-react"
import { ProfileEditDialog } from "@/components/profile-edit-dialog"
import { AvatarUpload } from "@/components/avatar-upload"

interface ProfileSectionProps {
  profile: {
    id: string
    full_name: string
    avatar_url: string | null
    created_at: string
  }
  userEmail: string
}

export function ProfileSection({ profile, userEmail }: ProfileSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Your personal information and contact details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name} />
            <AvatarFallback>{profile.full_name[0]}</AvatarFallback>
          </Avatar>
          <AvatarUpload
            currentAvatarUrl={profile.avatar_url}
            onAvatarUpdate={(url) => {
              // Update the profile with the new avatar URL
              window.location.reload()
            }}
          />
          <div className="text-center">
            <h3 className="text-lg font-semibold">{profile.full_name}</h3>
            <p className="text-sm text-muted-foreground">@{profile.full_name.toLowerCase().replace(/\s+/g, '')}</p>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{userEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Member since {new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <ProfileEditDialog profile={profile} onProfileUpdate={() => window.location.reload()} />
      </CardContent>
    </Card>
  )
} 