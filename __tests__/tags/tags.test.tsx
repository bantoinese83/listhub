import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { mockListing } from '../utils/test-utils'
import TagInput from '@/components/tags/TagInput'
import TagList from '@/components/tags/TagList'
import TagSuggestions from '@/components/tags/TagSuggestions'

describe('Tag Management', () => {
  describe('TagInput', () => {
    it('should handle tag creation', async () => {
      const onAdd = jest.fn()
      render(<TagInput onAdd={onAdd} />)

      fireEvent.change(screen.getByPlaceholderText(/add tag/i), {
        target: { value: 'new tag' },
      })
      fireEvent.keyDown(screen.getByPlaceholderText(/add tag/i), {
        key: 'Enter',
        code: 'Enter',
      })

      await waitFor(() => {
        expect(onAdd).toHaveBeenCalledWith('new tag')
      })
    })

    it('should handle tag validation', async () => {
      render(<TagInput onAdd={jest.fn()} />)

      fireEvent.change(screen.getByPlaceholderText(/add tag/i), {
        target: { value: 'a' }, // Too short
      })
      fireEvent.keyDown(screen.getByPlaceholderText(/add tag/i), {
        key: 'Enter',
        code: 'Enter',
      })

      expect(screen.getByText(/tag must be at least 2 characters/i)).toBeInTheDocument()
    })

    it('should handle duplicate tags', async () => {
      const onAdd = jest.fn()
      render(<TagInput onAdd={onAdd} existingTags={['existing tag']} />)

      fireEvent.change(screen.getByPlaceholderText(/add tag/i), {
        target: { value: 'existing tag' },
      })
      fireEvent.keyDown(screen.getByPlaceholderText(/add tag/i), {
        key: 'Enter',
        code: 'Enter',
      })

      expect(screen.getByText(/tag already exists/i)).toBeInTheDocument()
      expect(onAdd).not.toHaveBeenCalled()
    })
  })

  describe('TagList', () => {
    const mockTags = ['tag1', 'tag2', 'tag3']

    it('should display tags', () => {
      render(<TagList tags={mockTags} />)

      expect(screen.getByText('tag1')).toBeInTheDocument()
      expect(screen.getByText('tag2')).toBeInTheDocument()
      expect(screen.getByText('tag3')).toBeInTheDocument()
    })

    it('should handle tag removal', async () => {
      const onRemove = jest.fn()
      render(<TagList tags={mockTags} onRemove={onRemove} />)

      fireEvent.click(screen.getByRole('button', { name: /remove tag1/i }))

      await waitFor(() => {
        expect(onRemove).toHaveBeenCalledWith('tag1')
      })
    })

    it('should handle tag selection', async () => {
      const onSelect = jest.fn()
      render(<TagList tags={mockTags} onSelect={onSelect} />)

      fireEvent.click(screen.getByText('tag1'))

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith('tag1')
      })
    })
  })

  describe('TagSuggestions', () => {
    const mockSuggestions = [
      { tag: 'suggestion1', count: 10 },
      { tag: 'suggestion2', count: 5 },
      { tag: 'suggestion3', count: 3 },
    ]

    it('should display tag suggestions', () => {
      render(<TagSuggestions suggestions={mockSuggestions} />)

      expect(screen.getByText('suggestion1')).toBeInTheDocument()
      expect(screen.getByText('suggestion2')).toBeInTheDocument()
      expect(screen.getByText('suggestion3')).toBeInTheDocument()
    })

    it('should handle suggestion selection', async () => {
      const onSelect = jest.fn()
      render(<TagSuggestions suggestions={mockSuggestions} onSelect={onSelect} />)

      fireEvent.click(screen.getByText('suggestion1'))

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith('suggestion1')
      })
    })

    it('should filter suggestions based on input', async () => {
      render(<TagSuggestions suggestions={mockSuggestions} />)

      fireEvent.change(screen.getByPlaceholderText(/search tags/i), {
        target: { value: 'sug' },
      })

      await waitFor(() => {
        expect(screen.getByText('suggestion1')).toBeInTheDocument()
        expect(screen.getByText('suggestion2')).toBeInTheDocument()
        expect(screen.getByText('suggestion3')).toBeInTheDocument()
      })
    })

    it('should handle empty suggestions', () => {
      render(<TagSuggestions suggestions={[]} />)

      expect(screen.getByText(/no suggestions found/i)).toBeInTheDocument()
    })
  })
}) 