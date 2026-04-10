import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Key, 
  Smartphone, 
  MapPin, 
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  ChevronRight,
  LogOut,
  Settings as SettingsIcon,
  CreditCard,
  Edit2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

export function UserProfile() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  // Mock activity data
  const activities = [
    { id: 1, action: 'Logged in', device: 'Chrome on Windows', time: '2 hours ago', icon: Clock },
    { id: 2, action: 'Updated inventory', item: 'Organic Bananas', time: '5 hours ago', icon: Edit2 },
    { id: 3, action: 'Completed transaction', amount: '$42.50', time: 'Yesterday', icon: CheckCircle2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 pb-20"
    >
      {/* Hero Header */}
      <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-container to-secondary opacity-90 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        
        <div className="absolute -bottom-16 left-12 flex items-end gap-6">
          <div className="relative group/avatar">
            <div className="w-32 h-32 rounded-2xl border-4 border-surface shadow-2xl overflow-hidden bg-surface-container">
              <img 
                src={user?.avatar} 
                alt={user?.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-primary text-on-primary rounded-lg shadow-lg hover:scale-110 transition-all opacity-0 group-hover/avatar:opacity-100">
              <Camera size={16} />
            </button>
          </div>
          <div className="pb-4 mb-16">
            <h1 className="text-3xl font-headline font-extrabold text-white drop-shadow-md">{user?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-white/20 text-white border-none backdrop-blur-md uppercase tracking-widest text-[10px] font-bold">
                {user?.role}
              </Badge>
              <span className="text-white/70 text-sm font-medium flex items-center gap-1.5 ml-2">
                <Calendar size={14} /> Joined March 2024
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 border-none shadow-xl bg-surface-container-lowest/50 backdrop-blur-sm" variant="elevated">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-headline font-bold text-on-surface">{t('profile.personal_info')}</h2>
              </div>
              <Button 
                variant={isEditing ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-xl transition-all"
              >
                {isEditing ? 'Save Changes' : <><Edit2 size={16} /> Edit Profile</>}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Input 
                  label="Full Name" 
                  defaultValue={user?.name} 
                  disabled={!isEditing}
                  icon={<User size={18} />}
                  className="bg-surface/50"
                />
                <Input 
                  label="Email Address" 
                  defaultValue={user?.email} 
                  disabled={!isEditing}
                  icon={<Mail size={18} />}
                  className="bg-surface/50"
                />
              </div>
              <div className="space-y-6">
                <Input 
                  label="Phone Number" 
                  defaultValue="+1 (555) 000-0000" 
                  disabled={!isEditing}
                  icon={<Smartphone size={18} />}
                  className="bg-surface/50"
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Location</label>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/10 text-on-surface">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-sm font-medium">San Francisco, CA</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-xl bg-surface-container-lowest/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-secondary-container text-secondary rounded-xl">
                <Clock size={20} />
              </div>
              <h2 className="text-xl font-headline font-bold text-on-surface">{t('profile.activity')}</h2>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container-high/50 transition-all border border-outline-variant/5 group">
                  <div className="p-3 bg-surface-container-highest rounded-xl text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <activity.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">{activity.action}</p>
                    <p className="text-xs text-on-surface-variant font-medium">
                      {activity.device || activity.item || activity.amount}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{activity.time}</span>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest py-4 border border-dashed border-outline-variant/20 rounded-2xl hover:bg-surface-container">
                View Full Audit Logs <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Security & Settings */}
        <div className="space-y-8">
          <Card className="p-8 border-none shadow-xl bg-surface-container-lowest group/security">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-error/10 text-error rounded-xl group-hover/security:bg-error group-hover/security:text-on-error transition-colors duration-500">
                <Shield size={20} />
              </div>
              <h2 className="text-xl font-headline font-bold text-on-surface">{t('profile.security')}</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-surface-container transition-all group/item">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2.5 bg-surface-container-highest rounded-lg text-on-surface-variant group-hover/item:text-primary transition-colors">
                    <Key size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Change Password</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">Last changed 3 months ago</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-on-surface-variant/40 group-hover/item:translate-x-1 transition-transform" />
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface hover:bg-surface-container transition-all group/item">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2.5 bg-surface-container-highest rounded-lg text-on-surface-variant group-hover/item:text-primary transition-colors">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Two-Factor Auth</p>
                    <p className="text-[10px] text-success font-bold uppercase tracking-widest">Active / Secured</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-primary/20 rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full shadow-sm"></div>
                </div>
              </button>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-xl bg-surface-container-lowest">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-tertiary-container text-tertiary rounded-xl">
                <Bell size={20} />
              </div>
              <h2 className="text-xl font-headline font-bold text-on-surface">{t('profile.preferences')}</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2.5 bg-surface-container-highest rounded-lg text-on-surface-variant">
                    <SettingsIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">System Theme</p>
                    <p className="text-[10px] text-on-surface-variant font-medium capitalize">Auto adaptive</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[9px]">SYNCED</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2.5 bg-surface-container-highest rounded-lg text-on-surface-variant">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Billing Info</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">VISA ending in 4242</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary-container p-2 rounded-md transition-colors"><Edit2 size={16} /></button>
              </div>
            </div>
          </Card>

          <div className="px-4 pb-8 lg:pb-0">
             <Button variant="error" size="lg" className="w-full rounded-2xl shadow-lg shadow-error/10 hover:shadow-error/20 h-14" onClick={logout}>
               <LogOut size={20} />
               Sign Out Securely
             </Button>
             <p className="text-center text-[10px] text-on-surface-variant/40 mt-6 font-medium uppercase tracking-[0.2em] leading-relaxed">
               Minimart Pro v1.4.2 • Enterprise Edition<br/>
               Secure Retail Infrastructure
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
