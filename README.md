# ListHub

A modern marketplace platform built with Next.js, Supabase, and TypeScript. ListHub allows users to create, browse, and manage listings with features like real-time messaging, location-based search, and user verification.

## Features

- 🏠 **Listing Management**
  - Create and manage listings with multiple images
  - Camera integration for taking listing photos
  - Rich text descriptions and tags
  - Location-based listing creation

- 🔍 **Advanced Search & Filtering**
  - Category-based browsing
  - Price range filtering
  - Location-based search
  - Tag-based filtering
  - Sort options (newest, price, etc.)

- 👥 **User Features**
  - User profiles with avatar support
  - Favorites system
  - Real-time messaging between users
  - User verification system

- 🗺️ **Map Integration**
  - Interactive map view of listings
  - Location-based filtering
  - Custom map markers

- 📱 **Responsive Design**
  - Mobile-first approach
  - Dark/Light mode support
  - Optimized for all devices

- 🔒 **Security & Trust**
  - User verification system
  - Report listing functionality
  - Safety tips and guidelines
  - Secure messaging system

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Maps**: Google Maps API
- **State Management**: React Hooks
- **Form Handling**: React Hook Form, Zod
- **UI Components**: Framer Motion, Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or pnpm
- Supabase account
- Google Maps API key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bantoinese83/listhub.git
cd listhub
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

1. Create a new Supabase project
2. Run the SQL migrations in the `migrations` directory
3. Set up the necessary storage buckets for images
4. Configure authentication providers in Supabase

## Project Structure

```
listhub/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── browse/            # Listing browse pages
│   ├── categories/        # Category pages
│   ├── dashboard/         # User dashboard
│   ├── listings/          # Listing pages
│   └── profile/           # User profile pages
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── lib/                   # Utility functions and services
│   ├── supabase/         # Supabase client and types
│   └── verification/     # Verification services
├── public/               # Static assets
└── styles/              # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/) 