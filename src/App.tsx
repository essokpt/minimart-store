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
import { Login } from './pages/auth/Login';
import { CreateStockReceipt } from './pages/Stock/CreateStockReceipt';
import { StockReceiptHistory } from './pages/Stock/StockReceiptHistory';
import { StockAreas } from './pages/Stock/StockAreas';
import { Stores } from './pages/Stock/Stores';
import { Settings } from './pages/settings/Settings';
import { AnimatePresence } from 'motion/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Products } from './pages/inventory/Products';
import { ToastContainer } from './components/ui/Toast';

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
              <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/orders/create" element={<ProtectedRoute><CreateOrder /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/stock/receipts" element={<ProtectedRoute><StockReceiptHistory /></ProtectedRoute>} />
              <Route path="/stock/receipt/create" element={<ProtectedRoute><CreateStockReceipt /></ProtectedRoute>} />
              <Route path="/stock-areas" element={<ProtectedRoute><StockAreas /></ProtectedRoute>} />
              <Route path="/stores" element={<ProtectedRoute><Stores /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

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

