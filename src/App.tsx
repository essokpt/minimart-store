/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar, Topbar } from './components/layout/Layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Inventory } from './pages/inventory/Inventory';
import { POS } from './pages/pos/POS';
import { Reports } from './pages/reports/Reports';
import { Orders } from './pages/orders/Orders';
import { CreateOrder } from './pages/orders/CreateOrder';
import { Login } from './pages/auth/Login';
import { StockReceipt } from './pages/inventory/StockReceipt';
import { StockReceiptHistory } from './pages/inventory/StockReceiptHistory';
import { StockAreas } from './pages/inventory/StockAreas';
import { AnimatePresence } from 'motion/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';

function AppContent() {
  const location = useLocation();
  const { state: sidebarState } = useSidebar();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <Login />;
  }

  const sidebarWidth = {
    show: 'ml-64',
    mini: 'ml-20',
    hidden: 'ml-0'
  }[sidebarState];

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      <div className={`flex-1 ${sidebarWidth} transition-all duration-300`}>
        <Topbar />
        <main className="pt-32 pb-20 px-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes location={location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/create" element={<CreateOrder />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/stock-receipt" element={<StockReceipt />} />
              <Route path="/stock-receipt/history" element={<StockReceiptHistory />} />
              <Route path="/stock-areas" element={<StockAreas />} />
              <Route path="/login" element={<Login />} />
              {/* Fallback to dashboard */}
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <Router>
          <AppContent />
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

