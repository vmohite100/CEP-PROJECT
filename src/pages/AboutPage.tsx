import { Coffee, Heart, Users, Award } from 'lucide-react';

const TEAM = [
  { name: 'Arjun Sharma', role: 'Head Barista', emoji: '👨‍🍳' },
  { name: 'Priya Kulkarni', role: 'Cafe Manager', emoji: '👩‍💼' },
  { name: 'Rohit Desai', role: 'Chef & Baker', emoji: '👨‍🍳' },
];

const VALUES = [
  { icon: <Coffee size={24} />, title: 'Quality First', desc: 'We source only the finest Arabica beans from Coorg & Chikmagalur for every cup.' },
  { icon: <Heart size={24} />, title: 'Made with Love', desc: 'Every drink and dish is crafted with passion, care, and a personal touch.' },
  { icon: <Users size={24} />, title: 'Community Hub', desc: 'More than a cafe — a warm space to meet, work, study, and connect.' },
  { icon: <Award size={24} />, title: 'Always Fresh', desc: 'Our sandwiches are made fresh daily. No frozen, no shortcuts — ever.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative py-24 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, oklch(22% 0.04 50), oklch(30% 0.06 48))' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(ellipse at 30% 50%, oklch(72% 0.12 68) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, oklch(60% 0.09 55) 0%, transparent 50%)'
        }} />
        <div className="relative">
          <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-2">Our Story</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mb-4">About The First Coffee</h1>
          <p className="text-cream/70 max-w-xl mx-auto text-lg leading-relaxed px-4">
            Born from a love of great coffee and a belief that your morning ritual deserves the best.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-2">How it all began</p>
            <h2 className="font-display text-3xl font-bold text-espresso mb-5">A Ritual Worth Waking Up For</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>The First Coffee was born in 2022 with a simple belief — that your first cup of coffee in the morning should be extraordinary. Not just good, not just warm, but a ritual that makes you look forward to each day.</p>
              <p>Nestled on Karve Road in the heart of Erandwane, Pune, our cafe has become a beloved gathering spot for students, professionals, and families who share our passion for great coffee and honest food.</p>
              <p>We work directly with small-scale farmers in Coorg and Chikmagalur to source our beans, ensuring that every sip supports ethical, sustainable coffee farming in India.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['2022', 'Year Founded'], ['500+', 'Daily Customers'], ['22', 'Menu Items'], ['100%', 'Indian Beans']].map(([val, label]) => (
              <div key={label} className="bg-white rounded-2xl border border-border p-6 text-center shadow-sm">
                <p className="font-display text-3xl font-bold text-caramel">{val}</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16" style={{ background: 'oklch(95% 0.015 80)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-2">What drives us</p>
            <h2 className="font-display text-3xl font-bold text-espresso">Our Values</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-cream" style={{ background: 'oklch(30% 0.05 50)' }}>
                  {v.icon}
                </div>
                <h3 className="font-semibold text-espresso mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-2">The people behind your cup</p>
          <h2 className="font-display text-3xl font-bold text-espresso">Meet the Team</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {TEAM.map(member => (
            <div key={member.name} className="bg-white rounded-2xl border border-border p-8 text-center shadow-sm w-64 hover:shadow-md transition-all">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl" style={{ background: 'oklch(93% 0.025 80)' }}>
                {member.emoji}
              </div>
              <h3 className="font-semibold text-espresso">{member.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sourcing */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, oklch(22% 0.04 50), oklch(30% 0.06 48))' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-caramel text-xs font-semibold uppercase tracking-widest mb-3">Farm to Cup</p>
          <h2 className="font-display text-3xl font-bold text-cream mb-5">Where Our Coffee Comes From</h2>
          <p className="text-cream/70 leading-relaxed mb-8">
            We partner with small-scale farms in Coorg (Kodagu) and Chikmagalur, Karnataka — India's finest coffee-growing regions. Our Arabica beans are shade-grown, hand-picked, and sun-dried. No mass-market blends. Ever.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['☕ Coorg Arabica', '🌿 Shade Grown', '🤝 Direct Trade', '🌱 Sustainable', '🇮🇳 100% Indian'].map(tag => (
              <span key={tag} className="px-4 py-2 rounded-full text-sm font-medium text-cream border border-cream/20 bg-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
