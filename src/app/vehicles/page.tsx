"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { 
  Users, 
  Star, 
  Shield, 
  Filter, 
  ChevronRight,
  Gauge,
  MapPin,
  Search
} from "lucide-react"
import Link from "next/link"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true)
      let query = supabase
        .from('vehicles')
        .select('*')
        .eq('is_available', true)

      const city = searchParams.get("city")
      const capacity = searchParams.get("capacity")

      if (city) query = query.ilike('city', `%${city}%`)
      if (capacity) query = query.gte('capacity', parseInt(capacity))

      query = query.order('created_at', { ascending: false })
      
      const { data } = await query
      if (data) setVehicles(data)
      setIsLoading(false)
    }
    fetchVehicles()
  }, [searchParams])

  const filteredVehicles = vehicles.filter(v => 
    v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 text-white tracking-tight">Lüks VIP Filomuz</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              İhtiyacınıza uygun, son model ve tam donanımlı VIP araçlarımızı keşfedin. 
              Tüm araçlarımız düzenli olarak denetlenmekte ve doğrulanmış sürücüler tarafından kullanılmaktadır.
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Araç modeli veya tipi ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold border border-white/10 text-white">
              <Filter className="w-4 h-4" />
              Filtrele
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[500px] rounded-[3rem] bg-white/5 animate-pulse" />
            ))
          ) : (
            filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group glass rounded-[3rem] overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={vehicle.image_url}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                      {vehicle.type}
                    </span>
                  </div>
                  <div className="absolute top-6 right-6">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-white text-xs font-bold shadow-lg">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      4.9
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-white">{vehicle.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                          <Users className="w-4 h-4 text-primary" />
                          {vehicle.capacity} Kişilik
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                          <Gauge className="w-4 h-4 text-primary" />
                          VIP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {["WiFi", "Minibar", "TV", "Deri Koltuk"].map((feature) => (
                      <span key={feature} className="px-3 py-1 rounded-lg bg-white/5 text-[11px] font-medium text-muted-foreground border border-white/5">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Pricing & CTA */}
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div>
                      <span className="text-2xl font-bold text-white">₺{vehicle.price_per_km || 25}</span>
                      <span className="text-muted-foreground text-sm font-medium"> / km</span>
                    </div>
                    <Link 
                      href={`/vehicles/${vehicle.id}`}
                      className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-black hover:bg-primary hover:text-white transition-all font-bold text-sm shadow-xl hover:shadow-primary/20"
                    >
                      İncele
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {filteredVehicles.length === 0 && !isLoading && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Araç Bulunamadı</h2>
            <p className="text-muted-foreground">Aramanıza uygun bir araç bulamadık. Lütfen farklı bir arama yapın.</p>
          </div>
        )}

        {/* Trust Badge Section */}
        <div className="mt-32 p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold mb-4 uppercase tracking-widest text-sm">
              <Shield className="w-6 h-6" />
              %100 Güvenli Rezervasyon
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">Aracınız Sizi Bekliyor</h2>
            <p className="text-muted-foreground text-lg">
              Booking onaylı VIP araçlarımızla yolculuğunuzun her anını biz planlayalım. 
              Siz sadece konforun tadını çıkarın.
            </p>
          </div>
          <Link href="/auth" className="px-12 py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
            Hemen Kayıt Ol
          </Link>
        </div>
      </div>
    </div>
  )
}
