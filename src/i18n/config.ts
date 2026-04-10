import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      sidebar: {
        dashboard: "Dashboard",
        inventory: "Inventory",
        overview: "Overview",
        products: "Products",
        stock_receipt: "Stock Receipt",
        suppliers: "Suppliers",
        stock_areas: "Areas",
        pos: "POS",
        orders: "Orders",
        reports: "Reports",
        new_transaction: "New Transaction",
        settings: "Settings",
        logout: "Logout",
        premium_retail: "Premium Retail",
        store_manager: "Store Manager",
        guest: "Guest",
        viewer: "Viewer",
        profile: "My Profile",
        store_info: "Store Info",
        loyalty: "Loyalty Program"
      },
      profile: {
        title: "User Profile",
        personal_info: "Personal Information",
        security: "Security & Privacy",
        activity: "Recent Activity",
        preferences: "Preferences",
        save_success: "Profile updated successfully"
      },
      topbar: {
        search_placeholder: "Search inventory, orders, or customers...",
        switch_dark: "Switch to Dark Mode",
        switch_light: "Switch to Light Mode",
        toggle_sidebar: "Toggle Sidebar",
        switch_language: "Change Language"
      }
    }
  },
  th: {
    translation: {
      sidebar: {
        dashboard: "แผงควบคุม",
        inventory: "สินค้าคงคลัง",
        overview: "ภาพรวม",
        products: "สินค้า",
        stock_receipt: "รับเข้าสินค้า",
        suppliers: "ผู้จัดจำหน่าย",
        stock_areas: "พื้นที่จัดเก็บ",
        pos: "จุดขาย (POS)",
        orders: "คำสั่งซื้อ",
        reports: "รายงาน",
        new_transaction: "ธุรกรรมใหม่",
        settings: "การตั้งค่า",
        logout: "ออกจากระบบ",
        premium_retail: "พรีเมียม รีเทล",
        store_manager: "ผู้จัดการร้าน",
        guest: "บุคคลทั่วไป",
        viewer: "ผู้ชม",
        profile: "โปรไฟล์ของฉัน",
        store_info: "ข้อมูลร้านค้า",
        loyalty: "ระบบสะสมแต้ม"
      },
      profile: {
        title: "โปรไฟล์ผู้ใช้",
        personal_info: "ข้อมูลส่วนตัว",
        security: "ความปลอดภัยและความเป็นส่วนตัว",
        activity: "กิจกรรมล่าสุด",
        preferences: "การตั้งค่าส่วนตัว",
        save_success: "อัปเดตโปรไฟล์เรียบร้อยแล้ว"
      },
      topbar: {
        search_placeholder: "ค้นหาสินค้าคงคลัง คำสั่งซื้อ หรือลูกค้า...",
        switch_dark: "เปลี่ยนเป็นโหมดมืด",
        switch_light: "เปลี่ยนเป็นโหมดสว่าง",
        toggle_sidebar: "สลับแถบด้านข้าง",
        switch_language: "เปลี่ยนภาษา"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
