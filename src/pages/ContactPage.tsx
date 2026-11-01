import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { Instagram } from '../components/InstagramIcon';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="py-12 text-center" style={{ background: 'linear-gradient(135deg, oklch(22% 0.04 50), oklch(30% 0.06 48))' }}>
        <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-2">Get in touch</p>
        <h1 className="font-display text-4xl font-bold text-cream mb-2">Contact Us</h1>
        <p className="text-cream/60 text-sm">We'd love to hear from you. Say hello!</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-espresso mb-6">Find Us & Reach Out</h2>
            <div className="space-y-5">
              {[
                {
                  icon: <MapPin size={20} className="text-caramel" />,
                  title: 'Address',
                  lines: ['Karve Road, Opp. Ranka Jewellers,', 'Erandwane, Pune, Maharashtra 411004']
                },
                {
                  icon: <Phone size={20} className="text-caramel" />,
                  title: 'Phone',
                  lines: ['+91 98765 43210']
                },
                {
                  icon: <Mail size={20} className="text-caramel" />,
                  title: 'Email',
                  lines: ['hello@thefirstcoffee.in']
                },
                {
                  icon: <Clock size={20} className="text-caramel" />,
                  title: 'Hours',
                  lines: ['Mon–Fri: 8:00 AM – 10:00 PM', 'Saturday: 8:00 AM – 11:00 PM', 'Sunday: 9:00 AM – 10:00 PM']
                },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'oklch(93% 0.025 80)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-espresso text-sm">{item.title}</p>
                    {item.lines.map((line, i) => (
                      <p key={i} className="text-sm text-muted-foreground mt-0.5">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="mt-8">
              <p className="font-semibold text-espresso text-sm mb-3">Follow us</p>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-espresso hover:bg-muted transition-colors">
                <Instagram size={16} className="text-pink-500" /> @thefirstcoffeepune
              </a>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 rounded-2xl border border-border overflow-hidden shadow-sm">
              <a href="https://www.google.com/maps/search/?api=1&query=Karve+Road+Opp+Ranka+Jewellers+Erandwane+Pune"
                target="_blank" rel="noreferrer"
                className="block h-48 flex items-center justify-center hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, oklch(93% 0.025 80), oklch(89% 0.03 75))' }}>
                <div className="text-center">
                  <MapPin size={36} style={{ color: 'oklch(30% 0.05 50)' }} className="mx-auto mb-2" />
                  <p className="font-semibold text-espresso text-sm">Open in Google Maps</p>
                  <p className="text-xs text-muted-foreground mt-1">Karve Road, Erandwane, Pune</p>
                </div>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
              <h2 className="font-display text-2xl font-bold text-espresso mb-1">Send a Message</h2>
              <p className="text-muted-foreground text-sm mb-6">Have a question, feedback, or want to book a table? We'll get back to you quickly.</p>

              {sent ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'oklch(93% 0.05 145)' }}>
                    <CheckCircle size={40} style={{ color: 'oklch(50% 0.18 145)' }} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-espresso mb-2">Message Sent! ☕</h3>
                  <p className="text-muted-foreground text-sm">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-sm font-semibold text-espresso hover:text-caramel transition-colors underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Name *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-caramel/40" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Phone</label>
                      <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 XXXXX" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-caramel/40" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-caramel/40" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Message *</label>
                    <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Your message, feedback, or question..." rows={5}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-caramel/40" />
                  </div>
                  <button type="submit" disabled={sending}
                    className="w-full py-3.5 rounded-2xl font-bold text-cream flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
                    style={{ background: 'oklch(30% 0.05 50)' }}>
                    {sending ? <span className="animate-spin w-5 h-5 border-2 border-cream border-t-transparent rounded-full" /> : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
