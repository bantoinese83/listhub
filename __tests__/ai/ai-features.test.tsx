import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { mockListing } from '../utils/test-utils'
import ListingAssistant from '@/components/ai/ListingAssistant'
import ContentOptimizer from '@/components/ai/ContentOptimizer'
import PriceAnalyzer from '@/components/ai/PriceAnalyzer'

describe('AI Features', () => {
  describe('ListingAssistant', () => {
    it('should generate listing content from natural language input', async () => {
      const mockGenerate = jest.fn().mockResolvedValue({
        title: 'Vintage Car for Sale',
        description: 'Beautiful vintage car in excellent condition',
        price: 25000,
        category: 'vehicle',
      })

      render(<ListingAssistant onGenerate={mockGenerate} />)

      fireEvent.change(screen.getByLabelText(/describe your listing/i), {
        target: { value: 'I want to sell my vintage car' },
      })
      fireEvent.click(screen.getByRole('button', { name: /generate listing/i }))

      await waitFor(() => {
        expect(mockGenerate).toHaveBeenCalledWith('I want to sell my vintage car')
      })
    })

    it('should handle generation errors', async () => {
      const mockGenerate = jest.fn().mockRejectedValue(new Error('Generation failed'))

      render(<ListingAssistant onGenerate={mockGenerate} />)

      fireEvent.change(screen.getByLabelText(/describe your listing/i), {
        target: { value: 'Invalid input' },
      })
      fireEvent.click(screen.getByRole('button', { name: /generate listing/i }))

      await waitFor(() => {
        expect(screen.getByText(/generation failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('ContentOptimizer', () => {
    it('should optimize listing content', async () => {
      const mockOptimize = jest.fn().mockResolvedValue({
        title: 'Optimized Title',
        description: 'Optimized description with better SEO',
        tags: ['tag1', 'tag2'],
      })

      render(<ContentOptimizer listing={mockListing} onOptimize={mockOptimize} />)

      fireEvent.click(screen.getByRole('button', { name: /optimize content/i }))

      await waitFor(() => {
        expect(mockOptimize).toHaveBeenCalledWith(mockListing)
      })
    })

    it('should suggest improvements', async () => {
      const mockSuggestions = {
        title: 'Add more keywords',
        description: 'Include more details about features',
        images: 'Add more high-quality images',
      }

      render(<ContentOptimizer listing={mockListing} suggestions={mockSuggestions} />)

      expect(screen.getByText(/add more keywords/i)).toBeInTheDocument()
      expect(screen.getByText(/include more details/i)).toBeInTheDocument()
      expect(screen.getByText(/add more high-quality images/i)).toBeInTheDocument()
    })
  })

  describe('PriceAnalyzer', () => {
    it('should analyze market prices', async () => {
      const mockAnalysis = {
        suggestedPrice: 25000,
        marketAverage: 23000,
        priceRange: {
          min: 20000,
          max: 30000,
        },
        factors: ['condition', 'mileage', 'market demand'],
      }

      render(<PriceAnalyzer listing={mockListing} analysis={mockAnalysis} />)

      expect(screen.getByText(/suggested price/i)).toBeInTheDocument()
      expect(screen.getByText(/market average/i)).toBeInTheDocument()
      expect(screen.getByText(/price range/i)).toBeInTheDocument()
      expect(screen.getByText(/factors/i)).toBeInTheDocument()
    })

    it('should handle price updates', async () => {
      const onUpdatePrice = jest.fn()
      render(<PriceAnalyzer listing={mockListing} onUpdatePrice={onUpdatePrice} />)

      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '25000' },
      })
      fireEvent.click(screen.getByRole('button', { name: /update price/i }))

      await waitFor(() => {
        expect(onUpdatePrice).toHaveBeenCalledWith(25000)
      })
    })
  })
}) 