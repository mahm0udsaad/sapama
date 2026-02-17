'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Baby, Blocks, ShieldCheck, Truck, Wrench, GraduationCap } from 'lucide-react'

const careTracks = [
  'غرف التخاطب والنطق',
  'غرف العلاج الوظيفي',
  'غرف التكامل الحسي',
  'غرف العلاج النفسي وتعديل السلوك',
  'غرف العلاج الطبيعي للأطفال',
  'أركان التدخل المبكر'
]

const productGroups = [
  'أجهزة وأدوات جلسات التخاطب',
  'ألعاب تعليمية وتفاعلية آمنة',
  'أثاث وتجهيزات مراكز الرعاية النهارية',
  'أدوات تقييم وتشخيص ومتابعة',
  'مستلزمات برامج الدمج والتأهيل'
]

const supportServices = [
  { title: 'التوريد والشحن', icon: Truck },
  { title: 'التركيب والتشغيل', icon: Wrench },
  { title: 'التدريب على الاستخدام', icon: GraduationCap },
  { title: 'الضمان والدعم الفني', icon: ShieldCheck }
]

export default function DaycareSection() {
  return (
    <section id="daycare" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#14215B 1px, transparent 1px)', backgroundSize: '28px 28px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-4 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Baby size={16} />
              خدمة متخصصة
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
              خدمات الرعاية النهارية
              <br />
              <span className="text-primary">تجهيزات متكاملة للأطفال ومراكز الرعاية</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              نقدم حلول رعاية نهارية متكاملة تشمل التخطيط والتجهيز وتوريد المنتجات والأجهزة المناسبة لبرامج التأهيل والتطوير اليومي داخل المركز.
            </p>
            <a href="#contact" className="btn-primary inline-block">
              اطلب تجهيز مركز رعاية نهارية
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative h-72 md:h-96 rounded-3xl overflow-hidden border-4 border-primary/10 shadow-2xl"
          >
            <Image
              src="/first-prompt.png"
              alt="تجهيزات الرعاية النهارية"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl p-7 border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Baby className="text-primary" />
              مسارات التجهيز
            </h3>
            <ul className="space-y-3">
              {careTracks.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 rounded-3xl p-7 border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Blocks className="text-accent" />
              المنتجات والأجهزة
            </h3>
            <ul className="space-y-3">
              {productGroups.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-2 w-2 h-2 rounded-full bg-accent flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {supportServices.map((service) => {
            const Icon = service.icon
            return (
              <div key={service.title} className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center">
                <Icon className="mx-auto text-primary mb-2" size={22} />
                <p className="text-sm md:text-base font-semibold text-gray-800">{service.title}</p>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
