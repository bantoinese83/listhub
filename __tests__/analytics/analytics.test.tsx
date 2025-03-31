import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { mockListing } from '../utils/test-utils'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'
import AnalyticsChart from '@/components/analytics/AnalyticsChart'
import AnalyticsMetrics from '@/components/analytics/AnalyticsMetrics'

describe('Analytics', () => {
  describe('AnalyticsDashboard', () => {
    const mockAnalytics = {
      views: 1000,
      contacts: 50,
      favorites: 25,
      shares: 10,
      timeRange: '30d',
    }

    it('should display analytics overview', () => {
      render(<AnalyticsDashboard analytics={mockAnalytics} />)

      expect(screen.getByText(/1000 views/i)).toBeInTheDocument()
      expect(screen.getByText(/50 contacts/i)).toBeInTheDocument()
      expect(screen.getByText(/25 favorites/i)).toBeInTheDocument()
      expect(screen.getByText(/10 shares/i)).toBeInTheDocument()
    })

    it('should handle time range selection', async () => {
      const onTimeRangeChange = jest.fn()
      render(<AnalyticsDashboard analytics={mockAnalytics} onTimeRangeChange={onTimeRangeChange} />)

      fireEvent.change(screen.getByLabelText(/time range/i), {
        target: { value: '7d' },
      })

      await waitFor(() => {
        expect(onTimeRangeChange).toHaveBeenCalledWith('7d')
      })
    })

    it('should handle data export', async () => {
      const onExport = jest.fn()
      render(<AnalyticsDashboard analytics={mockAnalytics} onExport={onExport} />)

      fireEvent.click(screen.getByRole('button', { name: /export data/i }))

      await waitFor(() => {
        expect(onExport).toHaveBeenCalledWith(mockAnalytics)
      })
    })
  })

  describe('AnalyticsChart', () => {
    const mockData = [
      { date: '2024-01-01', views: 100, contacts: 5 },
      { date: '2024-01-02', views: 150, contacts: 8 },
      { date: '2024-01-03', views: 200, contacts: 12 },
    ]

    it('should render chart with data', () => {
      render(<AnalyticsChart data={mockData} />)

      expect(screen.getByTestId('chart')).toBeInTheDocument()
    })

    it('should handle metric selection', async () => {
      const onMetricChange = jest.fn()
      render(<AnalyticsChart data={mockData} onMetricChange={onMetricChange} />)

      fireEvent.change(screen.getByLabelText(/metric/i), {
        target: { value: 'contacts' },
      })

      await waitFor(() => {
        expect(onMetricChange).toHaveBeenCalledWith('contacts')
      })
    })

    it('should handle chart type selection', async () => {
      const onChartTypeChange = jest.fn()
      render(<AnalyticsChart data={mockData} onChartTypeChange={onChartTypeChange} />)

      fireEvent.change(screen.getByLabelText(/chart type/i), {
        target: { value: 'bar' },
      })

      await waitFor(() => {
        expect(onChartTypeChange).toHaveBeenCalledWith('bar')
      })
    })
  })

  describe('AnalyticsMetrics', () => {
    const mockMetrics = {
      views: {
        total: 1000,
        unique: 800,
        trend: '+10%',
      },
      contacts: {
        total: 50,
        unique: 40,
        trend: '+5%',
      },
      favorites: {
        total: 25,
        unique: 20,
        trend: '+15%',
      },
    }

    it('should display metrics', () => {
      render(<AnalyticsMetrics metrics={mockMetrics} />)

      expect(screen.getByText(/1000 total views/i)).toBeInTheDocument()
      expect(screen.getByText(/800 unique views/i)).toBeInTheDocument()
      expect(screen.getByText(/\+10% trend/i)).toBeInTheDocument()
    })

    it('should handle metric comparison', async () => {
      const onCompare = jest.fn()
      render(<AnalyticsMetrics metrics={mockMetrics} onCompare={onCompare} />)

      fireEvent.click(screen.getByRole('button', { name: /compare metrics/i }))

      await waitFor(() => {
        expect(onCompare).toHaveBeenCalledWith(mockMetrics)
      })
    })

    it('should handle metric filtering', async () => {
      const onFilter = jest.fn()
      render(<AnalyticsMetrics metrics={mockMetrics} onFilter={onFilter} />)

      fireEvent.change(screen.getByLabelText(/filter/i), {
        target: { value: 'views' },
      })

      await waitFor(() => {
        expect(onFilter).toHaveBeenCalledWith('views')
      })
    })
  })
}) 