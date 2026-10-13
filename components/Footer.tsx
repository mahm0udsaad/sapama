'use client'

import { Mail, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { FaInstagram, FaSnapchat, FaTiktok, FaXTwitter } from 'react-icons/fa6'
import { contactInfo, servicePages, socialLinks, storeUrl } from '@/lib/seo'

export default function Footer() {
  return (
    <footer className="bg-[#6bc168] text-white pt-16 md:pt-24 pb-12 relative overflow-hidden">
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
            <div className="flex items-center gap-2 mb-6 bg-white rounded-xl p-2">
              <img
                src="/images/logo.webp"
                alt="مدماك فيجن"
                width={158}
                height={48}
                loading="lazy"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-white leading-relaxed mb-8 text-lg">
              نوفر منتجات وأجهزة متخصصة في العلاج الطبيعي والرعاية النهارية ورعاية كبار السن داخل المملكة.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: FaTiktok, href: socialLinks.tiktok, label: 'TikTok' },
                { Icon: FaSnapchat, href: socialLinks.snapchat, label: 'Snapchat' },
                { Icon: FaXTwitter, href: socialLinks.x, label: 'X' },
                { Icon: FaInstagram, href: socialLinks.instagram, label: 'Instagram' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
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
              {[
                { name: 'المنتجات والأسعار', href: '/products' },
                { name: 'متجر مدماك فيجن', href: storeUrl },
                { name: 'الخدمات', href: '/#services' },
                { name: 'عن مدماك فيجن', href: '/#about' },
                { name: 'الأسئلة الشائعة', href: '/#faq' },
                { name: 'تواصل معنا', href: '/#contact' },
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-white hover:text-primary transition flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.name}
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
              {servicePages.map((page) => (
                <li key={page.slug}>
                  <a href={`/${page.slug}`} className="text-white hover:text-accent transition flex items-center gap-2 group">
                     <span className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {page.title}
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
                  <p className="text-white text-sm mb-1">رقم الجوال</p>
                  <a href={`tel:${contactInfo.phoneIntl}`} className="text-white font-bold text-lg ltr:text-left" dir="ltr">{contactInfo.phoneDisplay}</a>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-white text-sm mb-1">البريد الإلكتروني</p>
                  <a href={`mailto:${contactInfo.email}`} className="text-white font-bold break-all">{contactInfo.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-white text-sm mb-1">الموقع</p>
                  <address className="text-white font-bold not-italic">{contactInfo.city}، {contactInfo.district}</address>
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
            <p className="text-white text-sm text-center md:text-right">
              © جميع الحقوق محفوظة لدى مدماك فيجن 2026
            </p>
            <div className="flex gap-8 text-sm text-white">
              <a href={storeUrl} className="hover:text-primary transition">
                تسوق من المتجر
              </a>
              <a href="/sitemap.xml" className="hover:text-primary transition">
                خريطة الموقع
              </a>
            </div>
          </div>
        </motion.div>
      </div>

    </footer>
  )
}
