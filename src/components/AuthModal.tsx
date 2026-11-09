import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Coffee, X, User, Phone, Mail, CheckCircle2, Sparkles } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && !name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    login(name.trim() || 'Coffee Lover', phone.trim(), email.trim());
  };

  const handleQuickGuest = () => {
    login('Cafe Guest', '9876543210');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card border border-border shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-primary px-6 py-6 text-primary-foreground relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 rounded-full p-1.5 text-primary-foreground/80 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-caramel text-espresso shadow-md">
              <Coffee className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight">THE FIRST COFFEE</h3>
              <p className="text-xs text-primary-foreground/80 mt-0.5">Karve Road, Erandwane, Pune</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-amber-200 bg-black/20 rounded-lg px-3 py-1.5">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-300" />
            <span>Sign in to select items, track live orders & print receipts!</span>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-border bg-secondary/30">
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
              isSignUp 
                ? 'border-primary text-primary bg-background' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
              !isSignUp 
                ? 'border-primary text-primary bg-background' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikas Mohite"
                    className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-muted-foreground font-normal">(Optional for receipts)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}
            </button>
          </form>

          {/* Quick guest checkout bypass */}
          <div className="mt-5 border-t border-border/60 pt-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">In a hurry at the table?</p>
            <button
              type="button"
              onClick={handleQuickGuest}
              className="text-xs font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              Continue as 1-Click Guest →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
