import Link from "next/link"
import { Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span>VipBooker</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              VIP taşımacılıkta şeffaflık ve güvenin adresi. Araç odaklı rezervasyon ile yolculuğunuzu planlayın.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tours" className="hover:text-foreground transition-colors">Turlar</Link></li>
              <li><Link href="/transfers" className="hover:text-foreground transition-colors">Transferler</Link></li>
              <li><Link href="/vehicles" className="hover:text-foreground transition-colors">Araçlar</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Şirket</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">Hakkımızda</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">İletişim</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Gizlilik Politikası</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Sürücüler İçin</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/auth" className="hover:text-foreground transition-colors">Sürücü Ol</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest">
          <p>© 2026 VipBooker. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-1.5">
            <span>Designed & Developed by</span>
            <Link 
              href="https://instagram.com/mr.vinsky" 
              target="_blank" 
              className="font-bold text-white hover:text-primary transition-colors"
            >
              mr.vinsky
            </Link>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="https://instagram.com/mr.vinsky" target="_blank" className="hover:text-foreground transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-foreground transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
