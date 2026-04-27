"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { 
  Users, 
  Star, 
  Shield, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Info,
  Banknote
} from "lucide-react"
import Link from "next/link"

export default function VehicleDetailClient() {
  const { id } = useParams()
  const router = useRouter()
  const [vehicle, setVehicle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [step, setStep] = useState(1) // 1: Form, 2: Deposit Info
  const supabase = createClient()

  const [bookingData, setBookingData] = useState({
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    passengers: 1
  })

  useEffect(() => {
    const fetchVehicle = async () => {
      const { data } = await supabase
        .from('vehicles')
        .select(`
          *,
          owner:profiles(full_name, phone)
        `)
        .eq('id', id)
        .single()
      
      if (data) setVehicle(data)
      setIsLoading(false)
    }
    fetchVehicle()
  }, [id])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
      return
    }
    setStep(2)
  }

  const confirmDeposit = async () => {
    setIsBooking(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('bookings').insert({
      customer_id: user?.id,
      vehicle_id: id,
      pickup_location: bookingData.pickup,
      dropoff_location: bookingData.dropoff,
      pickup_date: `${bookingData.date}T${bookingData.time}:00`, // Saniye ekledim garantici olmak için
      status: 'pending_deposit',
      total_price: vehicle.price_per_km * 10
    })

    if (error) {
      console.error('Booking Error Details:', error)
      alert(`Hata: ${error.message}`)
    } else {
      setBookingSuccess(true)
    }
    setIsBooking(false)
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-white">Yükleniyor...</div>
  if (!vehicle) return <div className="min-h-screen flex items-center justify-center text-white">Araç bulunamadı.</div>

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <Link href="/vehicles" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Geri Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl"
            >
              <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-full object-cover" />
              <div className="absolute top-8 left-8 flex gap-3">
                <span className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest">{vehicle.type}</span>
                <span className="px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-xl text-primary font-bold text-xs">{vehicle.plate_number || vehicle.city}</span>
              </div>
            </motion.div>

            <div className="flex justify-between items-center pb-8 border-b border-white/5">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{vehicle.name}</h1>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium"><Users className="w-5 h-5 text-primary" /> {vehicle.capacity} Kişilik</span>
                  <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-5 h-5 text-primary" /> {vehicle.city || 'İstanbul'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Km Başı</div>
                <div className="text-4xl font-bold text-primary">{vehicle.price_per_km}₺</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Wi-Fi", "Mini Bar", "TV", "Deri Koltuk"].map((feat) => (
                <div key={feat} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center gap-3 text-center group hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-white">{feat}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Araç Hakkında</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Bu ultra lüks {vehicle.name}, konforlu ve güvenli bir yolculuk için tüm detayları barındırır. 
                {vehicle.owner?.full_name} tarafından işletilen bu araç, VIP taşımacılık standartlarının üzerindedir. 
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                {bookingSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-12 rounded-[3rem] border border-emerald-500/20 text-center space-y-6 shadow-2xl"
                  >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Talep Alındı!</h3>
                    <p className="text-muted-foreground">Kaporanız onaylandığında rezervasyonunuz kesinleşecektir.</p>
                    <button onClick={() => router.push('/')} className="w-full py-4 bg-white/5 rounded-2xl text-white font-bold hover:bg-white/10 transition-all text-sm">Ana Sayfaya Dön</button>
                  </motion.div>
                ) : step === 1 ? (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass p-8 rounded-[3rem] border border-white/10 shadow-2xl"
                  >
                    <h3 className="text-2xl font-bold text-white mb-6">Rezervasyon</h3>
                    <form onSubmit={handleBooking} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Alış Noktası</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          <input required type="text" value={bookingData.pickup} onChange={e => setBookingData({...bookingData, pickup: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Örn: Havalimanı" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Varış Noktası</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                          <input required type="text" value={bookingData.dropoff} onChange={e => setBookingData({...bookingData, dropoff: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Örn: Otel Adı" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input required type="date" value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white [color-scheme:dark] outline-none" />
                        <input required type="time" value={bookingData.time} onChange={e => setBookingData({...bookingData, time: e.target.value})} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white [color-scheme:dark] outline-none" />
                      </div>
                      <button className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        Devam Et <ChevronRight className="w-5 h-5" />
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass p-8 rounded-[3rem] border border-primary/20 shadow-2xl space-y-6"
                  >
                    <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20">
                      <h4 className="text-primary font-bold mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Kapora Ödemesi
                      </h4>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Rezervasyonunuzun kesinleşmesi için <span className="text-white font-bold">500₺</span> kapora ödemeniz gerekmektedir. 
                      </p>
                    </div>

                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">IBAN (TR)</span>
                        <span className="text-sm font-mono text-white select-all">TR00 0000 0000 0000 0000 0000 00</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Alıcı</span>
                        <span className="text-sm text-white font-bold">VIPBOOKER TEKNOLOJİ A.Ş.</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={confirmDeposit}
                        disabled={isBooking}
                        className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isBooking ? 'Gönderiliyor...' : 'Kaporayı Gönderdim'}
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => setStep(1)} className="w-full py-3 text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-widest transition-colors">Vazgeç ve Geri Dön</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
