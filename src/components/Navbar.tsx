"use client"

import Link from "next/link"
import { Shield, User, Menu, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { User as SupabaseUser } from "@supabase/supabase-js"

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span>VipBooker</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/vehicles" className="hover:text-white transition-colors">Araçlar</Link>
          <Link href="/tours" className="hover:text-white transition-colors">Turlar</Link>
          <Link href="#" className="hover:text-white transition-colors">Hakkımızda</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Link href={profile?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                <div className="text-xs font-bold hidden sm:block">{profile?.full_name || user.email}</div>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
                </div>
              </Link>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="text-muted-foreground hover:text-red-400 p-1"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-all text-sm font-medium"
            >
              <User className="w-4 h-4" />
              Giriş Yap
            </Link>
          )}
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  )
}
