import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, PlusCircle, Search, Bell, HelpCircle, Store, Sun, Moon, ClipboardList, Truck, History, Menu, ChevronLeft, ChevronRight, MapPin, ChevronDown, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function Sidebar() {
  const location = useLocation();
  const { state: sidebarState } = useSidebar();
  const { logout, user } = useAuth();
  const { t } = useTranslation();

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Inventory': location.pathname.includes('/inventory') || location.pathname.includes('/stock')
  });

  const toggleSubMenu = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const menuItems = [
    { icon: LayoutDashboard, labelKey: 'sidebar.dashboard', path: '/' },
    {
      icon: Package,
      labelKey: 'sidebar.inventory',
      path: '/inventory',
      subItems: [
        { labelKey: 'sidebar.overview', path: '/inventory' },
        { labelKey: 'sidebar.products', path: '/products' },
        { labelKey: 'sidebar.stock_receipt', path: '/stock/receipts' },
        { labelKey: 'sidebar.stock_areas', path: '/stock-areas' },
        { labelKey: 'sidebar.stores', path: '/stores' },
      ]
    },
    { icon: ShoppingCart, labelKey: 'sidebar.pos', path: '/pos' },
    { icon: ClipboardList, labelKey: 'sidebar.orders', path: '/orders' },
    { icon: BarChart3, labelKey: 'sidebar.reports', path: '/reports' },
  ];

  if (sidebarState === 'hidden') return null;

  const isMini = sidebarState === 'mini';

  return (
    <aside className={`fixed left-0 top-0 h-full ${isMini ? 'w-20' : 'w-64'} bg-surface-container border-r border-outline-variant/10 flex flex-col py-8 ${isMini ? 'px-4' : 'px-6'} z-50 shadow-2xl transition-all duration-300 overflow-y-auto no-scrollbar`}>
      <div className={`mb-10 flex items-center ${isMini ? 'justify-center' : 'gap-3 px-2'}`}>
        <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 border-t border-white/20 shrink-0">
          <Store size={24} />
        </div>
        {!isMini && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <h1 className="font-headline font-extrabold text-on-surface text-lg leading-none tracking-tight">MiniMart Pro</h1>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">{t('sidebar.premium_retail')}</p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.subItems && item.subItems.some(sub => location.pathname === sub.path));
          const isExpanded = expandedMenus[t(item.labelKey)];
          const itemLabel = t(item.labelKey);

          return (
            <div key={itemLabel} className="space-y-1">
              <Link
                to={item.subItems ? '#' : item.path}
                onClick={item.subItems && !isMini ? (e) => toggleSubMenu(itemLabel, e) : undefined}
                className={`flex items-center ${isMini ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-sm transition-all duration-200 group ${isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-sm border border-primary/20'
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                  }`}
                title={isMini ? itemLabel : undefined}
              >
                <item.icon size={20} className={isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'} />
                {!isMini && (
                  <>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-headline text-sm font-medium flex-1"
                    >
                      {itemLabel}
                    </motion.span>
                    {item.subItems && (
                      <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                    )}
                  </>
                )}
              </Link>

              {/* Sub-menus */}
              {!isMini && item.subItems && (
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-11 pr-4 space-y-1"
                    >
                      {item.subItems.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`block py-2 text-sm transition-colors ${isSubActive
                              ? 'text-primary font-bold'
                              : 'text-on-surface-variant hover:text-on-surface'
                              }`}
                          >
                            {t(sub.labelKey)}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </nav>

      <div className={`mt-8 pt-6 space-y-2 border-t border-outline-variant/10 ${isMini ? 'flex flex-col items-center' : ''}`}>
        {!isMini ? (
          <Link to="/orders/create" className="block mb-4">
            <Button className="w-full">
              <PlusCircle size={18} />
              <span className="font-headline text-sm">{t('sidebar.new_transaction')}</span>
            </Button>
          </Link>
        ) : (
          <Link to="/orders/create" className="mb-4">
            <button className="p-3 bg-primary text-on-primary rounded-full shadow-lg hover:bg-primary-container transition-colors" title={t('sidebar.new_transaction')}>
              <PlusCircle size={20} />
            </button>
          </Link>
        )}

        <Link to="/settings" className={`flex items-center ${isMini ? 'justify-center' : 'gap-3 px-4'} py-3 text-on-surface-variant hover:text-on-surface transition-all rounded-sm hover:bg-surface-container-highest`} title={isMini ? t('sidebar.settings') : undefined}>
          <Settings size={20} />
          {!isMini && <span className="font-headline text-sm font-medium">{t('sidebar.settings')}</span>}
        </Link>

        <button onClick={logout} className={`flex items-center w-full ${isMini ? 'justify-center' : 'gap-3 px-4'} py-3 text-on-surface-variant hover:text-error transition-all rounded-sm hover:bg-surface-container-highest cursor-pointer focus:outline-none`} title={isMini ? t('sidebar.logout') : undefined}>
          <LogOut size={20} />
          {!isMini && <span className="font-headline text-sm font-medium">{t('sidebar.logout')}</span>}
        </button>
      </div>
    </aside>
  );
}

export function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const { state: sidebarState, toggle: toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'th' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const topbarWidth = {
    show: 'w-[calc(100%-16rem)]',
    mini: 'w-[calc(100%-5rem)]',
    hidden: 'w-full'
  }[sidebarState];

  return (
    <header className={`fixed top-0 right-0 ${topbarWidth} h-20 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 px-10 flex justify-between items-center shadow-md transition-all duration-300`}>
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2.5 text-on-surface-variant/60 hover:bg-surface-container rounded-sm transition-colors"
          title={t('topbar.toggle_sidebar')}
        >
          {sidebarState === 'show' ? <ChevronLeft size={24} /> : sidebarState === 'mini' ? <ChevronRight size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex-1 max-w-xl">
          <Input
            placeholder={t('topbar.search_placeholder')}
            icon={<Search size={18} />}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="p-2.5 text-on-surface-variant/60 hover:bg-surface-container rounded-sm transition-colors relative flex items-center gap-1.5"
            title={t('topbar.switch_language')}
          >
            <Globe size={20} />
            <span className="font-mono text-xs font-bold uppercase">{i18n.language}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2.5 text-on-surface-variant/60 hover:bg-surface-container rounded-sm transition-colors relative"
            title={theme === 'light' ? t('topbar.switch_dark') : t('topbar.switch_light')}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="p-2.5 text-on-surface-variant/60 hover:bg-surface-container rounded-sm transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <button className="p-2.5 text-on-surface-variant/60 hover:bg-surface-container rounded-sm transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>

        <div className="h-8 w-px bg-outline-variant/30"></div>

        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-on-surface">{user?.name || t('sidebar.guest')}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
              {user?.role ? (user.role === 'Store Manager' ? t('sidebar.store_manager') : user.role) : t('sidebar.viewer')}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10">
            <img
              src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuD0ABdzvIhjWGcc48kMT_9nMtqNkWEJJODqTI6o7Mvq9xAF4zXnNwqryDQxQVB3eUgQw9HKBl89Sb3oRTwMO9BwtNL7ybL1IoPcHAj6QF7IPIGvHnxOUHkJ7qs342Cs_Ucdq40KDXXgaN27d8Gg4Gw8TD5MsdRPGU0LyNGTDVXhJyOoYMIce1B2n3GaAO-UfRnBmmWo2Y7bKWomIDO36Aa8iH4fJC3DGLKk2P027esBxqCd7Gfz0kMt8Phz_0KPZPSfsSXFgkxHPok"}
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
