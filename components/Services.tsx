'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { HeartPulse, Sun, Users, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export type ServiceSection = 'physio' | 'daycare' | 'senior'

const services = [
  {
    id: 1,
    section: 'physio' as ServiceSection,
    title: 'تجهيز مراكز علاج طبيعي',
    description: 'تجهيزات متكاملة للعلاج الطبيعي تشمل أجهزة العلاج الكهربائي والليزر، أدوات التأهيل الحركي، والمستلزمات اليومية للجلسات العلاجية.',
    image: '/IMG_7855.JPG',
    icon: HeartPulse,
    color: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary'
  },
  {
    id: 2,
    section: 'daycare' as ServiceSection,
    title: 'تجهيز مراكز الرعاية النهارية للأطفال',
    description: 'حلول عملية لمراكز الرعاية النهارية تشمل أسرة الرعاية، أدوات الحركة، مستلزمات السلامة،  المتابعة اليومية.',
    image: '/first-prompt.png',
    icon: Sun,
    color: 'bg-[#134da8]',
    text: 'text-[#134da8]',
    border: 'border-[#134da8]'
  },
  {
    id: 3,
    section: 'senior' as ServiceSection,
    title: 'مستلزمات رعاية كبار السن',
    description: 'منتجات داعمة لكبار السن مثل أجهزة الحركة المنزلية، أدوات التوازن، وسائل الأمان، ومستلزمات تساعد على استقلالية أكبر.',
    image: '/second-prompt.png',
    icon: Users,
    color: 'bg-[#6bc168]',
    text: 'text-[#6bc168]',
    border: 'border-[#6bc168]'
  },
]

type ServicesProps = {
  activeSection?: ServiceSection
  onServiceSelect?: (section: ServiceSection) => void
}

export default function Services({ activeSection, onServiceSelect }: ServicesProps) {
  const [activeService, setActiveService] = useState(
    services.find((service) => service.section === (activeSection ?? 'physio')) ?? services[0]
  )

  useEffect(() => {
    if (!activeSection) return
    const matched = services.find((service) => service.section === activeSection)
    if (matched) {
      setActiveService(matched)
    }
  }, [activeSection])

  return (
    <section id="services" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block"
          >
            حلول متكاملة
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            خدماتنا المتميزة
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            نوفر منتجات وأجهزة متخصصة تغطي احتياجات العلاج الطبيعي والرعاية النهارية ورعاية كبار السن
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Right Column: Service List */}
          <div className="space-y-4">
            {services.map((service) => {
              const isActive = activeService.id === service.id
              const Icon = service.icon
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: service.id * 0.1 }}
                  onClick={() => {
                    setActiveService(service)
                    if (service.section !== 'senior') {
                      onServiceSelect?.(service.section)
                    }
                  }}
                  className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 overflow-hidden ${
                    isActive 
                      ? `bg-white ${service.border} shadow-lg` 
                      : 'bg-white/50 border-transparent hover:bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                      isActive ? service.color : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Icon size={24} className={isActive ? 'text-white' : 'text-gray-500'} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                        isActive ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {service.title}
                      </h3>
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isActive ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {service.description}
                      </p>
                      
                      <div className={`mt-4 flex items-center text-sm font-semibold transition-all duration-300 ${
                        isActive ? service.text : 'text-transparent h-0 overflow-hidden'
                      }`}>
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeBar"
                      className={`absolute right-0 top-0 bottom-0 w-1.5 rounded-l-full ${service.color}`}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Left Column: Image Preview */}
          <div className={`relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 ${activeService.border} hidden lg:block`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={activeService.image || "/placeholder.svg"}
                  alt={activeService.title}
                  fill
                  className="object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${activeService.color} flex items-center justify-center`}>
                      <activeService.icon size={20} className="text-white" />
                    </div>
                    <span className="text-lg font-medium opacity-90">نظرة عامة</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-3">{activeService.title}</h3>
                  <p className="text-gray-200 text-lg leading-relaxed max-w-md">
                    {activeService.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

           {/* Mobile Image Fallback */}
           <div className="lg:hidden mt-8">
             <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={activeService.image || "/placeholder.svg"}
                  alt={activeService.title}
                  fill
                  className="object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h3 className="text-white text-xl font-bold">{activeService.title}</h3>
                 </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  )
}
