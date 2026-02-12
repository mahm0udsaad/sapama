'use client'

import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-[#14215B] text-white pt-16 md:pt-24 pb-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, #7DB7D4 0, transparent 25%)' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white text-lg font-bold">M</span>
              </div>
              <span className="text-3xl font-bold tracking-tight">مادمـاك ميديكال</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-8 text-lg">
              متخصصون في توفير الأدوات والمعدات الطبية وكذلك الأجهزة والمستلزمات الرياضية لمختلف القطاعات.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 bg-gray-800 hover:bg-primary rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-xl font-bold mb-8 relative inline-block">
              الروابط السريعة
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {['الخدمات', 'عن مادمـاك', 'تواصل معنا', 'سياسة الخصوصية', 'شروط الخدمة'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-primary transition flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-bold mb-8 relative inline-block">
              الخدمات
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-accent rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {['أجهزة العلاج الطبيعي', 'معدات التأهيل', 'الصيانة والدعم الفني', 'التشاور والتخطيط', 'التدريب والدعم'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-accent transition flex items-center gap-2 group">
                     <span className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-xl font-bold mb-8 relative inline-block">
              تواصل معنا
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">رقم الموحد</p>
                  <p className="text-white font-bold text-lg ltr:text-left" dir="ltr">800 128 0001</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">البريد الإلكتروني</p>
                  <p className="text-white font-bold break-all">admin@spama.sa</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">الموقع</p>
                  <p className="text-white font-bold">جدة، المملكة العربية السعودية</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div 
          className="border-t border-gray-800 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-right">
              © جميع الحقوق محفوظة لدى مادمـاك ميديكال 2026
            </p>
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-primary transition">
                سياسة الخصوصية
              </a>
              <a href="#" className="hover:text-primary transition">
                شروط الاستخدام
              </a>
              <a href="#" className="hover:text-primary transition">
                خريطة الموقع
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating WhatsApp Button */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-8 right-8 flex gap-3 z-40"
      >
        <button className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full p-4 shadow-2xl transition duration-300 transform hover:scale-110 hover:rotate-12 ring-4 ring-white/20">
          <FaWhatsapp size={32} aria-label="WhatsApp" />
        </button>
      </motion.div>
    </footer>
  )
}
