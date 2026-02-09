'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Building2, Users, Trophy, Stethoscope } from 'lucide-react'

const clientLogos = [
  '/clients/data-src-desktop-1x.jpg',
  '/clients/data-src-desktop-1x (1).jpg',
  '/clients/data-src-desktop-1x (2).jpg',
  '/clients/data-src-desktop-1x (3).jpg',
  '/clients/data-src-desktop-1x (4).jpg',
  '/clients/data-src-desktop-1x (5).jpg',
  '/clients/data-src-desktop-1x (6).jpg',
  '/clients/data-src-desktop-1x (7).jpg',
  '/clients/data-src-desktop-1x (8).jpg',
  '/clients/data-src-desktop-1x (9).jpg',
  '/clients/data-src-desktop-1x.png',
]

export default function Clients() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">شركاء النجاح</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">من عملائنا</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نفخر بثقة أكبر المنشآت الطبية والمستشفيات في المملكة العربية السعودية
          </p>
        </motion.div>

        <div className="relative mt-12">
          {/* Gradient overlays for infinite scroll effect */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling container */}
          <div className="overflow-hidden flex relative" dir="ltr">
            <div className="flex gap-12 animate-scroll py-10 w-max hover:[animation-play-state:paused] items-center">
              {[...clientLogos, ...clientLogos, ...clientLogos, ...clientLogos].map((logo, index) => (
                <div
                  key={index}
                  className="relative h-24 w-48 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500 transform hover:scale-110 flex items-center justify-center flex-shrink-0"
                >
                  <Image
                    src={logo}
                    alt={`Client Logo ${index}`}
                    width={180}
                    height={80}
                    className="object-contain max-h-full max-w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative mt-32">
          {/* Decorative Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10 hidden md:block"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50+', label: 'مركز علاج', icon: Building2, color: 'text-primary', bg: 'bg-primary/5' },
              { value: '100+', label: 'مستشفى', icon: Stethoscope, color: 'text-accent', bg: 'bg-accent/5' },
              { value: '10K+', label: 'مريض سعيد', icon: Users, color: 'text-primary', bg: 'bg-primary/5' },
              { value: '15+', label: 'سنة خبرة', icon: Trophy, color: 'text-accent', bg: 'bg-accent/5' }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div 
                  key={index}
                  className="group relative bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className={stat.color} />
                  </div>
                  
                  <div className={`text-4xl md:text-5xl font-extrabold ${stat.color} mb-2 tracking-tight`}>
                    {stat.value}
                  </div>
                  <p className="text-gray-500 font-medium text-lg group-hover:text-gray-800 transition-colors">
                    {stat.label}
                  </p>
                  
                  {/* Bottom Gradient Bar */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${stat.color === 'text-primary' ? 'from-transparent via-primary to-transparent' : 'from-transparent via-accent to-transparent'} group-hover:w-1/2 transition-all duration-500 rounded-full opacity-0 group-hover:opacity-100`}></div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .animate-scroll {
            animation: scroll 60s linear infinite;
          }
        }
      `}</style>
    </section>
  )
}
