"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { 
  ShieldCheck, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Phone, 
  Mail,
  ExternalLink,
  ChevronRight,
  UserCheck
} from "lucide-react"

export default function AdminDrivers() {
  const [selectedDriver, setSelectedDriver] = useState<any>(null)
  const [drivers, setDrivers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchDrivers = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'driver')
      .eq('is_verified', false)
    
    if (data) setDrivers(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', id)
    
    if (!error) {
      alert('Sürücü başarıyla onaylandı!')
      setSelectedDriver(null)
      fetchDrivers()
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sürücü Onayları</h1>
          <p className="text-muted-foreground">Kayıt olan sürücülerin belgelerini inceleyin ve onaylayın.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 text-sm font-bold border border-amber-500/20">
            {drivers.length} Bekleyen İstek
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {drivers.map((driver) => (
          <div 
            key={driver.id} 
            className="glass p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary/30 transition-all cursor-pointer"
            onClick={() => setSelectedDriver(driver)}
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {driver.full_name?.[0] || 'S'}
              </div>
              <div>
                <h3 className="text-lg font-bold">{driver.full_name}</h3>
                <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {driver.id}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {driver.phone}</span>
                  <span className="flex items-center gap-1.5 text-primary font-medium"><ShieldCheck className="w-4 h-4" /> TC: {driver.tc_no}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right mr-4 hidden md:block">
                <div className="text-xs text-muted-foreground mb-1">Başvuru Tarihi</div>
                <div className="text-sm font-bold">{new Date(driver.created_at).toLocaleDateString('tr-TR')}</div>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Detayları İncele
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {drivers.length === 0 && !isLoading && (
          <div className="text-center py-20 glass rounded-3xl border border-white/5">
            <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Onay bekleyen sürücü bulunmuyor.</p>
          </div>
        )}
      </div>

      {/* Driver Detail Modal */}
      <AnimatePresence>
        {selectedDriver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedDriver(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-[3rem] border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedDriver.full_name}</h2>
                  <div className="text-muted-foreground">Sürücü Başvuru Detayları - TC: {selectedDriver.tc_no}</div>
                </div>
                <button 
                  onClick={() => setSelectedDriver(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Documents Grid */}
                <div className="space-y-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Belge Kontrolü
                  </h3>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <p className="text-sm text-muted-foreground">Sürücünün yüklediği belgeleri Supabase Storage üzerinden kontrol edebilirsiniz.</p>
                    <div className="grid grid-cols-1 gap-2">
                      <button className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-sm font-medium">
                        <span>Kimlik & Ehliyet Klasörü</span>
                        <ExternalLink className="w-4 h-4 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Driver Info & Stats */}
                <div className="space-y-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-primary" />
                    Bilgi Özeti
                  </h3>
                  <div className="glass p-6 rounded-3xl border border-white/5 space-y-4 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-muted-foreground">Telefon:</span>
                      <span className="font-bold">{selectedDriver.phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-muted-foreground">Durum:</span>
                      <span className="text-amber-500 font-bold uppercase">Onay Bekliyor</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8 border-t border-white/5">
                <button className="flex-1 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" /> Reddet
                </button>
                <button 
                  onClick={() => handleApprove(selectedDriver.id)}
                  className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Sürücüyü Onayla
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
