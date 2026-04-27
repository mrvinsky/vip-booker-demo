"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { motion } from "framer-motion"
import { 
  User, 
  MapPin, 
  CalendarCheck, 
  Car, 
  Banknote, 
  CheckCircle2, 
  XCircle,
  Clock
} from "lucide-react"

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Profil bilgilerini çek
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profileData)

      // Kullanıcının rezervasyonlarını çek
      const { data: bookingData } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicle:vehicles(name, plate_number, image_url)
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
      
      if (bookingData) setBookings(bookingData)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit"><Clock className="w-3 h-3" /> Onay Bekliyor</span>
      case 'pending_deposit':
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit"><Banknote className="w-3 h-3" /> Kapora Bekliyor</span>
      case 'confirmed':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit"><CheckCircle2 className="w-3 h-3" /> Onaylandı</span>
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit"><XCircle className="w-3 h-3" /> İptal Edildi</span>
      default:
        return <span className="px-3 py-1 bg-white/5 text-muted-foreground rounded-full text-[10px] font-bold uppercase">{status}</span>
    }
  }

  if (isLoading) return <div className="text-center text-white">Yükleniyor...</div>

  return (
    <div className="space-y-12">
      {/* Header / Profile Summary */}
      <div className="glass p-8 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-4xl font-bold text-primary">
          {profile?.full_name?.[0] || 'U'}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">Hoş Geldin, {profile?.full_name}</h1>
          <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
            <User className="w-4 h-4" /> {profile?.username || 'Kullanıcı'}
          </p>
        </div>
      </div>

      {/* Bookings List */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Geçmiş ve Aktif Rezervasyonlarım</h2>
        
        {bookings.length === 0 ? (
          <div className="glass p-16 rounded-[3rem] border border-white/5 text-center">
            <Car className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Henüz bir rezervasyonunuz bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking, index) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row gap-8"
              >
                {/* Vehicle Image */}
                <div className="w-full md:w-48 aspect-video rounded-3xl overflow-hidden bg-white/5 relative shrink-0">
                  {booking.vehicle?.image_url ? (
                    <img src={booking.vehicle.image_url} alt={booking.vehicle.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20"><Car className="w-8 h-8" /></div>
                  )}
                </div>

                {/* Booking Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Araç Bilgisi</div>
                    <div className="font-bold text-white text-lg">{booking.vehicle?.name || 'Bilinmeyen Araç'}</div>
                    <div className="text-xs font-mono text-primary">{booking.vehicle?.plate_number}</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Rota</div>
                        <div className="text-sm text-white line-clamp-1">{booking.pickup_location}</div>
                        <div className="text-sm text-white line-clamp-1 opacity-70">↓ {booking.dropoff_location}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CalendarCheck className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">Tarih</div>
                        <div className="text-sm text-white">{new Date(booking.pickup_date).toLocaleDateString('tr-TR')}</div>
                        <div className="text-sm text-white opacity-70">{new Date(booking.pickup_date).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status and Price */}
                <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 shrink-0 min-w-[150px]">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1 md:text-right">Tutar</div>
                    <div className="text-2xl font-bold text-white">{booking.total_price}₺</div>
                  </div>
                  <div className="pt-4">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
