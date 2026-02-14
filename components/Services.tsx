'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Zap, Package, Dumbbell, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const services = [
  {
    id: 1,
    title: 'أجهزة العلاج الطبيعي',
    description: 'نوفر أحدث التقنيات في أجهزة العلاج الطبيعي، بما في ذلك أجهزة العلاج الكهربائي، الليزر، والموجات التصادمية، لضمان أفضل نتائج علاجية للمرضى.',
    image: '/service-devices.jpg',
    icon: Zap,
    color: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary'
  },
  {
    id: 2,
    title: 'معدات التأهيل الحركي',
    description: 'تشكيلة واسعة من معدات التأهيل الحركي المصممة لتعزيز القدرة الحركية، تشمل المتوازيات، السلالم العلاجية، وطاولات التدريب المتخصصة.',
    image: '/IMG_7855.JPG',
    icon: Package,
    color: 'bg-accent',
    text: 'text-accent',
    border: 'border-accent'
  },
  {
    id: 3,
    title: 'الأدوات الرياضية والتمارين',
    description: 'مجموعة متكاملة من الأدوات الرياضية الخفيفة والأوزان والكرات العلاجية، مثالية لبرامج التقوية المنزلية وتجهيز الصالات الرياضية العلاجية.',
    image: '/service-sports.jpg',
    icon: Dumbbell,
    color: 'bg-yellow-400',
    text: 'text-yellow-400',
    border: 'border-yellow-400'
  },
]

export default function Services() {
  const [activeService, setActiveService] = useState(services[0])

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
            نجمع بين التقنية الحديثة والخبرة العملية لنقدم لك أفضل تجهيزات العلاج الطبيعي
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
                  onClick={() => setActiveService(service)}
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
                        <span>اكتشف المزيد</span>
                        <ArrowLeft size={16} className="mr-2 animate-pulse" />
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
