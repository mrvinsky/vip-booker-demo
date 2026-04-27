"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Building2,
  CalendarCheck,
  ShieldAlert
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!['admin', 'agency', 'driver'].includes(profile?.role)) {
        setIsAdmin(false)
        setTimeout(() => router.push('/'), 2000)
      } else {
        setProfile(profile)
        setIsAdmin(true)
      }
    }
    checkAdmin()
  }, [])

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ['admin', 'agency', 'driver'] },
    { name: "Rezervasyonlar", href: "/admin/bookings", icon: CalendarCheck, roles: ['admin', 'agency', 'driver'] },
    { name: "Sürücü Onayları", href: "/admin/drivers", icon: ShieldCheck, roles: ['admin'] },
    { name: "Tur Şirketleri", href: "/admin/agencies", icon: Building2, roles: ['admin'] },
    { name: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users, roles: ['admin'] },
    { name: "Araç Filosu", href: "/admin/vehicles", icon: Car, roles: ['admin', 'agency', 'driver'] },
  ].filter(item => profile && item.roles.includes(profile.role))

  if (isAdmin === null) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Güvenlik kontrolü yapılıyor...</div>
  
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="glass p-12 rounded-[3rem] border border-red-500/20 text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Yetkisiz Erişim</h2>
          <p className="text-muted-foreground mb-6">Bu bölüme girmek için admin yetkiniz bulunmuyor. Ana sayfaya yönlendiriliyorsunuz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#020617] hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span>AdminPanel</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-white")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/auth')
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
          
          <div className="px-4 py-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Developed by</div>
            <Link 
              href="https://instagram.com/mr.vinsky" 
              target="_blank" 
              className="text-xs font-bold text-white hover:text-primary transition-colors flex items-center gap-1.5"
            >
              mr.vinsky
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Hızlı arama..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-[#020617]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-bold text-white">{profile?.full_name}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{profile?.role}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                {profile?.full_name?.[0] || 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
