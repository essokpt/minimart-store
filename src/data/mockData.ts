import { Product, Stat, TopSellingItem } from '../types';

export const categories = ['All Items', 'Beverages', 'Snacks', 'Dairy & Eggs', 'Bakery', 'Personal Care'];

export const products: Product[] = [
  { id: '1', name: 'Classic Cola 500ml', category: 'Beverages', price: 1.85, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiSVmFigMTxE6oCnnoLszxfcLUKKTQ4D_e-Ci-hgyXVQiqB589vrSrFCgfVtvJZVnukUhqsfE9uMiP3XaYbFbi7wOdVptsGkeIcFHX1aUd6Y4J_2plFJXc-gVOKK5OuddIFWf8P_j2PeP5fudT7H960Jz4xN9RyEO3GXWFYip3CGz6aNHLpG-l7XOx3ynyQJWCY_2HIZSDSgRQaUDB-vKorncmJFZ6SiGepMO6SRZNNxON0DcMlBYtOOF1QRQ9sXnNFQ2R4Xwz-iU' },
  { id: '2', name: 'Artisan Cupcake', category: 'Bakery', price: 3.50, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD8NLV3Vyva-ApxiGqQV_P17FRbctpdjcQMzlW_M8UqmRUiGLoXeTrFB6YtJkNc4egvNhOXSOhGbs6AzUxMVtYOTA9x8p8p_4LEQX3bPn0k96qqt5vu6HKv6-kbojoh1cpdZMkHpewz2jAh-sXAo69XryfAsSQV3j3bZD_Elu5C9LG2PxL3-usbQNRfnnxSGQ5sXAOrEJUYpxTeisrYsVtxMwxU_FKzj2ZgDgv_Xi_gZc3_el9gz1O9F7XVzG0UF4sxhOfR9c5xbU' },
  { id: '3', name: 'Sea Salt Chips 150g', category: 'Snacks', price: 2.20, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGXORq1fqxHkC4rZQQm1Jfplo6UQIfEm8NupuHr6FQAybseACXFaddzDgWo4XsAOMxyrsWCfTiN94WPhYt00NU7KAtH7-oTa-9q9Vtgt9c9vRC4wY4CRS4uBaHBe5x-HkhqL674QvlYRJ9PrAPHf41KewE8IUgJ2kZamtlERWNMlH00IW7IHAKB3jt1CnglzNuQT2YFsdhkDh0oJu-8VS6TCZMT2n92w50UtB5SQom2lubwFmAxqID48ap9DDMbc-_jccO9eINmpY' },
  { id: '4', name: 'Whole Milk 1L', category: 'Dairy & Eggs', price: 1.45, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADrxThvqR05u55ktKUmORd-TMZSTZTzFnKr4Icq88wOc8gUks7HTNbXsLR9UXTa9-93pBbVA6yluDm3ZqvBHId_LTQuZt_qaA_XN0_1BTTdbwdoSyKdLLvAyV0aceKOLkduDAQagOiAShF-jXkuXhkvjkzDvAhpvWxuqEXHNoYKyYJlblwREd4tiB5zGno6uUAH9hlEJZBf8lXgN6V4Z_fj4wKMz2FHQMlOulvHORvu9NOlhlgCCjH-SDA34GHizXr9mhJguGLRxA' },
  { id: '5', name: 'Green Apples (kg)', category: 'Produce', price: 4.20, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxJ3lQ3MyttQeFs5Le9UyOO-ji76XgLOqdVv_JOd1GxbBYjNe_jqIbVKvvF_OWAIPnT81yn2w92qidFA4QQrcur9kD5-BzicCd2dy5Cykjeha-NdFof4Tij3oJXAMjt1ZN-9Sb5zdR9cofCD6te92vQXTRDH4LsfCmHTT8bWOA-_ZvFtM4ReXnPD8tTKZCDc5tsH6YcIBb3WoLcr66fsQNsmtTtdeHWvj_MLM2DHdZP1yN78rBOMPqQka2Nc-UZGorzrNG74x6pX4' },
  { id: '6', name: 'Gourmet Coffee Beans', category: 'Pantry', price: 12.50, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYR-Lv-l7fxSFbqIG8iFP7nqun7XFNLR7NhSFluxXYskAEo4uN4mTQJD7ep7yS24JHZgYRj7ditNKsVLYmdm8zprB9Tql3kvKgnfjKs9T2cxrHYbPU3mSijySkqBuLtGWtbo9J9T9_rJhQ-7w1ucDq183WeIUo-PmSTwyKt_KEDuUNZyQZSdnvmkh-iuIslO8pFaRyZ5M-l9horXRJ3wevhVK1H_cBAjpOCLYZ5jXzuQVvV9_QzyOH3CM6V8y_DrBnEmVYagAjpLw' },
];

export const stats: Stat[] = [
  { label: 'Total Revenue', value: '$42,890.50', change: '+12.5%', iconName: 'TrendingUp', color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Active Orders', value: '124', change: 'Active', iconName: 'ShoppingBasket', color: 'text-secondary', bg: 'bg-secondary-container/50' },
  { label: 'Store Traffic', value: '1,208', change: '-3.2%', iconName: 'Users', color: 'text-tertiary', bg: 'bg-tertiary/10' },
  { label: 'Low Stock', value: '82%', change: '8 Items', iconName: 'AlertTriangle', color: 'text-error', bg: 'bg-error-container/50' },
];

export const topSelling: TopSellingItem[] = [
  { name: 'Pro Runner X1', sales: '42 sales today', price: '$120', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNzuemJUIgVY3P84AiKF0xhsDm_RxuVaVqUhyVJbYdMTNZaHdV7CD3tuQ7WExM8I9ooGKBp0iHFUbBfIhlmuaKDa7B2ZwGMWNKvO4Cu8OdWSrbIFmo4rP9GnW-sDXqxKYgNUO6qEHRlEu5-3AcLfRi8R2_ZJ7Ti7goa7YsAvF7rcS7O77wSYV-J1LKsnKLUGABmXXMUCjQ-csGFJJnnuS61PM8XJ-gEz76LJoi39icoo6xYjhKaIEJXE75nw_boRJSYzQZBqOVOn8' },
  { name: 'Nordic Chrono', sales: '31 sales today', price: '$285', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUZKhwwkUHRljdBMqEMe65ij4e9byD07jLxUj5hBTCuAYSRdpX5-wW1gbWJ1ymAHRtL7WPIBDbb0idTbYMh41tACTAl8LppW3kHQuF3D1K9fPma-IVEf_qoRIATMscmAgUulgh-exes42VRsrwk1YWmzSMddIUdSnQ1iLMqhHAjrcMc-nzZG1KUH5L7e3GOJOF1o1elPyss2CTT8ZG5refOcxiDX202NQkVCWIzSLAUD9ugYJUuMrh4u42FDsWD1lEAnaKaWHCxQU' },
  { name: 'Acoustic Pro Gen 2', sales: '28 sales today', price: '$199', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2K4roA2LkeHRnL8EACn2ISvCKCf1LGtV9UeG8veHY-PU-hqOY82oTa9JcLJ2Atl-ePqGji-d1Q2ar6t1GE1gTBhLzZ8xYYquRnBLOn38OVfa9PFwkP8O4Lqi3ci4yokQXuMZ95IWSsqfYTAnkpl5blSudJ2VyOxaVY28xJ79QVO2Q1a5VXA7w59gsKhiIMWg4cca7zmJMlmeeQARdY9Z9gGwlNiRaHU8v2eKGVjudG8GQATI1VxWMhhowfOdzSgVsbnMypupL99w' },
];
