import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getFavorites } from '@/lib/supabase/api'
import ListingGrid from '@/components/listing-grid'
import { constructMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = constructMetadata({
  title: 'My Favorites',
  description: 'View your favorite listings on ListHub',
  pathname: '/favorites',
})

export default async function FavoritesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin?redirect=/favorites')
  }

  const favorites = await getFavorites(session.user.id)

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">You haven't added any favorites yet.</p>
        </div>
      ) : (
        <ListingGrid listings={favorites} />
      )}
    </div>
  )
} 