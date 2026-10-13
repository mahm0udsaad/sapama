'use client'

import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  { id: 1, title: 'شاركنا احتياج منشأتك', description: 'حدد نوع المركز والمنطقة والتجهيزات المطلوبة.' },
  { id: 2, title: 'نتواصل لتوضيح التفاصيل', description: 'نراجع نوع المركز واحتياج المستفيدين.' },
  { id: 3, title: 'نراجع خيارات التجهيز', description: 'نناقش المنتجات المناسبة لاحتياج منشأتك.' },
  { id: 4, title: 'نعد عرض السعر', description: 'أرسل بيانات المشروع عبر النموذج للبدء.' },
]

export default function ProjectJourney() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10 bg-white"
          >
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
              من احتياجك إلى التجهيز
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">كيف نبدأ تجهيز منشأتك؟</h2>
            <p className="text-lg text-gray-600 mb-10">خطوات بسيطة تساعدنا على فهم طلبك ومراجعة التجهيزات المناسبة.</p>

            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map((step, index) => (
                <motion.li
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0">
                    0{step.id}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[340px] flex items-center"
          >
            <Image
              src="/images/home/independence-banner.webp"
              alt="شخص يستخدم كرسيًا متحركًا ويتأمل أفق مدينة الرياض عند الغروب، في صورة تعبر عن الاستقلالية والحركة"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent"></div>
            <div className="relative z-10 p-8 md:p-10 text-white max-w-md">
              <p className="text-white/80 font-semibold text-sm mb-3">رعاية تدعم الحركة</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">معًا نحو حياة أكثر استقلالية</h2>
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                نساعدك في استكشاف تجهيزات التأهيل المناسبة لاحتياج منشأتك.
              </p>
              <a href="#services" className="btn-primary inline-flex items-center gap-2 group">
                تعرّف على خدماتنا
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
