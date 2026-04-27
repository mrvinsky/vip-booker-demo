"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { 
  Users, 
  Mail, 
  Phone, 
  ShieldCheck, 
  MoreVertical,
  Search,
  Trash2,
  UserCheck
} from "lucide-react"

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClient()

  const fetchUsers = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setUsers(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      const { error } = await supabase.from('profiles').delete().eq('id', id)
      if (!error) {
        setUsers(users.filter(u => u.id !== id))
        alert('Kullanıcı silindi.')
      }
    }
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Kullanıcı Yönetimi</h1>
          <p className="text-muted-foreground">Tüm kayıtlı kullanıcıları, sürücüleri ve adminleri yönetin.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="İsim veya kullanıcı adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
          />
        </div>
      </div>

      <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Kullanıcı</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Rol</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">İletişim</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Durum</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {user.full_name?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{user.full_name}</div>
                      <div className="text-xs text-muted-foreground">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-sm">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                    user.role === 'driver' ? 'bg-blue-500/10 text-blue-500' :
                    user.role === 'agency' ? 'bg-purple-500/10 text-purple-500' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-6">
                  <div className="text-xs text-muted-foreground flex flex-col gap-1">
                    <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {user.id.slice(0,8)}...</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {user.phone}</span>
                  </div>
                </td>
                <td className="p-6 text-sm">
                  {user.is_verified ? (
                    <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                      <UserCheck className="w-4 h-4" /> Onaylı
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-amber-500 font-medium">
                      <ShieldCheck className="w-4 h-4" /> Bekliyor
                    </span>
                  )}
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:text-white transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && !isLoading && (
          <div className="p-20 text-center text-muted-foreground italic">
            Kullanıcı bulunamadı.
          </div>
        )}
      </div>
    </div>
  )
}
