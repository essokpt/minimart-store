import { motion } from 'motion/react';
import { Search, Plus, Minus, Trash2, Receipt, Percent, ArrowRight, ScanLine, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export function POS() {
  const categories = ['All Items', 'Beverages', 'Snacks', 'Dairy & Eggs', 'Bakery', 'Personal Care'];
  
  const products = [
    { name: 'Classic Cola 500ml', category: 'Beverages', price: '$1.85', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiSVmFigMTxE6oCnnoLszxfcLUKKTQ4D_e-Ci-hgyXVQiqB589vrSrFCgfVtvJZVnukUhqsfE9uMiP3XaYbFbi7wOdVptsGkeIcFHX1aUd6Y4J_2plFJXc-gVOKK5OuddIFWf8P_j2PeP5fudT7H960Jz4xN9RyEO3GXWFYip3CGz6aNHLpG-l7XOx3ynyQJWCY_2HIZSDSgRQaUDB-vKorncmJFZ6SiGepMO6SRZNNxON0DcMlBYtOOF1QRQ9sXnNFQ2R4Xwz-iU' },
    { name: 'Artisan Cupcake', category: 'Bakery', price: '$3.50', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD8NLV3Vyva-ApxiGqQV_P17FRbctpdjcQMzlW_M8UqmRUiGLoXeTrFB6YtJkNc4egvNhOXSOhGbs6AzUxMVtYOTA9x8p8p_4LEQX3bPn0k96qqt5vu6HKv6-kbojoh1cpdZMkHpewz2jAh-sXAo69XryfAsSQV3j3bZD_Elu5C9LG2PxL3-usbQNRfnnxSGQ5sXAOrEJUYpxTeisrYsVtxMwxU_FKzj2ZgDgv_Xi_gZc3_el9gz1O9F7XVzG0UF4sxhOfR9c5xbU' },
    { name: 'Sea Salt Chips 150g', category: 'Snacks', price: '$2.20', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGXORq1fqxHkC4rZQQm1Jfplo6UQIfEm8NupuHr6FQAybseACXFaddzDgWo4XsAOMxyrsWCfTiN94WPhYt00NU7KAtH7-oTa-9q9Vtgt9c9vRC4wY4CRS4uBaHBe5x-HkhqL674QvlYRJ9PrAPHf41KewE8IUgJ2kZamtlERWNMlH00IW7IHAKB3jt1CnglzNuQT2YFsdhkDh0oJu-8VS6TCZMT2n92w50UtB5SQom2lubwFmAxqID48ap9DDMbc-_jccO9eINmpY' },
    { name: 'Whole Milk 1L', category: 'Dairy', price: '$1.45', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADrxThvqR05u55ktKUmORd-TMZSTZTzFnKr4Icq88wOc8gUks7HTNbXsLR9UXTa9-93pBbVA6yluDm3ZqvBHId_LTQuZt_qaA_XN0_1BTTdbwdoSyKdLLvAyV0aceKOLkduDAQagOiAShF-jXkuXhkvjkzDvAhpvWxuqEXHNoYKyYJlblwREd4tiB5zGno6uUAH9hlEJZBf8lXgN6V4Z_fj4wKMz2FHQMlOulvHORvu9NOlhlgCCjH-SDA34GHizXr9mhJguGLRxA' },
    { name: 'Green Apples (kg)', category: 'Produce', price: '$4.20', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxJ3lQ3MyttQeFs5Le9UyOO-ji76XgLOqdVv_JOd1GxbBYjNe_jqIbVKvvF_OWAIPnT81yn2w92qidFA4QQrcur9kD5-BzicCd2dy5Cykjeha-NdFof4Tij3oJXAMjt1ZN-9Sb5zdR9cofCD6te92vQXTRDH4LsfCmHTT8bWOA-_ZvFtM4ReXnPD8tTKZCDc5tsH6YcIBb3WoLcr66fsQNsmtTtdeHWvj_MLM2DHdZP1yN78rBOMPqQka2Nc-UZGorzrNG74x6pX4' },
    { name: 'Gourmet Coffee Beans', category: 'Pantry', price: '$12.50', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYR-Lv-l7fxSFbqIG8iFP7nqun7XFNLR7NhSFluxXYskAEo4uN4mTQJD7ep7yS24JHZgYRj7ditNKsVLYmdm8zprB9Tql3kvKgnfjKs9T2cxrHYbPU3mSijySkqBuLtGWtbo9J9T9_rJhQ-7w1ucDq183WeIUo-PmSTwyKt_KEDuUNZyQZSdnvmkh-iuIslO8pFaRyZ5M-l9horXRJ3wevhVK1H_cBAjpOCLYZ5jXzuQVvV9_QzyOH3CM6V8y_DrBnEmVYagAjpLw' },
  ];

  const cart = [
    { name: 'Classic Cola 500ml', price: 1.85, qty: 2, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyuc6vbROeSyILdT8MUjkxWjJUTM24F5T5dSmsW6_D4HCHVpo-mb7uIMU_Klq_jjYZYAA1w8la2ul4AWeNB1o6l7cSGab7YdW9lS-nkcCQbyRoM5A6jKs_wGoVHdSGZECfEsOg0RFq6RHTUuUrxLPi1FqZ0e0s7uOK7fGS_4dq0m_bRM8_kkf9I4YDRO_2AidN4x4K8sboaYN2sG8qMrR_EUalN5fCF1fKMlfvdBbTAllMapupvSJRENxypAknquj7z6Bmg2bBLW8' },
    { name: 'Whole Milk 1L', price: 1.45, qty: 1, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqqzSZds_ndBN5Tv83NvKD7u5EqmJEt-O7CGtBAZ29egeQ-w93g3sBwssGBxafziklPdpOqFrd-3qeHUM2uhKDDMhZlK5ZOeSgwlKmGPwLX3Zaqkz1wFA3JQsZc38yQMCKdc8e0ucF7PPXKWM7shQgUqTT2uCdMxh0e517ciG-YaRf6YAyRtQlQ8TzwLKpeU1Y_Fu5eQeJJeXcpPktUMxlmnXfpEVYxRFIg01OdNwe2Oa_6uXfopwI_2SD0VeCUGXaOjEtLBAPW90' },
  ];

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
          <Button>
            <ScanLine size={16} />
            Quick Scan
          </Button>
        </div>

        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat, i) => (
            <Button 
              key={cat} 
              variant={i === 0 ? 'primary' : 'secondary'}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <Card key={i} className="p-4 text-left" hover>
              <div className="aspect-square rounded-md bg-surface-container mb-4 overflow-hidden border border-outline-variant/10">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">{product.category}</p>
              <h3 className="font-headline font-bold text-on-surface leading-tight mb-2 truncate">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-lg font-mono font-bold text-on-surface-variant">{product.price}</span>
                <div className="w-9 h-9 rounded-md bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm group-hover:bg-primary group-hover:text-on-primary transition-colors border border-outline-variant/20">
                  <Plus size={18} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-[420px] h-full glass-panel flex flex-col border-l border-outline-variant/10 shadow-2xl z-10">
        <div className="p-8 border-b border-surface-container">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-headline font-extrabold text-2xl text-on-surface">Order Summary</h3>
            <Badge variant="secondary" className="font-mono">3 ITEMS</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant/60 font-medium">
            <Users size={14} />
            <span>Guest Customer</span>
            <button className="text-primary font-bold ml-auto hover:underline">Add Loyalty</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {cart.map((item, i) => (
            <div key={i} className="flex gap-5 group">
              <div className="w-16 h-16 rounded-md bg-surface-container-low overflow-hidden flex-shrink-0 border border-outline-variant/20">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <h4 className="text-sm font-bold text-on-surface leading-tight">{item.name}</h4>
                  <span className="text-sm font-mono font-bold text-on-surface">${(item.price * item.qty).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-surface-container-low rounded-md px-1.5 py-1 shadow-sm border border-outline-variant/10">
                    <button className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"><Minus size={14} /></button>
                    <span className="text-xs font-mono font-bold w-8 text-center">{item.qty}</span>
                    <button className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"><Plus size={14} /></button>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-mono font-bold uppercase tracking-wider">@ ${item.price.toFixed(2)} ea</span>
                  <button className="ml-auto text-on-surface-variant/40 hover:text-error transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-surface-container border-t border-outline-variant/10 space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant font-medium">Subtotal</span>
              <span className="text-on-surface font-mono font-bold">$5.15</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant font-medium">Tax (8%)</span>
              <span className="text-on-surface font-mono font-bold">$0.41</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center mb-6">
            <span className="text-base font-headline font-extrabold text-on-surface">Total Amount</span>
            <span className="text-3xl font-mono font-bold text-primary tracking-tight">$5.56</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button variant="secondary" className="w-full">
              <Receipt size={16} />
              Hold Order
            </Button>
            <Button variant="secondary" className="w-full">
              <Percent size={16} />
              Discount
            </Button>
          </div>

          <Button className="w-full py-6 text-lg">
            Check Out
            <ArrowRight size={22} />
          </Button>
        </div>
      </section>
    </motion.div>
  );
}
