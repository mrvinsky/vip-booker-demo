"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { 
  Building2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ExternalLink,
  Search,
  CheckCircle2,
  MapPin,
  Briefcase
} from "lucide-react"

export default function AdminAgencies() {
  const [agencies, setAgencies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClient()

  const fetchAgencies = async () => {
    setIsLoading(true)
    // Şirketleri ve o şirketlere ait araç sayılarını çekelim
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        *,
        vehicles:vehicles(count)
      `)
      .eq('role', 'agency')
      .order('created_at', { ascending: false })
    
    if (profiles) {
      setAgencies(profiles.map(p => ({
        ...p,
        vehicleCount: p.vehicles?.[0]?.count || 0
      })))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchAgencies()
  }, [])

  const filteredAgencies = agencies.filter(a => 
    a.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Tur Şirketi Yönetimi</h1>
          <p className="text-muted-foreground">Sisteme kayıtlı acentaları ve tur operatörlerini yönetin.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Şirket adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAgencies.map((agency) => (
          <motion.div 
            key={agency.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                  Partner Şirket
                </span>
                <span className="text-[10px] text-muted-foreground">{new Date(agency.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{agency.full_name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <MapPin className="w-4 h-4" /> İstanbul, Türkiye
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Kayıtlı Araç</div>
                <div className="text-lg font-bold text-primary">{agency.vehicleCount}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Aktif Tur</div>
                <div className="text-lg font-bold text-white">0</div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" /> {agency.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4 text-primary" /> {agency.tc_no} (Vergi No)
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all border border-white/5 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Mesaj
              </button>
              <button className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" /> Detaylar
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAgencies.length === 0 && !isLoading && (
        <div className="p-20 text-center glass rounded-[2.5rem] border border-white/5">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Kayıtlı tur şirketi bulunamadı.</p>
        </div>
      )}
    </div>
  )
}
