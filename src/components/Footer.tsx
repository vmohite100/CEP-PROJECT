import { Coffee, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Instagram } from './InstagramIcon';
import type { Page } from '../App';

const FOOTER_LINKS: { label: string; page: Page }[] = [
  { label: 'Menu', page: 'menu' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
  { label: 'My Orders', page: 'orders' },
  { label: 'Staff Login', page: 'admin' },
];

export default function Footer({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <footer className="mt-16 border-t text-primary-foreground" style={{ background: 'oklch(22% 0.04 50)' }}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Coffee size={20} className="text-caramel" />
            <span className="font-display text-lg font-bold text-cream">THE FIRST COFFEE</span>
          </div>
          <p className="text-sm opacity-70 text-cream leading-relaxed">Your first sip. Your favourite ritual. Specialty coffee in the heart of Erandwane, Pune.</p>
          <div className="flex gap-3 mt-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-caramel/30 transition-colors">
              <Instagram size={14} className="text-cream" />
            </a>
          </div>
        </div>

        {/* Visit Us */}
        <div>
          <h3 className="text-xs font-semibold tracking-widest uppercase opacity-60 text-cream mb-3">Visit Us</h3>
          <div className="space-y-2 text-sm text-cream/80">
            <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 flex-shrink-0 text-caramel" />Karve Road, Opp. Ranka Jewellers, Erandwane, Pune, Maharashtra</p>
            <p className="flex items-center gap-2"><Clock size={14} className="text-caramel" />8:00 AM – 10:00 PM · Daily</p>
            <p className="flex items-center gap-2"><Phone size={14} className="text-caramel" />+91 98765 43210</p>
            <p className="flex items-center gap-2"><Mail size={14} className="text-caramel" />hello@thefirstcoffee.in</p>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-xs font-semibold tracking-widest uppercase opacity-60 text-cream mb-3">Explore</h3>
          <div className="flex flex-col gap-2 text-sm">
            {FOOTER_LINKS.map(link => (
              <button key={link.page} onClick={() => navigate(link.page)} className="text-left opacity-80 hover:opacity-100 text-cream hover:text-caramel transition-colors">
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div>
          <h3 className="text-xs font-semibold tracking-widest uppercase opacity-60 text-cream mb-3">Hours</h3>
          <div className="space-y-1.5 text-sm text-cream/80">
            <div className="flex justify-between gap-4"><span>Mon – Fri</span><span className="text-cream">8 AM – 10 PM</span></div>
            <div className="flex justify-between gap-4"><span>Saturday</span><span className="text-cream">8 AM – 11 PM</span></div>
            <div className="flex justify-between gap-4"><span>Sunday</span><span className="text-cream">9 AM – 10 PM</span></div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-cream/50">
        © 2026 THE FIRST COFFEE · Karve Road, Erandwane, Pune
      </div>
    </footer>
  );
}
