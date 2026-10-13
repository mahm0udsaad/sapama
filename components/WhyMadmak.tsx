'use client'

import Image from 'next/image'
import { Building2, ShoppingBag, MessagesSquare, PhoneCall, ArrowUpLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { categoryPath, storeCategories } from '@/lib/store-categories'

const reasons = [
  { id: 1, title: 'تجهيز للمراكز', description: 'للعلاج الطبيعي والتأهيل والرعاية', icon: Building2 },
  { id: 2, title: 'منتجات من المتجر', description: 'تصفح الفئات والمنتجات المنشورة وتحقق من التوفر', icon: ShoppingBag },
  { id: 3, title: 'نناقش احتياجك', description: 'لمراجعة احتياج المنشأة وخيارات التجهيز', icon: MessagesSquare },
  { id: 4, title: 'تواصل مباشر', description: 'عبر النموذج أو قنوات التواصل المتاحة', icon: PhoneCall },
]

export default function WhyMadmak() {
  return (
    <section id="why-madmak" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#7662AF 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block">
                نساند مشروعك بخيارات واضحة
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">لماذا مدماك فيجن؟</h2>
              <p className="text-xl text-gray-600">تجهيزات للرعاية والتأهيل، وتواصل مباشر لمناقشة احتياج منشأتك.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {reasons.map((reason, index) => {
                const Icon = reason.icon
                return (
                  <motion.div
                    key={reason.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group relative bg-white rounded-[2rem] p-6 hover:bg-primary transition-colors duration-500 overflow-hidden border border-gray-100"
                  >
                    <span className="absolute top-6 left-6 text-5xl font-bold text-gray-100 group-hover:text-white/10 transition-colors duration-500 select-none">
                      0{reason.id}
                    </span>
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors duration-500">
                        <Icon size={24} className="text-primary group-hover:text-white transition-colors duration-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2 transition-colors duration-500">
                        {reason.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors duration-500">
                        {reason.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <motion.div
            id="store"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[380px] flex items-end scroll-mt-28"
          >
            <Image
              src="/images/home/store-feature-background.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/30"></div>
            <div className="relative z-10 p-8 md:p-10 text-white">
              <span className="text-white/80 font-semibold text-sm mb-3 block">متجر مدماك فيجن</span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                تصفّح مستلزمات العلاج الطبيعي وأجهزة التأهيل
              </h3>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                انتقل مباشرة إلى فئة العلاج الطبيعي المنشورة في المتجر، وتحقق من مواصفات كل منتج وتوفره.
              </p>
              <a
                href={categoryPath(storeCategories.physiotherapy)}
                className="inline-flex items-center gap-2 bg-white text-primary font-bold py-3 px-8 rounded-xl hover:shadow-lg transition"
              >
                استكشف فئة العلاج الطبيعي
                <ArrowUpLeft size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
