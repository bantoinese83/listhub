import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { mockListing } from '../utils/test-utils'
import SearchBar from '@/components/search/SearchBar'
import FilterPanel from '@/components/search/FilterPanel'
import SearchResults from '@/components/search/SearchResults'

describe('Search and Filtering', () => {
  describe('SearchBar', () => {
    it('should handle search input', async () => {
      const onSearch = jest.fn()
      render(<SearchBar onSearch={onSearch} />)

      fireEvent.change(screen.getByPlaceholderText(/search listings/i), {
        target: { value: 'vintage car' },
      })
      fireEvent.click(screen.getByRole('button', { name: /search/i }))

      await waitFor(() => {
        expect(onSearch).toHaveBeenCalledWith('vintage car')
      })
    })

    it('should handle search with filters', async () => {
      const onSearch = jest.fn()
      render(<SearchBar onSearch={onSearch} />)

      fireEvent.change(screen.getByPlaceholderText(/search listings/i), {
        target: { value: 'car' },
      })
      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: 'vehicle' },
      })
      fireEvent.change(screen.getByLabelText(/price range/i), {
        target: { value: '20000-30000' },
      })
      fireEvent.click(screen.getByRole('button', { name: /search/i }))

      await waitFor(() => {
        expect(onSearch).toHaveBeenCalledWith({
          query: 'car',
          category: 'vehicle',
          priceRange: '20000-30000',
        })
      })
    })
  })

  describe('FilterPanel', () => {
    it('should apply filters', async () => {
      const onFilter = jest.fn()
      render(<FilterPanel onFilter={onFilter} />)

      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: 'vehicle' },
      })
      fireEvent.change(screen.getByLabelText(/price range/i), {
        target: { value: '20000-30000' },
      })
      fireEvent.change(screen.getByLabelText(/condition/i), {
        target: { value: 'excellent' },
      })
      fireEvent.click(screen.getByRole('button', { name: /apply filters/i }))

      await waitFor(() => {
        expect(onFilter).toHaveBeenCalledWith({
          category: 'vehicle',
          priceRange: '20000-30000',
          condition: 'excellent',
        })
      })
    })

    it('should clear filters', async () => {
      const onFilter = jest.fn()
      render(<FilterPanel onFilter={onFilter} />)

      fireEvent.click(screen.getByRole('button', { name: /clear filters/i }))

      await waitFor(() => {
        expect(onFilter).toHaveBeenCalledWith({})
      })
    })
  })

  describe('SearchResults', () => {
    const mockResults = [
      { ...mockListing, id: '1' },
      { ...mockListing, id: '2', title: 'Another Listing' },
    ]

    it('should display search results', () => {
      render(<SearchResults results={mockResults} />)

      expect(screen.getByText(mockResults[0].title)).toBeInTheDocument()
      expect(screen.getByText(mockResults[1].title)).toBeInTheDocument()
    })

    it('should handle empty results', () => {
      render(<SearchResults results={[]} />)

      expect(screen.getByText(/no results found/i)).toBeInTheDocument()
    })

    it('should handle result selection', async () => {
      const onSelect = jest.fn()
      render(<SearchResults results={mockResults} onSelect={onSelect} />)

      fireEvent.click(screen.getByText(mockResults[0].title))

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith(mockResults[0])
      })
    })

    it('should handle pagination', async () => {
      const onPageChange = jest.fn()
      render(
        <SearchResults
          results={mockResults}
          onPageChange={onPageChange}
          currentPage={1}
          totalPages={3}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /next/i }))

      await waitFor(() => {
        expect(onPageChange).toHaveBeenCalledWith(2)
      })
    })
  })
}) 