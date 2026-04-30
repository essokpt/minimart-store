/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar, Topbar } from './components/layout/Layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ProductDetail } from './pages/inventory/ProductDetail';
import { POS } from './pages/pos/POS';
import { Reports } from './pages/reports/Reports';
import { Orders } from './pages/orders/Orders';
import { CreateOrder } from './pages/orders/CreateOrder';
import { OrderDetail } from './pages/orders/OrderDetail';
import { Login } from './pages/auth/Login';
import { CreateStockReceipt } from './pages/Stock/CreateStockReceipt';
import { StockReceiptHistory } from './pages/Stock/StockReceiptHistory';
import { StockReceiptDetail } from './pages/Stock/StockReceiptDetail';
import { StockAreas } from './pages/Stock/StockAreas';
import { UserProfile } from './pages/settings/UserProfile';
import { Loyalty } from './pages/settings/Loyalty';
import { AnimatePresence } from 'motion/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Products } from './pages/inventory/Products';
import { Suppliers } from './pages/inventory/Suppliers';
import { ToastContainer } from './components/ui/Toast';
import { AreaDetail } from './pages/Stock/AreaDetail';
import { StoreInfo } from './pages/settings/StoreInfo';
import { NotificationsSettings } from './pages/settings/NotificationsSettings';

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
      <ToastContainer />
      <Sidebar />
      <div className={`flex-1 ${sidebarWidth} transition-all duration-300`}>
        <Topbar />
        <main className="pt-32 pb-20 px-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes location={location}>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/inventory/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
              <Route path="/inventory/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
              <Route path="/inventory/info" element={<ProtectedRoute><StoreInfo /></ProtectedRoute>} />

              <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
              <Route path="/orders/create" element={<ProtectedRoute><CreateOrder /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/stock/receipts" element={<ProtectedRoute><StockReceiptHistory /></ProtectedRoute>} />
              <Route path="/stock/receipt/create" element={<ProtectedRoute><CreateStockReceipt /></ProtectedRoute>} />
              <Route path="/stock/receipt/:id" element={<ProtectedRoute><StockReceiptDetail /></ProtectedRoute>} />
              <Route path="/stock-areas" element={<ProtectedRoute><StockAreas /></ProtectedRoute>} />
              <Route path="/stock-areas/:id" element={<ProtectedRoute><AreaDetail /></ProtectedRoute>} />

              <Route path="/settings/loyalty" element={<ProtectedRoute><Loyalty /></ProtectedRoute>} />
              <Route path="/settings/notifications" element={<ProtectedRoute><NotificationsSettings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

              {/* Fallback to dashboard */}
              <Route path="*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SidebarProvider>
          <Router>
            <AppContent />
          </Router>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

