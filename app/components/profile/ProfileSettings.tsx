import React from 'react'

interface ProfileSettingsProps {
  user: {
    id: string
    name: string
    email: string
  }
  onNotificationChange?: (settings: { email: boolean; push: boolean }) => void
  onPrivacyChange?: (settings: { showEmail: boolean; showPhone: boolean }) => void
  onDelete?: (userId: string) => void
}

export default function ProfileSettings({
  user,
  onNotificationChange,
  onPrivacyChange,
  onDelete,
}: ProfileSettingsProps) {
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)
  const [notificationSettings, setNotificationSettings] = React.useState({
    email: true,
    push: false,
  })
  const [privacySettings, setPrivacySettings] = React.useState({
    showEmail: false,
    showPhone: true,
  })

  React.useEffect(() => {
    if (onNotificationChange) {
      onNotificationChange(notificationSettings)
    }
  }, [notificationSettings, onNotificationChange])

  React.useEffect(() => {
    if (onPrivacyChange) {
      onPrivacyChange(privacySettings)
    }
  }, [privacySettings, onPrivacyChange])

  const handleNotificationChange = (type: 'email' | 'push', checked: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: checked,
    }))
  }

  const handlePrivacyChange = (type: 'showEmail' | 'showPhone', checked: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [type]: checked,
    }))
  }

  return (
    <div>
      <section>
        <h3>Notification Settings</h3>
        <div>
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.email}
              onChange={(e) => handleNotificationChange('email', e.target.checked)}
            />
            Email Notifications
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.push}
              onChange={(e) => handleNotificationChange('push', e.target.checked)}
            />
            Push Notifications
          </label>
        </div>
      </section>

      <section>
        <h3>Privacy Settings</h3>
        <div>
          <label>
            <input
              type="checkbox"
              checked={privacySettings.showEmail}
              onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
            />
            Show Email
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={privacySettings.showPhone}
              onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
            />
            Show Phone
          </label>
        </div>
      </section>

      <section>
        <h3>Account Management</h3>
        <button onClick={() => setShowConfirmDelete(true)}>Delete Account</button>
        {showConfirmDelete && (
          <div>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <button onClick={() => onDelete?.(user.id)}>Confirm</button>
            <button onClick={() => setShowConfirmDelete(false)}>Cancel</button>
          </div>
        )}
      </section>
    </div>
  )
} 