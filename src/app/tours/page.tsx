"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { 
  MapPin, 
  Clock, 
  Search, 
  ChevronRight,
  Star,
  Users
} from "lucide-react"
import Link from "next/link"

export default function ToursPage() {
  const [tours, setTours] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchTours = async () => {
      // NOTE: This will error if the 'tours' table doesn't exist yet!
      const { data } = await supabase
        .from('tours')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (data) setTours(data)
      setIsLoading(false)
    }
    fetchTours()
  }, [])

  const filteredTours = tours.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 text-white tracking-tight">Özel Tur Paketleri</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Profesyonel rehberler ve VIP araçlarla unutulmaz deneyimler yaşayın. 
              Günübirlik veya uzun süreli özel turlarımızı keşfedin.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tur veya lokasyon ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] rounded-[3rem] bg-white/5 animate-pulse" />
            ))
          ) : filteredTours.length > 0 ? (
            filteredTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group glass rounded-[3rem] overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={tour.image_url || 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=800'}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                      {tour.location}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{tour.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{tour.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mb-8">
                      <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl">
                        <Clock className="w-4 h-4 text-primary" />
                        {tour.duration_days} Gün
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        4.9
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase font-bold block mb-1">Kişi Başı</span>
                      <span className="text-2xl font-bold text-white">₺{tour.price}</span>
                    </div>
                    <Link 
                      href={`/tours/${tour.id}`}
                      className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-black hover:bg-primary hover:text-white transition-all font-bold text-sm shadow-xl hover:shadow-primary/20"
                    >
                      İncele <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
             <div className="col-span-full py-20 text-center">
              <MapPin className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Tur Bulunamadı</h2>
              <p className="text-muted-foreground">Şu anda aktif bir tur paketi bulunmuyor veya aramanıza uygun sonuç yok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
