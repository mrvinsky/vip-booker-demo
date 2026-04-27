import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import VehicleDetailClient from './VehicleDetailClient'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  
  // Note: For Metadata in Server Components, we need to create a fresh Supabase client
  // using standard keys since it's a generic fetch, not auth-bound.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return { title: 'VipBooker | VIP Transfer' }
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data } = await supabase
    .from('vehicles')
    .select('name, type, city, image_url')
    .eq('id', resolvedParams.id)
    .single()
  
  if (!data) return { title: 'Araç Bulunamadı | VipBooker' }
  
  return {
    title: `${data.name} VIP Transfer | VipBooker`,
    description: `${data.city || 'Tüm Türkiye'} bölgesinde ${data.type} tipi lüks VIP transfer aracı. Hemen rezervasyon yapın.`,
    openGraph: {
      title: `${data.name} - Premium VIP Araç`,
      description: `${data.city || 'Tüm Türkiye'} bölgesinde ${data.type} tipi lüks VIP transfer aracı.`,
      images: [
        {
          url: data.image_url || 'https://images.unsplash.com/photo-1549675584-91f19337af3d?q=80&w=1200',
          width: 1200,
          height: 630,
          alt: data.name,
        }
      ],
    }
  }
}

export default function Page() {
  return <VehicleDetailClient />
}
