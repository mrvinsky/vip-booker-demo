"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { 
  CalendarCheck, 
  MapPin, 
  Clock, 
  User, 
  Car, 
  CheckCircle2, 
  XCircle, 
  Search,
  MoreVertical,
  Banknote
} from "lucide-react"

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClient()

  const fetchBookings = async () => {
    setIsLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

    let query = supabase
      .from('bookings')
      .select(`
        *,
        customer:profiles(full_name, phone),
        vehicle:vehicles!inner(name, plate_number, driver_id)
      `)
      .order('created_at', { ascending: false })

    if (profile?.role !== 'admin') {
      query = query.eq('vehicle.driver_id', user.id)
    }

    const { data, error } = await query
    
    if (data) setBookings(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (!error) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_deposit':
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Banknote className="w-3 h-3" /> Kapora Bekliyor</span>
      case 'confirmed':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Onaylandı</span>
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><XCircle className="w-3 h-3" /> İptal Edildi</span>
      default:
        return <span className="px-3 py-1 bg-white/5 text-muted-foreground rounded-full text-[10px] font-bold uppercase tracking-wider">{status}</span>
    }
  }

  const filteredBookings = bookings.filter(b => 
    b.customer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.vehicle?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Rezervasyon Yönetimi</h1>
          <p className="text-muted-foreground">Gelen rezervasyon taleplerini ve kapora bildirimlerini yönetin.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Müşteri veya araç ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredBookings.map((booking) => (
          <motion.div 
            key={booking.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Customer & Vehicle Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {booking.customer?.full_name?.[0] || 'M'}
                    </div>
                    <div>
                      <div className="font-bold text-white">{booking.customer?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{booking.customer?.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{booking.vehicle?.name}</div>
                      <div className="text-[10px] font-bold text-primary uppercase tracking-widest">{booking.vehicle?.plate_number}</div>
                    </div>
                  </div>
                </div>

                {/* Route & Time */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Rota</div>
                      <div className="text-sm text-white">{booking.pickup_location} → {booking.dropoff_location}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarCheck className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">Tarih & Saat</div>
                      <div className="text-sm text-white">{new Date(booking.pickup_date).toLocaleString('tr-TR')}</div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Status */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Toplam Tutar</div>
                    <div className="text-2xl font-bold text-white">{booking.total_price}₺</div>
                  </div>
                  <div className="pt-2">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
                {booking.status === 'pending_deposit' && (
                  <button 
                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                    className="flex-1 lg:flex-none px-6 py-3 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Kaporayı Onayla
                  </button>
                )}
                <button className="flex-1 lg:flex-none px-6 py-3 bg-white/5 text-muted-foreground rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <MoreVertical className="w-4 h-4" /> Detaylar
                </button>
                {booking.status !== 'cancelled' && (
                  <button 
                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                    className="flex-1 lg:flex-none px-6 py-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> İptal Et
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBookings.length === 0 && !isLoading && (
        <div className="p-20 text-center glass rounded-[2.5rem] border border-white/5">
          <CalendarCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Henüz bir rezervasyon bulunmuyor.</p>
        </div>
      )}
    </div>
  )
}
