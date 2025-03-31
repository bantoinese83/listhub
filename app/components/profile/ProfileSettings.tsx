"use client"

import React from 'react'
import { Bell, Globe, Lock, Shield, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface ProfileSettingsProps {
  onUpdateSettings: (settings: any) => Promise<void>
  onDeleteAccount: () => Promise<void>
}

export default function ProfileSettings({ onUpdateSettings, onDeleteAccount }: ProfileSettingsProps) {
  const [settings, setSettings] = React.useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true,
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      deviceHistory: true,
    }
  })
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleSettingChange = async (category: string, setting: string, value: boolean | string) => {
    setIsUpdating(true)
    try {
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category as keyof typeof settings],
          [setting]: value
        }
      }
      setSettings(newSettings)
      await onUpdateSettings(newSettings)
      toast.success('Settings updated successfully')
    } catch (error) {
      toast.error('Failed to update settings')
      console.error('Error updating settings:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await onDeleteAccount()
      toast.success('Account deleted successfully')
      setShowConfirmDelete(false)
    } catch (error) {
      toast.error('Failed to delete account')
      console.error('Error deleting account:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>Manage how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={settings.notifications.email}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Switch
              id="push-notifications"
              checked={settings.notifications.push}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications">SMS Notifications</Label>
            <Switch
              id="sms-notifications"
              checked={settings.notifications.sms}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'sms', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-notifications">Marketing Communications</Label>
            <Switch
              id="marketing-notifications"
              checked={settings.notifications.marketing}
              onCheckedChange={(checked) => handleSettingChange('notifications', 'marketing', checked)}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>Control your profile visibility and data sharing preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select
              value={settings.privacy.profileVisibility}
              onValueChange={(value) => handleSettingChange('privacy', 'profileVisibility', value)}
              disabled={isUpdating}
            >
              <SelectTrigger id="profile-visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="contacts">Contacts Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-email">Show Email Address</Label>
            <Switch
              id="show-email"
              checked={settings.privacy.showEmail}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'showEmail', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-phone">Show Phone Number</Label>
            <Switch
              id="show-phone"
              checked={settings.privacy.showPhone}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'showPhone', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-messages">Allow Direct Messages</Label>
            <Switch
              id="allow-messages"
              checked={settings.privacy.allowMessages}
              onCheckedChange={(checked) => handleSettingChange('privacy', 'allowMessages', checked)}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage your account security preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="two-factor">Two-Factor Authentication</Label>
            <Switch
              id="two-factor"
              checked={settings.security.twoFactorAuth}
              onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorAuth', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="login-alerts">Login Alerts</Label>
            <Switch
              id="login-alerts"
              checked={settings.security.loginAlerts}
              onCheckedChange={(checked) => handleSettingChange('security', 'loginAlerts', checked)}
              disabled={isUpdating}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="device-history">Device History</Label>
            <Switch
              id="device-history"
              checked={settings.security.deviceHistory}
              onCheckedChange={(checked) => handleSettingChange('security', 'deviceHistory', checked)}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Lock className="h-5 w-5" />
            Account Management
          </CardTitle>
          <CardDescription>Manage your account settings and data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete your account? This action cannot be undone.
                  All of your data will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
} 