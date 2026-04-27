"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { 
  Users, 
  Car, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle
} from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      
      // 1. İstatistikleri Çek
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { count: driverCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'driver').eq('is_verified', true)
      const { count: pendingCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'driver').eq('is_verified', false)
      const { count: bookingCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true })

      setStats([
        { name: "Toplam Kullanıcı", value: userCount?.toString() || "0", icon: Users, color: "text-blue-500", trend: "Canlı" },
        { name: "Aktif Sürücüler", value: driverCount?.toString() || "0", icon: Car, color: "text-emerald-500", trend: "Onaylı" },
        { name: "Onay Bekleyenler", value: pendingCount?.toString() || "0", icon: ShieldCheck, color: "text-amber-500", trend: "Acil" },
        { name: "Toplam Rezervasyon", value: bookingCount?.toString() || "0", icon: TrendingUp, color: "text-primary", trend: "Aktif" },
      ])

      // 2. Son Aktiviteleri Çek (Son 5 profil kaydı)
      const { data: latestUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (latestUsers) {
        setRecentActivities(latestUsers.map(u => ({
          id: u.id,
          user: u.full_name || 'İsimsiz',
          action: u.role === 'driver' ? 'Sürücü başvurusu yaptı' : 'Yeni üyelik oluşturdu',
          time: new Date(u.created_at).toLocaleDateString('tr-TR'),
          status: u.is_verified ? 'completed' : 'pending'
        })))
      }

      setIsLoading(false)
    }
    fetchData()
  }, [])

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">İstatistikler yükleniyor...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Hoş Geldin, Admin</h1>
        <p className="text-muted-foreground">İşte platformun bugünkü özeti.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl border border-white/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                  stat.name === 'Onay Bekleyenler' && parseInt(stat.value) > 0 
                  ? 'bg-red-500/10 text-red-500 animate-pulse' 
                  : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <div className="text-3xl font-bold mb-1 text-white">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.name}</div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Son Aktiviteler</h2>
            <button className="text-sm text-primary font-medium hover:underline">Tümünü Gör</button>
          </div>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs text-primary border border-primary/10">
                    {activity.user[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white group-hover:text-primary transition-colors">{activity.user}</div>
                    <div className="text-xs text-muted-foreground">{activity.action}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground font-medium mb-1">{activity.time}</div>
                  {activity.status === 'pending' ? (
                    <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> Bekliyor
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Onaylı
                    </span>
                  )}
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-center py-10 text-muted-foreground italic text-sm">
                Henüz bir aktivite bulunmuyor.
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats / Alerts */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-primary/5">
            <div className="flex items-center gap-3 text-primary font-bold mb-4">
              <AlertCircle className="w-5 h-5" />
              Sistem Durumu
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sunucu Gecikmesi</span>
                <span className="font-bold text-white">24ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">DB Bağlantısı</span>
                <span className="text-emerald-500 font-bold">Aktif</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage Doluluğu</span>
                <span className="font-bold text-white">12%</span>
              </div>
            </div>
          </div>
          
          <div className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h3 className="font-bold mb-4 text-white">Hızlı Aksiyonlar</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all border border-white/5 text-white">Duyuru Yayınla</button>
              <button className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all border border-white/5 text-white">Rapor Al</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
