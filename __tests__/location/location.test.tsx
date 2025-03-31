import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { mockListing } from '../utils/test-utils'
import LocationPicker from '@/components/location/LocationPicker'
import LocationMap from '@/components/location/LocationMap'
import LocationSearch from '@/components/location/LocationSearch'

describe('Location Features', () => {
  describe('LocationPicker', () => {
    it('should handle location selection', async () => {
      const onSelect = jest.fn()
      render(<LocationPicker onSelect={onSelect} />)

      fireEvent.change(screen.getByLabelText(/address/i), {
        target: { value: '123 Main St, City, Country' },
      })
      fireEvent.click(screen.getByRole('button', { name: /select location/i }))

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith({
          address: '123 Main St, City, Country',
          coordinates: expect.any(Object),
        })
      })
    })

    it('should handle geolocation', async () => {
      const mockGeolocation = {
        getCurrentPosition: jest.fn().mockImplementation((success) =>
          success({
            coords: {
              latitude: 40.7128,
              longitude: -74.0060,
            },
          })
        ),
      }
      global.navigator.geolocation = mockGeolocation

      const onSelect = jest.fn()
      render(<LocationPicker onSelect={onSelect} />)

      fireEvent.click(screen.getByRole('button', { name: /use current location/i }))

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith({
          coordinates: {
            lat: 40.7128,
            lng: -74.0060,
          },
        })
      })
    })
  })

  describe('LocationMap', () => {
    const mockLocation = {
      lat: 40.7128,
      lng: -74.0060,
      address: 'New York, NY',
    }

    it('should display location on map', () => {
      render(<LocationMap location={mockLocation} />)

      expect(screen.getByTestId('map')).toBeInTheDocument()
      expect(screen.getByTestId('marker')).toBeInTheDocument()
    })

    it('should handle map interaction', async () => {
      const onLocationChange = jest.fn()
      render(<LocationMap location={mockLocation} onLocationChange={onLocationChange} />)

      fireEvent.click(screen.getByTestId('map'))

      await waitFor(() => {
        expect(onLocationChange).toHaveBeenCalledWith(expect.any(Object))
      })
    })

    it('should handle zoom level changes', async () => {
      const onZoomChange = jest.fn()
      render(<LocationMap location={mockLocation} onZoomChange={onZoomChange} />)

      fireEvent.wheel(screen.getByTestId('map'))

      await waitFor(() => {
        expect(onZoomChange).toHaveBeenCalledWith(expect.any(Number))
      })
    })
  })

  describe('LocationSearch', () => {
    it('should handle address search', async () => {
      const mockGeocode = jest.fn().mockResolvedValue({
        results: [
          {
            formatted_address: '123 Main St, City, Country',
            geometry: {
              location: {
                lat: 40.7128,
                lng: -74.0060,
              },
            },
          },
        ],
      })

      const onSelect = jest.fn()
      render(<LocationSearch onSelect={onSelect} geocode={mockGeocode} />)

      fireEvent.change(screen.getByPlaceholderText(/search address/i), {
        target: { value: '123 Main St' },
      })
      fireEvent.click(screen.getByRole('button', { name: /search/i }))

      await waitFor(() => {
        expect(mockGeocode).toHaveBeenCalledWith('123 Main St')
      })

      fireEvent.click(screen.getByText('123 Main St, City, Country'))

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith({
          address: '123 Main St, City, Country',
          coordinates: {
            lat: 40.7128,
            lng: -74.0060,
          },
        })
      })
    })

    it('should handle search errors', async () => {
      const mockGeocode = jest.fn().mockRejectedValue(new Error('Geocoding failed'))

      render(<LocationSearch onSelect={jest.fn()} geocode={mockGeocode} />)

      fireEvent.change(screen.getByPlaceholderText(/search address/i), {
        target: { value: 'invalid address' },
      })
      fireEvent.click(screen.getByRole('button', { name: /search/i }))

      await waitFor(() => {
        expect(screen.getByText(/geocoding failed/i)).toBeInTheDocument()
      })
    })

    it('should handle search suggestions', async () => {
      const mockGeocode = jest.fn().mockResolvedValue({
        results: [
          {
            formatted_address: '123 Main St, City, Country',
            geometry: {
              location: {
                lat: 40.7128,
                lng: -74.0060,
              },
            },
          },
          {
            formatted_address: '456 Main St, City, Country',
            geometry: {
              location: {
                lat: 40.7129,
                lng: -74.0061,
              },
            },
          },
        ],
      })

      render(<LocationSearch onSelect={jest.fn()} geocode={mockGeocode} />)

      fireEvent.change(screen.getByPlaceholderText(/search address/i), {
        target: { value: 'Main St' },
      })

      await waitFor(() => {
        expect(screen.getByText('123 Main St, City, Country')).toBeInTheDocument()
        expect(screen.getByText('456 Main St, City, Country')).toBeInTheDocument()
      })
    })
  })
}) 