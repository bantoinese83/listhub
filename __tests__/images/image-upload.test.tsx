import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { mockListing } from '../utils/test-utils'
import ImageUpload from '@/components/images/ImageUpload'
import ImageGallery from '@/components/images/ImageGallery'
import ImageEditor from '@/components/images/ImageEditor'

describe('Image Management', () => {
  describe('ImageUpload', () => {
    it('should handle file selection', async () => {
      const onUpload = jest.fn()
      render(<ImageUpload onUpload={onUpload} />)

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const input = screen.getByLabelText(/upload image/i)
      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledWith(file)
      })
    })

    it('should validate file type', async () => {
      const onUpload = jest.fn()
      render(<ImageUpload onUpload={onUpload} />)

      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const input = screen.getByLabelText(/upload image/i)
      fireEvent.change(input, { target: { files: [file] } })

      expect(screen.getByText(/invalid file type/i)).toBeInTheDocument()
      expect(onUpload).not.toHaveBeenCalled()
    })

    it('should handle upload progress', async () => {
      const onUpload = jest.fn()
      render(<ImageUpload onUpload={onUpload} />)

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const input = screen.getByLabelText(/upload image/i)
      fireEvent.change(input, { target: { files: [file] } })

      expect(screen.getByText(/uploading/i)).toBeInTheDocument()
    })
  })

  describe('ImageGallery', () => {
    const mockImages = [
      { id: '1', url: 'image1.jpg', thumbnail: 'thumb1.jpg' },
      { id: '2', url: 'image2.jpg', thumbnail: 'thumb2.jpg' },
    ]

    it('should display images', () => {
      render(<ImageGallery images={mockImages} />)

      expect(screen.getByAltText(/image 1/i)).toBeInTheDocument()
      expect(screen.getByAltText(/image 2/i)).toBeInTheDocument()
    })

    it('should handle image selection', async () => {
      const onSelect = jest.fn()
      render(<ImageGallery images={mockImages} onSelect={onSelect} />)

      fireEvent.click(screen.getByAltText(/image 1/i))

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith(mockImages[0])
      })
    })

    it('should handle image deletion', async () => {
      const onDelete = jest.fn()
      render(<ImageGallery images={mockImages} onDelete={onDelete} />)

      fireEvent.click(screen.getByRole('button', { name: /delete image 1/i }))

      await waitFor(() => {
        expect(onDelete).toHaveBeenCalledWith(mockImages[0].id)
      })
    })
  })

  describe('ImageEditor', () => {
    const mockImage = {
      id: '1',
      url: 'image1.jpg',
      thumbnail: 'thumb1.jpg',
    }

    it('should handle image cropping', async () => {
      const onCrop = jest.fn()
      render(<ImageEditor image={mockImage} onCrop={onCrop} />)

      fireEvent.click(screen.getByRole('button', { name: /crop/i }))
      fireEvent.mouseDown(screen.getByTestId('crop-area'))
      fireEvent.mouseMove(screen.getByTestId('crop-area'))
      fireEvent.mouseUp(screen.getByTestId('crop-area'))
      fireEvent.click(screen.getByRole('button', { name: /apply crop/i }))

      await waitFor(() => {
        expect(onCrop).toHaveBeenCalled()
      })
    })

    it('should handle image rotation', async () => {
      const onRotate = jest.fn()
      render(<ImageEditor image={mockImage} onRotate={onRotate} />)

      fireEvent.click(screen.getByRole('button', { name: /rotate/i }))

      await waitFor(() => {
        expect(onRotate).toHaveBeenCalledWith(90)
      })
    })

    it('should handle image filters', async () => {
      const onFilter = jest.fn()
      render(<ImageEditor image={mockImage} onFilter={onFilter} />)

      fireEvent.change(screen.getByLabelText(/filter/i), {
        target: { value: 'grayscale' },
      })
      fireEvent.click(screen.getByRole('button', { name: /apply filter/i }))

      await waitFor(() => {
        expect(onFilter).toHaveBeenCalledWith('grayscale')
      })
    })
  })
}) 