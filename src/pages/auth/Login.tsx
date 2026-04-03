import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ShieldCheck, Globe, Store, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@minimart.pro');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-pattern relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl"></div>

      <main className="relative z-10 w-full max-w-[460px] px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-md shadow-lg shadow-primary/20 mb-6 hover-scale border border-primary/20">
            <Store size={32} className="text-on-primary-container" />
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-2">MiniMart Pro</h1>
          <p className="text-on-surface-variant font-medium uppercase tracking-widest text-xs">Professional Inventory Management</p>
        </div>

        <Card className="overflow-hidden" variant="elevated">
          <div className="p-10 md:p-12">
            <form className="space-y-8" onSubmit={handleLogin}>
              {error && (
                <div className="p-3 bg-error/10 text-error text-xs font-bold rounded-sm border border-error/20">
                  {error}
                </div>
              )}
              <Input 
                label="Work Email" 
                type="email" 
                placeholder="name@minimart.pro" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                required
              />

              <div className="space-y-2.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[10px] font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">Forgot password?</a>
                </div>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={18} />}
                  required
                />
              </div>

              <div className="flex items-center space-x-3 ml-1">
                <input 
                  type="checkbox" 
                  id="remember"
                  className="h-5 w-5 rounded-sm border-outline-variant text-primary focus:ring-primary cursor-pointer transition-all bg-surface-container"
                />
                <label htmlFor="remember" className="text-xs text-on-surface-variant font-bold uppercase tracking-widest cursor-pointer select-none">
                  Remember this device for 30 days
                </label>
              </div>

              <Button type="submit" className="w-full py-4 text-sm" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Secure Sign In
                    <ArrowRight size={20} />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-10 pt-10 border-t border-outline-variant/10 text-center">
              <p className="text-on-surface-variant text-sm font-medium">
                First time managing a store? 
                <a href="#" className="text-primary font-bold hover:underline ml-2">Request Access</a>
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-12 text-center space-y-6">
          <div className="flex justify-center items-center gap-8">
            <div className="flex items-center gap-2 text-on-surface-variant/60">
              <ShieldCheck size={14} className="text-primary/50" />
              <span className="text-[10px] font-black uppercase tracking-widest">AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant/60">
              <Globe size={14} className="text-primary/50" />
              <span className="text-[10px] font-black uppercase tracking-widest">SSO Enabled</span>
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant/60 leading-relaxed max-w-[320px] mx-auto font-medium">
            By logging in, you agree to the <a href="#" className="underline hover:text-on-surface transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-on-surface transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </main>

      <div className="hidden lg:block fixed right-12 top-12 bottom-12 w-[38%] rounded-md overflow-hidden shadow-2xl border border-outline-variant/20">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsmCt6SnMlQ8FodtoJB0_RkziNPaffeuIz7uxwLfGbqeesxQf8GRcvQvv1df0lm-2E6m_WgkNCBqXAKgYeMmhoDWWrDqmKsZCnN33xJAYRiW0BvlR1l_81CU4kKbx8UNo3bt8vYJECyXarvQuCBrPfrM6w-cobAfiPRGkbJhhzx1xA7M7PNXjWeNpJ_6YNKRhJY0PBt70vAjUNpAeqBslb4lXumOB0VJ_1iSY8axCBQNVOPEtU7VJyj0Azjdb51wUwu7umdROzmY4" 
          alt="Retail aesthetic" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-12 left-12 right-12 z-20 glass-panel p-10 rounded-md border border-outline-variant/10 shadow-2xl">
          <h3 className="font-headline text-3xl font-extrabold text-on-surface mb-3">Efficiency refined.</h3>
          <p className="text-on-surface-variant font-medium leading-relaxed text-lg">
            Experience the next generation of boutique inventory management. Clean, precise, and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
