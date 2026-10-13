'use client'

import Image from 'next/image'
import { HeartPulse, Sun, Accessibility, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const services = [
  {
    id: 1,
    href: '/physiotherapy-center-setup',
    tag: 'علاج طبيعي وتأهيل',
    title: 'تجهيز مراكز العلاج الطبيعي',
    description: 'ناقش معدات الجلسات ومساحات الحركة والتأهيل، وتحقق من المواصفات والتوفر قبل الطلب.',
    linkLabel: 'تفاصيل تجهيز مراكز العلاج الطبيعي',
    image: '/images/home/physiotherapy-centre-card.webp',
    imageAlt: 'مركز علاج طبيعي حديث مجهز بطاولات علاج وأجهزة تمارين زرقاء',
    icon: HeartPulse,
    color: 'bg-primary',
    text: 'text-primary',
  },
  {
    id: 2,
    href: '/daycare-center-setup',
    tag: 'رعاية نهارية وتأهيل',
    title: 'تجهيز مراكز الرعاية النهارية',
    description: 'ناقش احتياجات غرف الأنشطة والحركة والتأهيل بحسب طبيعة المركز والمستفيدين.',
    linkLabel: 'تفاصيل تجهيز مراكز الرعاية النهارية',
    image: '/images/home/daycare-centre-card.webp',
    imageAlt: 'مساحة رعاية وتأهيل نهاري ملونة تضم أرجوحة علاجية ومكعبات وأنشطة حسية',
    icon: Sun,
    color: 'bg-[#134da8]',
    text: 'text-[#134da8]',
  },
  {
    id: 3,
    href: '/physiotherapy-equipment',
    tag: 'مرافق طبية وحركة',
    title: 'أدوات المساعدة على الحركة',
    description: 'استفسر عن تجهيز المرافق الطبية ومعدات التأهيل وأدوات الحركة المتاحة للمشروع.',
    linkLabel: 'تفاصيل تجهيز المرافق الطبية',
    image: '/images/home/mobility-aids-card.webp',
    imageAlt: 'كراسٍ متحركة وأدوات مساعدة على الحركة معروضة داخل مساحة طبية مشرقة',
    icon: Accessibility,
    color: 'bg-[#6bc168]',
    text: 'text-[#3f8f3c]',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
              رعاية متكاملة تبدأ من المساحة
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">خدماتنا في التجهيز والتأهيل</h2>
            <p className="text-xl text-gray-600">
              استكشف خدمات تجهيز مراكز العلاج الطبيعي والرعاية النهارية، وحلول المرافق الطبية وأدوات المساعدة على الحركة.
            </p>
          </motion.div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-opacity flex-shrink-0"
          >
            ناقش احتياج منشأتك
            <ArrowLeft size={18} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: service.id * 0.1, duration: 0.5 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div
                    className={`absolute bottom-4 right-4 w-12 h-12 rounded-xl ${service.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <span className={`text-sm font-semibold mb-2 ${service.text}`}>{service.tag}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                  <a
                    href={service.href}
                    className={`mt-auto inline-flex items-center gap-2 text-sm font-semibold ${service.text} hover:opacity-80 transition-opacity`}
                  >
                    {service.linkLabel}
                    <ArrowLeft size={16} />
                  </a>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
