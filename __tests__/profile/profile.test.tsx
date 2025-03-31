import React from 'react'
import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { mockUser } from '../utils/test-utils'
import ProfileForm from '@/components/profile/ProfileForm'
import ProfileSettings from '@/components/profile/ProfileSettings'
import ProfileStats from '@/components/profile/ProfileStats'

describe('User Profile', () => {
  describe('ProfileForm', () => {
    it('should handle profile update', async () => {
      const onSubmit = jest.fn()
      render(<ProfileForm user={mockUser} onSubmit={onSubmit} />)

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'New Name' },
      })
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'new@example.com' },
      })
      fireEvent.change(screen.getByLabelText(/phone/i), {
        target: { value: '+1234567890' },
      })
      fireEvent.click(screen.getByRole('button', { name: /update profile/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'New Name',
          email: 'new@example.com',
          phone: '+1234567890',
        })
      })
    })

    it('should validate required fields', async () => {
      const onSubmit = jest.fn()
      render(<ProfileForm user={{ ...mockUser, name: '', email: '' }} onSubmit={onSubmit} />)

      // Clear the form fields
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '' } })
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } })

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /update profile/i }))

      // Wait for error messages to appear
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      })

      // Verify that onSubmit was not called
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('should handle avatar upload', async () => {
      const onAvatarUpload = jest.fn()
      render(<ProfileForm user={mockUser} onAvatarUpload={onAvatarUpload} />)

      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      const input = screen.getByLabelText(/upload avatar/i)
      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(onAvatarUpload).toHaveBeenCalledWith(file)
      })
    })
  })

  describe('ProfileSettings', () => {
    it('should handle notification settings', async () => {
      const onNotificationChange = jest.fn()
      render(<ProfileSettings user={mockUser} onNotificationChange={onNotificationChange} />)

      fireEvent.change(screen.getByLabelText(/email notifications/i), {
        target: { checked: true },
      })
      fireEvent.change(screen.getByLabelText(/push notifications/i), {
        target: { checked: false },
      })

      await waitFor(() => {
        expect(onNotificationChange).toHaveBeenCalledWith({
          email: true,
          push: false,
        })
      })
    })

    it('should handle privacy settings', async () => {
      const onPrivacyChange = jest.fn()
      render(<ProfileSettings user={mockUser} onPrivacyChange={onPrivacyChange} />)

      fireEvent.change(screen.getByLabelText(/show email/i), {
        target: { checked: false },
      })
      fireEvent.change(screen.getByLabelText(/show phone/i), {
        target: { checked: true },
      })

      await waitFor(() => {
        expect(onPrivacyChange).toHaveBeenCalledWith({
          showEmail: false,
          showPhone: true,
        })
      })
    })

    it('should handle account deletion', async () => {
      const onDelete = jest.fn()
      render(<ProfileSettings user={mockUser} onDelete={onDelete} />)

      fireEvent.click(screen.getByRole('button', { name: /delete account/i }))
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

      await waitFor(() => {
        expect(onDelete).toHaveBeenCalledWith(mockUser.id)
      })
    })
  })

  describe('ProfileStats', () => {
    const mockStats = {
      listings: {
        total: 10,
        active: 5,
        sold: 3,
        pending: 2,
      },
      views: {
        total: 1000,
        unique: 800,
        average: 100,
      },
      contacts: {
        total: 50,
        responded: 30,
        pending: 20,
      },
    }

    it('should display profile statistics', () => {
      render(<ProfileStats stats={mockStats} />)

      expect(screen.getByText(/10 total listings/i)).toBeInTheDocument()
      expect(screen.getByText(/5 active listings/i)).toBeInTheDocument()
      expect(screen.getByText(/1000 total views/i)).toBeInTheDocument()
      expect(screen.getByText(/50 total contacts/i)).toBeInTheDocument()
    })

    it('should handle time range selection', async () => {
      const onTimeRangeChange = jest.fn()
      render(<ProfileStats stats={mockStats} onTimeRangeChange={onTimeRangeChange} />)

      fireEvent.change(screen.getByLabelText(/time range/i), {
        target: { value: '30d' },
      })

      await waitFor(() => {
        expect(onTimeRangeChange).toHaveBeenCalledWith('30d')
      })
    })

    it('should handle data export', async () => {
      const onExport = jest.fn()
      render(<ProfileStats stats={mockStats} onExport={onExport} />)

      fireEvent.click(screen.getByRole('button', { name: /export stats/i }))

      await waitFor(() => {
        expect(onExport).toHaveBeenCalledWith(mockStats)
      })
    })
  })
}) 