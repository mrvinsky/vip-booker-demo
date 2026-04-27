"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { 
  Users, 
  MapPin, 
  Clock, 
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  CalendarDays
} from "lucide-react"
import Link from "next/link"

export default function TourDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [tour, setTour] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchTour = async () => {
      const { data } = await supabase
        .from('tours')
        .select(`
          *,
          agency:profiles(full_name, phone)
        `)
        .eq('id', id)
        .single()
      
      if (data) setTour(data)
      setIsLoading(false)
    }
    fetchTour()
  }, [id])

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-white">Yükleniyor...</div>
  if (!tour) return <div className="min-h-screen flex items-center justify-center text-white">Tur bulunamadı.</div>

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/tours" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Turlara Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl"
            >
              <img src={tour.image_url || 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=1200'} alt={tour.title} className="w-full h-full object-cover" />
              <div className="absolute top-8 left-8 flex gap-3">
                <span className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest">{tour.location}</span>
              </div>
            </motion.div>

            <div className="flex justify-between items-center pb-8 border-b border-white/5">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{tour.title}</h1>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium"><Clock className="w-5 h-5 text-primary" /> {tour.duration_days} Gün</span>
                  <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-5 h-5 text-primary" /> {tour.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Kişi Başı</div>
                <div className="text-4xl font-bold text-primary">{tour.price}₺</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Tur Programı & Detaylar</h3>
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                {tour.description}
              </p>
            </div>
            
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {tour.agency?.full_name?.[0]}
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Düzenleyen Acente</div>
                <div className="font-bold text-white">{tour.agency?.full_name}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Simple Booking CTA for now */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
               <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass p-8 rounded-[3rem] border border-white/10 shadow-2xl"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Tura Katıl</h3>
                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                      <CalendarDays className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-2">Bu tur için özel rezervasyon gerekmektedir. Lütfen acente ile iletişime geçin veya online talebinizi oluşturun.</p>
                      <div className="font-bold text-white text-xl">{tour.agency?.phone || 'İletişim Numarası Yok'}</div>
                    </div>
                    
                    <button onClick={() => alert('Tur rezervasyon modülü yakında aktif edilecek!')} className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                      Talep Oluştur <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
