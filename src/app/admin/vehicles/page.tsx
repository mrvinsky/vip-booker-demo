"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { 
  Car, 
  Search, 
  Plus, 
  Settings, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  User,
  Building2
} from "lucide-react"

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClient()

  const fetchVehicles = async () => {
    setIsLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

    let query = supabase
      .from('vehicles')
      .select(`
        *,
        owner:profiles(full_name, role, username)
      `)
      .order('created_at', { ascending: false })

    if (profile?.role !== 'admin') {
      query = query.eq('driver_id', user.id)
    }

    const { data, error } = await query
    
    if (data) setVehicles(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const filteredVehicles = vehicles.filter(v => 
    v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.plate_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Araç Filosu Yönetimi</h1>
          <p className="text-muted-foreground">Sistemdeki tüm bireysel ve şirket araçlarını plakalarıyla yönetin.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Plaka veya model ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
            />
          </div>
          <button className="bg-primary text-white p-3 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <motion.div 
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-primary/30 transition-all group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={vehicle.image_url || 'https://images.unsplash.com/photo-1549675584-91f19337af3d?q=80&w=800'} 
                alt={vehicle.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white px-3 py-1.5 rounded-lg text-black font-bold text-xs border-2 border-black/10 shadow-lg">
                  {vehicle.plate_number || 'PLAKA YOK'}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  vehicle.is_available ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {vehicle.is_available ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
                  <div className="text-sm text-muted-foreground">{vehicle.type} • {vehicle.capacity} Kişilik</div>
                </div>
                <div className="p-2 bg-white/5 rounded-xl">
                  {vehicle.owner?.role === 'agency' ? <Building2 className="w-5 h-5 text-purple-500" /> : <User className="w-5 h-5 text-blue-500" />}
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground uppercase font-bold">Sahibi</span>
                  <span className="text-xs font-bold text-white">{vehicle.owner?.full_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase font-bold">Durum</span>
                  <span className="text-xs font-bold text-emerald-500">Belgeler Onaylı</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/5 flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" /> Düzenle
                </button>
                <button className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredVehicles.length === 0 && !isLoading && (
        <div className="p-20 text-center glass rounded-[2.5rem] border border-white/5">
          <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Sistemde henüz araç bulunmuyor.</p>
        </div>
      )}
    </div>
  )
}
