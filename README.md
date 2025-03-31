# ListHub - Your Ultimate Listing Platform

A modern, feature-rich platform for creating and managing various types of listings. Built with Next.js, Supabase, and Stripe.

## Features

### Core Features
- 🔍 Advanced search and filtering
- 📱 Responsive design for all devices
- 🔒 Secure authentication and authorization
- 📍 Location-based listings with Google Maps integration
- 🏷️ Tag-based categorization
- 📸 Image upload and management
- 💬 Contact form for listing inquiries

### 🤖 ListHub Agent
- **AI-Powered Listing Assistant**
  - Smart listing creation with natural language input
  - Automatic category detection
  - Intelligent field suggestions
  - Real-time content optimization
  - SEO recommendations
  - Price suggestions based on market data
  - Image enhancement suggestions
  - Tag recommendations
  - Location optimization tips
  - Contact information validation

- **Smart Features**
  - Natural language processing for listing descriptions
  - Automatic content categorization
  - Intelligent pricing recommendations
  - SEO optimization suggestions
  - Image quality analysis
  - Tag relevance scoring
  - Location-based insights
  - Market trend analysis
  - Competitor price tracking
  - Listing performance predictions

- **Pro Features** (Available in Pro and Enterprise tiers)
  - Bulk listing creation
  - Advanced analytics
  - Custom AI training
  - API access
  - Priority processing
  - Custom integrations
  - White-label options

### Category-Specific Features
- 🚗 Vehicle Listings
  - Make, model, year tracking
  - Mileage and condition details
  - VIN number support
  - Vehicle type categorization

- 🏠 Housing Listings
  - Property type classification
  - Bedroom and bathroom counts
  - Square footage tracking
  - Amenities list

- 💼 Job Listings
  - Employment type (full-time, part-time, etc.)
  - Experience level requirements
  - Salary range specification
  - Remote work options

- 🛠️ Service Listings
  - Service type categorization
  - Pricing options
  - Availability scheduling
  - Service area definition

### Subscription Features
- 🆓 Free tier with basic features
  - 3 active listings
  - 5 images per listing
  - Basic search and filtering
  - Standard placement
  - Basic analytics

- 💎 Basic tier ($9.99/month)
  - 10 active listings
  - 10 images per listing
  - Priority placement
  - Advanced search and filtering
  - Basic analytics
  - ListHub Agent access
  - Email support

- ⭐ Pro tier (Coming Soon)
  - Unlimited listings
  - 20 images per listing
  - Featured listings
  - Advanced analytics
  - Bulk management
  - API access
  - Priority support
  - Custom integrations

- 🏢 Enterprise tier (Coming Soon)
  - All Pro features
  - Custom domain support
  - Team management
  - Custom integrations
  - Dedicated support
  - White-label options
  - Advanced AI features

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Stripe account
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/listhub.git
cd listhub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your environment variables in `.env.local`

4. Set up the database:
```bash
# Run the SQL commands in supabase/migrations/01_initial_schema.sql
```

5. Deploy Edge Functions:
```bash
supabase functions deploy
```

6. Start the development server:
```bash
npm run dev
```

### Environment Variables

Required environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Stripe Product IDs
STRIPE_BASIC_PRODUCT_ID=your_basic_product_id
STRIPE_PRO_PRODUCT_ID=your_pro_product_id
STRIPE_ENTERPRISE_PRODUCT_ID=your_enterprise_product_id

# Stripe Price IDs
STRIPE_BASIC_PRICE_ID=your_basic_price_id
STRIPE_PRO_PRICE_ID=your_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=your_enterprise_price_id

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Database Schema

### Tables
- `listings`: Main listings table
- `listing_details`: Category-specific details
- `listing_images`: Image storage
- `listing_tags`: Tag management
- `subscriptions`: Subscription tracking
- `profiles`: User profiles

## API Routes

### Authentication
- `/api/auth/signup`
- `/api/auth/signin`
- `/api/auth/signout`

### Listings
- `/api/listings`
- `/api/listings/[id]`
- `/api/listings/[id]/images`
- `/api/listings/[id]/tags`

### Subscriptions
- `/api/subscriptions`
- `/api/subscriptions/[id]`
- `/api/webhooks/stripe`

## Edge Functions

### Subscription Management
- `create-subscription`: Handle new subscription creation
- `update-subscription`: Manage subscription updates
- `cancel-subscription`: Process subscription cancellations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@listhub.com or join our Slack channel.

## Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Stripe for payment processing
- Google Maps for location services 