'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-primary/10' : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary p-2 -mr-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Centered Logo for Mobile, Right for Desktop */}
          <div className="flex-1 md:flex-none text-center md:text-right">
            <a href="#" className="text-2xl font-bold text-primary flex items-center justify-center md:justify-end gap-2 group">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Spama Logo"
                  className="h-8 w-auto object-contain"
                  style={{ minWidth: 110 }}
                />
                {/* Optionally: add Arabic name if you want to keep the bilingual touch */}
                {/* <span className="text-foreground hidden md:inline">سباما</span> */}
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 ml-12">
            {[
              { name: 'خدماتنا', href: '#services' },
              { name: 'من نحن', href: '#about' },
              { name: 'طلب عرض سعر', href: '#contact' },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              اطلب الآن
            </motion.button>
          </div>

        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-4 bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-xl px-4">
                <a href="#services" className="block py-2 text-foreground hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
                  خدماتنا
                </a>
                <a href="#about" className="block py-2 text-foreground hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
                  من نحن
                </a>
                <a href="#contact" className="block py-2 text-foreground hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
                  طلب عرض سعر
                </a>
                <button className="btn-primary w-full mt-4">
                  اطلب الآن
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
