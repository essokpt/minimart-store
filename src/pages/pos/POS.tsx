import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Minus, Trash2, Receipt, Percent, ArrowRight, ScanLine, Users, ShoppingCart, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CheckoutModal } from '../../components/pos/CheckoutModal';
import { usePosStore } from '../../store/usePosStore';
import { useInventory, useProductSearch } from '../inventory/useInventory';
import { useCategories } from '../inventory/useCategories';
import { usePOS } from './usePOS';
import { useStores } from '../Stock/useStores';
import { useCustomers } from '../inventory/useCustomers';
import { useLoyalty } from '../settings/useLoyalty';
import { useNotificationStore } from '../../store/useNotificationStore';
import { formatCurrency, formatDateTime } from '../../lib/formatters';
import { cn } from '../../lib/utils';
import { Loading } from '../../components/ui/Loading';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Hand, Ticket, Clock as ClockIcon, UserPlus, Search as SearchIcon } from 'lucide-react';

export function POS() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('all');
  const { data: products = [], isLoading: isLoadingInventory } = useProductSearch(debouncedQuery, selectedCategoryId);
  const { categories } = useCategories();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { checkout, lookupBarcode } = usePOS();
  const { addNotification } = useNotificationStore();
  const { stores } = useStores();
  const activeStore = stores[0];
  const currencySymbol = activeStore?.currency_symbol || '$';
  const taxRateSetting = (activeStore?.tax_rate || 0) / 100;

  const cart = usePosStore((state) => state.cart);
  const addItem = usePosStore((state) => state.addItem);
  const removeItem = usePosStore((state) => state.removeItem);
  const updateQuantity = usePosStore((state) => state.updateQuantity);
  const setQuantity = usePosStore((state) => state.setQuantity);
  const cartTotal = usePosStore((state) => state.cartTotal());
  const cartItemCount = usePosStore((state) => state.cartItemCount());
  const orderDiscount = usePosStore((state) => state.orderDiscount);
  const setOrderDiscount = usePosStore((state) => state.setOrderDiscount);
  const setItemDiscount = usePosStore((state) => state.setItemDiscount);
  const heldOrders = usePosStore((state) => state.heldOrders);
  const holdCurrentOrder = usePosStore((state) => state.holdCurrentOrder);
  const resumeOrder = usePosStore((state) => state.resumeOrder);
  const deleteHeldOrder = usePosStore((state) => state.deleteHeldOrder);
  const selectedCustomer = usePosStore((state) => state.selectedCustomer);
  const selectCustomer = usePosStore((state) => state.selectCustomer);

  //const { searchCustomers } = useCustomers();
  //const { settings: loyaltySettings } = useLoyalty();

  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHeldOrdersOpen, setIsHeldOrdersOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [discountValue, setDiscountValue] = useState(orderDiscount);
  const [customerSearch, setCustomerSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState('');

  const taxRate = taxRateSetting;
  const taxAmount = cartTotal * taxRate;
  const finalTotal = cartTotal + taxAmount;

  const handleBarcodeScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const barcode = productSearch.trim();
      if (barcode) {
        // Try to find the product remotely (check products and receipt items)
        const product = await lookupBarcode(barcode);

        if (product) {
          addItem(product);
          setProductSearch('');
          addNotification('success', `Added ${product.name} to cart`);
        } else {
          addNotification('error', `No product found matching barcode: ${barcode}`);
        }
        console.log("scan cart", product);

      }
    }
  };

  if (isLoadingInventory) {
    return (
      <Loading label='POS data' />
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[calc(100vh-80px)] -m-10"
    >
      <section className="flex-1 p-10 overflow-y-auto bg-background">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Point of Sale</h2>
            <p className="text-on-surface-variant font-medium uppercase tracking-widest text-[10px]">Terminal #04 • Wednesday, Oct 25</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsCartOpen(!isCartOpen)} className="relative">
              <ShoppingCart size={16} />
              {isCartOpen ? 'Hide Cart' : 'Show Cart'}
              {!isCartOpen && cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </Button>
            <Button variant="secondary" onClick={() => setIsHeldOrdersOpen(true)} className="relative">
              <ClockIcon size={16} />
              Held Orders
              {heldOrders.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-tertiary text-on-tertiary text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {heldOrders.length}
                </span>
              )}
            </Button>
            <Button>
              <ScanLine size={16} />
              Quick Scan
            </Button>
          </div>
        </div>

        {/* Search & Scan Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search products..."
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container"
            />
          </div>
          <div className="flex gap-2 p-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm">
            <Badge variant="primary" className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest">{products.length} Products</Badge>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mb-10 flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          <Badge
            variant={selectedCategoryId === 'all' ? 'primary' : 'secondary'}
            className={`cursor-pointer whitespace-nowrap px-6 py-2.5 rounded-full transition-all duration-300 ${selectedCategoryId === 'all' ? 'shadow-lg shadow-primary/20 scale-105' : 'hover:bg-surface-container-high'}`}
            onClick={() => setSelectedCategoryId('all')}
          >
            All Categories
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.category_id}
              variant={selectedCategoryId === category.category_id ? 'primary' : 'secondary'}
              className={`cursor-pointer whitespace-nowrap px-6 py-2.5 rounded-full transition-all duration-300 ${selectedCategoryId === category.category_id ? 'shadow-lg shadow-primary/20 scale-105' : 'hover:bg-surface-container-high'}`}
              onClick={() => setSelectedCategoryId(category.category_id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const isOutOfStock = product.stock_value <= 0;
            const isLowStock = !isOutOfStock && product.stock_value < 10;

            return (
              <Card
                key={product.product_id}
                className={cn(
                  "p-4 text-left relative group overflow-hidden transition-all duration-300",
                  isOutOfStock ? "opacity-60 grayscale-[0.4] cursor-not-allowed" : "cursor-pointer hover:shadow-xl hover:shadow-primary/5"
                )}
                hover={!isOutOfStock}
                onClick={() => !isOutOfStock && addItem(product)}
              >
                {/* Stock Status Badges */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
                  {isOutOfStock ? (
                    <Badge variant="error" size="sm" className="shadow-sm border-error/20">Out of Stock</Badge>
                  ) : isLowStock ? (
                    <Badge variant="warning" size="sm" className="shadow-sm border-warning/20">Low: {product.stock_value}</Badge>
                  ) : (
                    <Badge variant="success" size="sm" className="shadow-sm border-green-500/20">{product.stock_value} Units</Badge>
                  )}
                </div>

                <div className="aspect-square rounded-md bg-surface-container-low mb-4 overflow-hidden border border-outline-variant/10 relative">
                  <img
                    src={product.image_url || product.image}
                    alt={product.name}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-700",
                      !isOutOfStock && "group-hover:scale-110"
                    )}
                    referrerPolicy="no-referrer"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-surface-container/60 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="bg-error/10 border-2 border-error/40 px-4 py-2 rounded-sm rotate-[-12deg] shadow-2xl scale-110">
                        <span className="text-error font-mono font-black text-xs uppercase tracking-[0.2em] drop-shadow-sm">Sold Out</span>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1 opacity-70">{product.model}</p>
                <h3 className="font-headline font-bold text-on-surface leading-tight mb-3 truncate pr-2" title={product.name}>{product.name}</h3>

                <div className="flex justify-between items-center mt-auto">
                  <span className="text-lg font-mono font-bold text-on-surface-variant">{formatCurrency(product.unit_price, { currencySymbol })}</span>
                  <div className={cn(
                    "w-9 h-9 rounded-md flex items-center justify-center shadow-sm transition-all duration-300 border border-outline-variant/20",
                    isOutOfStock
                      ? "bg-surface-container text-on-surface-variant/20"
                      : "bg-secondary-container text-on-secondary-container group-hover:bg-primary group-hover:text-on-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30"
                  )}>
                    <Plus size={18} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {isCartOpen && (
          <motion.section
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 420, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full glass-panel border-l border-outline-variant/10 shadow-2xl z-10 shrink-0 overflow-hidden"
          >
            <div className="w-[420px] h-full flex flex-col">
              <div className="p-4 border-b border-surface-container">
                <div className="relative flex-1 group w-full">
                  <Input
                    autoFocus
                    placeholder="Search products or scan barcode..."
                    icon={<Search size={22} className="text-primary group-focus-within:scale-110 transition-transform" />}
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    onKeyDown={handleBarcodeScan}
                    className="w-full text-sm font-medium bg-surface-container-lowest border-outline-variant/20 focus:ring-primary/20 transition-all rounded-xl shadow-sm"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant/40 hover:text-error transition-colors"
                      title="Clear Search"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-headline font-extrabold text-2xl text-on-surface">Order Summary</h3>
                  <Badge variant="secondary" className="font-mono">{cartItemCount} ITEMS</Badge>

                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant/60 font-medium">
                  {selectedCustomer ? (
                    <>
                      <Users size={14} className="text-primary" />
                      <span className="text-primary font-bold">{selectedCustomer.full_name}</span>
                      <span className="mx-1 opacity-40">•</span>
                      <span>{selectedCustomer.loyalty_points} Points</span>
                      <button onClick={() => selectCustomer(null)} className="text-error font-bold ml-auto hover:underline">Remove</button>
                    </>
                  ) : (
                    <>
                      <Users size={14} />
                      <span>Guest Customer</span>
                      <button onClick={() => setIsCustomerModalOpen(true)} className="text-primary font-bold ml-auto hover:underline">Add Loyalty</button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant space-y-4">
                    <Receipt size={48} className="opacity-20" />
                    <p className="font-medium">Cart is empty.<br />Scan or select items to add.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product_id} className="flex gap-6 group items-center">
                      <div className="w-20 h-20 rounded-md bg-surface-container-low overflow-hidden flex-shrink-0 border border-outline-variant/20 shadow-sm">
                        <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 py-1">
                        <div className="flex justify-between mb-3 items-start relative">
                          <h4 className="text-base font-bold text-on-surface leading-tight pr-12">{item.name}</h4>
                          <button onClick={() => removeItem(item.product_id)} className="absolute top-0 right-0 text-on-surface-variant/40 hover:text-error transition-colors p-1"><Trash2 size={18} /></button>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center bg-surface-container-low rounded-md p-1 shadow-sm border border-outline-variant/10">
                            <button
                              onClick={() => updateQuantity(item.product_id, -1)}
                              disabled={item.qty <= 1}
                              className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors bg-surface-container hover:bg-surface-container-highest rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              value={item.qty}
                              min={1}
                              max={item.stock_value}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val)) setQuantity(item.product_id, val);
                              }}
                              onFocus={(e) => e.target.select()}
                              className="text-sm font-mono font-bold w-12 text-center bg-transparent border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => updateQuantity(item.product_id, 1)}
                              disabled={item.stock_value !== undefined && item.qty >= item.stock_value}
                              className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors bg-surface-container hover:bg-surface-container-highest rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="text-right">
                            <span className="block text-base font-mono font-extrabold text-primary">{formatCurrency(item.unit_price * (1 - (item.discount || 0) / 100) * item.qty, { currencySymbol })}</span>
                            <span className="block text-[10px] text-on-surface-variant font-mono font-bold uppercase tracking-wider mt-0.5">@ {formatCurrency(item.unit_price, { currencySymbol })} / ea</span>
                            {item.discount ? (
                              <Badge variant="success" className="text-[8px] mt-1">-{item.discount}% OFF</Badge>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 bg-surface-container border-t border-outline-variant/10 space-y-4">
                {/* <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-medium">Subtotal</span>
                    <span className="text-on-surface font-mono font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-medium">Tax (8%)</span>
                    <span className="text-on-surface font-mono font-bold">${taxAmount.toFixed(2)}</span>
                  </div>
                </div> */}

                <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center mb-6">
                  <span className="text-base font-headline font-extrabold text-on-surface">Total Amount</span>
                  <span className="text-3xl font-mono font-bold text-primary tracking-tight">{formatCurrency(finalTotal, { currencySymbol })}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button variant="secondary" className="w-full" onClick={holdCurrentOrder} disabled={cart.length === 0}>
                    <Hand size={16} />
                    Hold Order
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => setIsDiscountModalOpen(true)}>
                    <Ticket size={16} />
                    {orderDiscount > 0 ? `-${orderDiscount}%` : 'Discount'}
                  </Button>
                </div>

                <Button
                  className="w-full py-4 text-lg"
                  onClick={() => setIsCheckoutOpen(true)}
                  disabled={cart.length === 0}
                >
                  Check Out
                  {/* <ArrowRight size={18} /> */}
                </Button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={finalTotal}
      />

      <Modal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        title="Apply Order Discount"
        footer={
          <div className="flex gap-4 w-full">
            <Button variant="secondary" onClick={() => setIsDiscountModalOpen(false)} className="flex-1">Cancel</Button>
            <Button className="flex-1" onClick={() => {
              setOrderDiscount(discountValue);
              setIsDiscountModalOpen(false);
            }}>Apply</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">Enter a percentage discount to apply to the entire cart.</p>
          <Input
            label="Discount Percentage (%)"
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
            max={100}
            min={0}
            icon={<Ticket size={18} />}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Customer Loyalty"
      >
        <div className="space-y-6">
          <Input
            label="Search Customer"
            placeholder="Search by name, phone, or email..."
            value={customerSearch}
            // onChange={async (e) => {
            //   const val = e.target.value;
            //   setCustomerSearch(val);
            //   if (val.length > 2) {
            //     const results = await searchCustomers(val);
            //     setSearchResults(results);
            //   } else {
            //     setSearchResults([]);
            //   }
            // }}
            icon={<SearchIcon size={18} />}
          />

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {searchResults.length === 0 && customerSearch.length > 2 && (
              <div className="text-center py-6 text-on-surface-variant text-sm italic">
                No customers found matching "{customerSearch}"
              </div>
            )}
            {searchResults.map((customer) => (
              <div
                key={customer.customer_id}
                className="p-4 bg-surface-container-low hover:bg-primary/5 rounded-lg border border-outline-variant/10 flex items-center justify-between cursor-pointer transition-colors"
                onClick={() => {
                  selectCustomer(customer);
                  setIsCustomerModalOpen(false);
                  setCustomerSearch('');
                  setSearchResults([]);
                }}
              >
                <div>
                  <p className="font-bold text-on-surface">{customer.full_name}</p>
                  <p className="text-[10px] text-on-surface-variant font-mono">{customer.phone} • {customer.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant="primary" className="text-[10px]">{customer.loyalty_points} Points</Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-outline-variant/10 text-center">
            <p className="text-xs text-on-surface-variant mb-4 font-medium uppercase tracking-widest">Or Register New</p>
            <Button variant="secondary" className="w-full">
              <UserPlus size={16} />
              Register New Customer
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isHeldOrdersOpen}
        onClose={() => setIsHeldOrdersOpen(false)}
        title="Held Orders"
      >
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {heldOrders.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant space-y-2">
              <ClockIcon size={48} className="mx-auto opacity-10" />
              <p className="text-sm font-medium">No held orders found.</p>
            </div>
          ) : (
            heldOrders.map((order) => (
              <div key={order.id} className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/10 flex items-center justify-between group">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-primary mr-2 uppercase tracking-tighter">{order.id}</span>
                    <Badge variant="secondary">{order.cart.length} Items</Badge>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-mono">{formatDateTime(order.timestamp)}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-error hover:bg-error/5" onClick={() => deleteHeldOrder(order.id)}>
                    <Trash2 size={16} />
                  </Button>
                  <Button size="sm" onClick={() => {
                    resumeOrder(order.id);
                    setIsHeldOrdersOpen(false);
                  }}>
                    Resume
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </motion.div>
  );
}
