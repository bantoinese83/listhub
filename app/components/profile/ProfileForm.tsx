import React from 'react'

interface ProfileFormProps {
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
  onSubmit: (data: any) => void
  onAvatarUpload?: (file: File) => void
}

export default function ProfileForm({ user, onSubmit, onAvatarUpload }: ProfileFormProps) {
  const [formData, setFormData] = React.useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  })
  const [errors, setErrors] = React.useState<{ name?: string; email?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { name?: string; email?: string } = {}
    
    // Validate form data
    const name = formData.name.trim()
    const email = formData.email.trim()
    
    if (!name) {
      newErrors.name = 'Name is required'
    }
    if (!email) {
      newErrors.email = 'Email is required'
    }

    // Set errors and prevent form submission if there are errors
    setErrors(newErrors)
    
    // Only submit if there are no errors
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        name,
        email,
        phone: formData.phone.trim()
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when field is changed
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" role="alert" className="text-red-500 text-sm mt-1">
            {errors.name}
          </span>
        )}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" role="alert" className="text-red-500 text-sm mt-1">
            {errors.email}
          </span>
        )}
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="avatar">Upload Avatar</label>
        <input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file && onAvatarUpload) {
              onAvatarUpload(file)
            }
          }}
        />
      </div>
      <button type="submit">Update Profile</button>
    </form>
  )
} 