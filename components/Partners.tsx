'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const partners = [
  { name: 'Chattanooga', alt: 'شعار Chattanooga، Moving Rehabilitation Forward', logo: '/images/partners/chattanooga.webp', width: 472, height: 238 },
  { name: 'FEI', alt: 'شعار FEI Fabrication Enterprises Inc.', logo: '/images/partners/fei.webp', width: 434, height: 334 },
  { name: 'Gymna', alt: 'شعار Gymna', logo: '/images/partners/gymna.webp', width: 480, height: 114 },
  { name: 'Chinesport', alt: 'شعار Chinesport Italia', logo: '/images/partners/chinesport.webp', width: 480, height: 261 },
  { name: 'Compex', alt: 'شعار Compex', logo: '/images/partners/compex.webp', width: 480, height: 96 },
  { name: 'EME', alt: 'شعار EME', logo: '/images/partners/eme.webp', width: 403, height: 316 },
  { name: 'Kinetec', alt: 'شعار Kinetec', logo: '/images/partners/kinetec.webp', width: 480, height: 322 },
  { name: 'BTL', alt: 'شعار BTL', logo: '/images/partners/btl.webp', width: 480, height: 254 },
]

export default function Partners() {
  return (
    <section id="partners" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">شراكات متخصصة</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">شركاؤنا</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            نفخر في مدماك فيجن ببناء شراكات مع علامات وشركات متخصصة في القطاع الطبي والتأهيلي، مما يساهم في تقديم حلول
            متطورة ومنتجات عالية الجودة تلبي احتياجات القطاع الصحي والرعاية والتأهيل.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="h-28 md:h-32 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center p-6"
            >
              <Image
                src={partner.logo}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                sizes="(min-width: 768px) 20vw, 40vw"
                className="max-h-full w-auto max-w-full object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
