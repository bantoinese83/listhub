"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import ProfileForm from "./ProfileForm"
import ProfileSettings from "./ProfileSettings"
import ProfileStats from "./ProfileStats"
import { toast } from "sonner"

interface ProfileClientProps {
  user: {
    id: string
    email: string | null
  }
  profile: {
    full_name: string | null
    phone: string | null
    bio: string | null
    avatar_url: string | null
    location: string | null
    website: string | null
  }
  stats: {
    views: number
    likes: number
    shares: number
    messages: number
    followers: number
    following: number
    ratings: number
    averageRating: number
    viewsHistory: Array<{ date: string; views: number }>
  }
}

export default function ProfileClient({ user, profile, stats }: ProfileClientProps) {
  const supabase = createClientComponentClient()

  const handleProfileUpdate = async (data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.name,
          email: data.email,
          phone: data.phone,
          bio: data.bio,
          location: data.location,
          website: data.website,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleSettingsUpdate = async (settings: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: settings.notifications,
          privacy_settings: settings.privacy,
          security_settings: settings.security,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Settings updated successfully')
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    }
  }

  const handleAccountDelete = async () => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (error) throw error
      toast.success('Account deleted successfully')
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}/${Date.now()}`, file)

      if (error) throw error

      if (data) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: data.path })
          .eq('id', user.id)

        if (updateError) throw updateError
        toast.success('Avatar updated successfully')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload avatar')
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-8">
        <ProfileForm
          user={{
            id: user.id,
            name: profile.full_name || '',
            email: user.email || '',
            phone: profile.phone || '',
            bio: profile.bio || '',
            avatar_url: profile.avatar_url || '',
            location: profile.location || '',
            website: profile.website || '',
          }}
          onSubmit={handleProfileUpdate}
          onAvatarUpload={handleAvatarUpload}
        />

        <ProfileStats stats={stats} />
      </div>

      <div>
        <ProfileSettings
          onUpdateSettings={handleSettingsUpdate}
          onDeleteAccount={handleAccountDelete}
        />
      </div>
    </div>
  )
} 