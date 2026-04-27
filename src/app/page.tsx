"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { 
  Search, 
  Calendar, 
  Users, 
  MapPin, 
  Shield, 
  Star, 
  ChevronRight,
  ArrowRight,
  ShieldCheck
} from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Search State
  const [searchCity, setSearchCity] = useState("")
  const [searchDate, setSearchDate] = useState("")
  const [searchPassengers, setSearchPassengers] = useState("")
  
  const supabase = createClient()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchCity) params.append("city", searchCity)
    if (searchDate) params.append("date", searchDate)
    if (searchPassengers) params.append("capacity", searchPassengers)
    
    router.push(`/vehicles?${params.toString()}`)
  }

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data } = await supabase
        .from('vehicles')
        .select('*')
        .eq('is_available', true)
        .limit(3)
      if (data) setVehicles(data)
      setIsLoading(false)
    }
    fetchVehicles()
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background z-10" />
          <Image 
            src="https://images.unsplash.com/photo-1549675584-91f19337af3d?q=80&w=2000" 
            alt="Hero Background" 
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
              <Shield className="w-3 h-3" />
              TÜRKİYE'NİN EN GÜVENİLİR VIP TRANSFER AĞI
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white leading-tight">
              Yolculuğun <span className="text-primary italic">Sizin İçin</span> Özel Olanı
            </h1>
            <p className="text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
              Profesyonel sürücüler ve ultra lüks araç filomuzla, istediğiniz her noktaya konfor ve güvenle ulaşın.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/vehicles" className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                Hemen Rezervasyon Yap <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/vehicles" className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                Filoyu İncele
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Bar Bar */}
      <section className="container mx-auto px-4 -mt-16 relative z-30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-2 rounded-3xl shadow-2xl border border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div className="flex flex-col w-full">
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">Nereye?</span>
                <input 
                  type="text" 
                  placeholder="Şehir (Örn: Antalya)" 
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-medium text-white focus:outline-none focus:ring-0 placeholder:text-white/30"
                />
              </div>
            </div>
            
            <div className="w-px h-10 bg-white/10 hidden md:block" />
            
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div className="flex flex-col w-full">
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">Ne Zaman?</span>
                <input 
                  type="date" 
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-medium text-white focus:outline-none focus:ring-0 [color-scheme:dark]"
                />
              </div>
            </div>
            
            <div className="w-px h-10 bg-white/10 hidden md:block" />
            
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              <Users className="w-5 h-5 text-primary shrink-0" />
              <div className="flex flex-col w-full">
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground ml-1">Yolcular</span>
                <input 
                  type="number" 
                  min="1"
                  placeholder="Kişi Sayısı" 
                  value={searchPassengers}
                  onChange={(e) => setSearchPassengers(e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-medium text-white focus:outline-none focus:ring-0 placeholder:text-white/30"
                />
              </div>
            </div>
            
            <button 
              onClick={handleSearch}
              className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Search className="w-5 h-5" />
              Ara
            </button>
          </div>
        </motion.div>
      </section>

      {/* Popular Vehicles Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">Popüler Araçlar</h2>
              <p className="text-muted-foreground max-w-md text-lg">En çok tercih edilen, ultra lüks donanımlı araç filomuzu keşfedin.</p>
            </div>
            <Link href="/vehicles" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Tümünü Gör <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-[450px] rounded-[3rem] bg-white/5 animate-pulse" />
              ))
            ) : (
              vehicles.map((vehicle, index) => (
                <motion.div 
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group glass rounded-[3rem] border border-white/5 overflow-hidden hover:border-primary/30 transition-all duration-500"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image 
                      src={vehicle.image_url || 'https://images.unsplash.com/photo-1549675584-91f19337af3d?q=80&w=800'} 
                      alt={vehicle.name} 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white font-bold text-[10px] uppercase tracking-widest">
                        {vehicle.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-white">{vehicle.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg"><Users className="w-4 h-4 text-primary" /> {vehicle.capacity} Kişilik</span>
                          <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.9</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Km Başı</div>
                        <div className="text-2xl font-bold text-primary">{vehicle.price_per_km || 25}₺</div>
                      </div>
                    </div>
                    <Link 
                      href={`/vehicles/${vehicle.id}`}
                      className="w-full py-4 mt-4 bg-white/5 hover:bg-primary text-white border border-white/10 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20"
                    >
                      Detayları Gör <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Doğrulanmış Filo",
                desc: "Sistemimizdeki tüm araçlar plakaları ve ruhsatlarıyla onaylanmış lüks araçlardan oluşur."
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Premium Hizmet",
                desc: "Profesyonel sürücüler ve her yolculukta sunulan özel ikramlarla konforun tadını çıkarın."
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Tur & Transfer",
                desc: "Havalimanı transferlerinden özel şehir turlarına kadar ihtiyacınız olan her an yanınızdayız."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 mx-auto shadow-lg shadow-primary/5">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
