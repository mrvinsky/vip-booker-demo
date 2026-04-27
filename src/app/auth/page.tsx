"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, User, Car, Mail, Lock, ChevronRight } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'customer' | 'driver'>('customer')
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    tcNo: '',
    phone: '',
    email: '',
    password: ''
  })

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    idFront: null,
    idBack: null,
    license: null,
    registration: null,
    vehicle1: null,
    vehicle2: null,
    vehicle3: null
  })
  
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error:', error)
      alert('Google ile giriş yapılırken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }))
    }
  }

  const validateTC = (tc: string) => {
    if (tc.length !== 11) return false
    if (!/^\d+$/.test(tc)) return false
    if (tc[0] === '0') return false
    
    let sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(tc[i])
    }
    
    return sum % 10 === parseInt(tc[10])
  }

  const uploadFile = async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file)
    if (error) throw error
    return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl
  }

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
      if (error) throw error
      window.location.href = '/' // Giriş başarılıysa ana sayfaya
    } catch (error: any) {
      alert('Giriş başarısız: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    setIsLoading(true)
    try {
      // 0. Validate TC
      if (!validateTC(formData.tcNo)) {
        alert('Lütfen geçerli bir TC Kimlik Numarası giriniz.')
        setIsLoading(false)
        return
      }

      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username,
            phone: formData.phone,
            tc_no: formData.tcNo,
            role: role
          }
        }
      })
      if (authError) throw authError
      if (!authData.user) throw new Error('Kullanıcı oluşturulamadı.')

      const userId = authData.user.id

      // 2. Upload Files if Driver
      let fileUrls: { [key: string]: string } = {}
      if (role === 'driver') {
        for (const [key, file] of Object.entries(files)) {
          if (file) {
            const bucket = key.startsWith('vehicle') ? 'vehicle-images' : 'kyc-documents'
            const path = `${userId}/${key}-${Date.now()}`
            fileUrls[key] = await uploadFile(bucket, path, file)
          }
        }

        // 3. Create Vehicle Record for Driver (Wait a bit for profile trigger to finish)
        const { error: vehicleError } = await supabase.from('vehicles').insert({
          driver_id: userId,
          name: `${formData.fullName} Aracısı`,
          type: 'VIP',
          capacity: 9,
          price_per_km: 0,
          image_url: fileUrls.vehicle1 || null,
          features: [],
          is_available: false
        })
        if (vehicleError) throw vehicleError
      }

      alert('Kayıt başarılı! Lütfen e-postanızı onaylayın.')
      setIsLogin(true)
    } catch (error: any) {
      console.error('Registration error:', error)
      alert('Kayıt sırasında bir hata oluştu: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-20">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span>VipBooker</span>
          </Link>
          <h1 className="text-3xl font-bold">
            {isLogin ? 'Tekrar Hoş Geldiniz' : 'Güvenli Kayıt Oluşturun'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? 'Hesabınıza giriş yaparak devam edin' : 'TC Kimlik ve belgelerinizle VIP topluluğuna katılın'}
          </p>
        </div>

        {/* Multi-step Indicator (Only for Register) */}
        {!isLogin && (
          <div className="flex justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              (s === 1 || role === 'driver') && (
                <div 
                  key={s} 
                  className={`h-1.5 rounded-full transition-all ${
                    step === s ? 'w-12 bg-primary' : 'w-4 bg-white/10'
                  }`}
                />
              )
            ))}
          </div>
        )}

        {/* Form Card */}
        <motion.div 
          layout
          className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              /* LOGIN FORM */
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google ile Giriş Yap
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                  <div className="relative flex justify-center text-xs uppercase font-bold"><span className="bg-background px-4 text-muted-foreground">Veya E-posta</span></div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">E-posta</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      placeholder="name@example.com" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Şifre</label>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password || ''}
                      onChange={handleInputChange}
                      placeholder="••••••••" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    />
                  </div>
                  <button 
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* REGISTER FORM (MULTI-STEP) */
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                      <button onClick={() => setRole('customer')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'customer' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground'}`}><User className="w-4 h-4" /> Müşteri</button>
                      <button onClick={() => setRole('driver')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'driver' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground'}`}><Car className="w-4 h-4" /> Sürücü</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Ad Soyad</label><input type="text" name="fullName" value={formData.fullName || ''} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Kullanıcı Adı</label><input type="text" name="username" value={formData.username || ''} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">TC Kimlik No</label><input type="text" name="tcNo" value={formData.tcNo || ''} onChange={handleInputChange} maxLength={11} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Telefon</label><input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                    </div>

                    <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">E-posta</label><input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Şifre</label><input type="password" name="password" value={formData.password || ''} onChange={handleInputChange} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>

                    <button 
                      onClick={() => {
                        if (!validateTC(formData.tcNo)) {
                          alert('Lütfen geçerli bir TC Kimlik Numarası giriniz.')
                          return
                        }
                        role === 'driver' ? nextStep() : handleRegister()
                      }} 
                      disabled={isLoading}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? 'İşleniyor...' : (role === 'driver' ? 'Devam Et (Evrak Yükleme)' : 'Kayıt Ol')}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {step === 2 && role === 'driver' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Resmi Belgeler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`p-6 border-2 border-dashed rounded-3xl text-center hover:border-primary/50 transition-colors cursor-pointer ${files.idFront ? 'border-primary bg-primary/5' : 'border-white/10'}`}>
                        <input type="file" className="hidden" onChange={(e) => handleFileChange('idFront', e)} />
                        <Mail className={`w-6 h-6 mx-auto mb-2 ${files.idFront ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-[10px] font-bold uppercase">{files.idFront ? files.idFront.name : 'Kimlik Ön Yüz'}</span>
                      </label>
                      <label className={`p-6 border-2 border-dashed rounded-3xl text-center hover:border-primary/50 transition-colors cursor-pointer ${files.idBack ? 'border-primary bg-primary/5' : 'border-white/10'}`}>
                        <input type="file" className="hidden" onChange={(e) => handleFileChange('idBack', e)} />
                        <Mail className={`w-6 h-6 mx-auto mb-2 ${files.idBack ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-[10px] font-bold uppercase">{files.idBack ? files.idBack.name : 'Kimlik Arka Yüz'}</span>
                      </label>
                      <label className={`p-6 border-2 border-dashed rounded-3xl text-center hover:border-primary/50 transition-colors cursor-pointer ${files.license ? 'border-primary bg-primary/5' : 'border-white/10'}`}>
                        <input type="file" className="hidden" onChange={(e) => handleFileChange('license', e)} />
                        <Car className={`w-6 h-6 mx-auto mb-2 ${files.license ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-[10px] font-bold uppercase">{files.license ? files.license.name : 'Sürücü Ehliyeti'}</span>
                      </label>
                      <label className={`p-6 border-2 border-dashed rounded-3xl text-center hover:border-primary/50 transition-colors cursor-pointer ${files.registration ? 'border-primary bg-primary/5' : 'border-white/10'}`}>
                        <input type="file" className="hidden" onChange={(e) => handleFileChange('registration', e)} />
                        <Shield className={`w-6 h-6 mx-auto mb-2 ${files.registration ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-[10px] font-bold uppercase">{files.registration ? files.registration.name : 'Araç Ruhsatı'}</span>
                      </label>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={prevStep} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold border border-white/10">Geri</button>
                      <button onClick={nextStep} className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold">Devam Et</button>
                    </div>
                  </div>
                )}

                {step === 3 && role === 'driver' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Araç Fotoğrafları (3 Adet)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <label key={i} className={`aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${files[`vehicle${i}`] ? 'border-primary bg-primary/5' : 'border-white/10'}`}>
                          <input type="file" className="hidden" onChange={(e) => handleFileChange(`vehicle${i}`, e)} />
                          <Car className={`w-8 h-8 mb-2 ${files[`vehicle${i}`] ? 'text-primary' : 'text-primary/50'}`} />
                          <span className="text-[8px] font-bold uppercase text-center px-2">{files[`vehicle${i}`] ? files[`vehicle${i}`]?.name : `${i}. Foto`}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Not: Araçların plakasının ve genel durumunun net göründüğünden emin olun.</p>
                    <div className="flex gap-4">
                      <button onClick={prevStep} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold border border-white/10">Geri</button>
                      <button onClick={handleRegister} disabled={isLoading} className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold disabled:opacity-50">
                        {isLoading ? 'Yükleniyor...' : 'Kaydı Tamamla'}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Link */}
        <p className="text-center mt-8 text-sm text-muted-foreground">
          {isLogin ? 'Henüz hesabınız yok mu?' : 'Zaten hesabınız var mı?'} {' '}
          <button 
            onClick={() => { setIsLogin(!isLogin); setStep(1); }}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? 'Hemen Kayıt Ol' : 'Giriş Yap'}
          </button>
        </p>
      </div>
    </div>
  )
}
