'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Baby, Blocks, ShieldCheck, Truck, Wrench, GraduationCap } from 'lucide-react'
import type { ServiceSection } from '@/components/Services'

const supportServices = [
  { title: 'التوريد والشحن', icon: Truck },
  { title: 'التركيب والتشغيل', icon: Wrench },
  { title: 'التدريب على الاستخدام', icon: GraduationCap },
  { title: 'الضمان والدعم الفني', icon: ShieldCheck }
]

const sectionContent: Record<ServiceSection, {
  badge: string
  title: string
  subtitle: string
  description: string
  note: string
  cta: string
  image: string
  imageAlt: string
  tracks: string[]
  products: string[]
}> = {
  physio: {
    badge: 'تجهيز متخصص للمراكز',
    title: 'تجهيز مراكز علاج طبيعي',
    subtitle: 'حلول احترافية للمراكز والعيادات',
    description: 'تجهيزات متكاملة للعلاج الطبيعي تشمل أجهزة العلاج الكهربائي والليزر، أدوات التأهيل الحركي، والمستلزمات اليومية للجلسات العلاجية.',
    note: 'نقدم تجهيز المركز بدءاً من تحديد الاحتياج وحتى التوريد والتركيب والتشغيل.',
    cta: 'اطلب تجهيز مركز علاج طبيعي',
    image: '/IMG_7855.JPG',
    imageAlt: 'تجهيز مراكز علاج طبيعي',
    tracks: [
      'غرف العلاج الكهربائي',
      'غرف العلاج بالليزر',
      'قاعات التأهيل الحركي',
      'مناطق التمارين العلاجية',
      'نقاط التقييم والمتابعة'
    ],
    products: [
      'أجهزة التحفيز الكهربائي',
      'أجهزة الليزر العلاجي',
      'معدات التأهيل الحركي والتوازن',
      'طاولات وكراسي جلسات العلاج',
      'مستلزمات يومية لبرامج العلاج'
    ]
  },
  daycare: {
    badge: 'تجهيز متخصص للأطفال',
    title: 'تجهيز مراكز الرعاية النهارية للأطفال',
    subtitle: 'للأطفال ذوي الإعاقة والتدخل المبكر',
    description: 'نقدم تجهيزات متكاملة لمراكز الرعاية النهارية للأطفال تشمل التخطيط، التوريد، والتركيب لمسارات التخاطب والتكامل الحسي والعلاج الوظيفي والعلاج الطبيعي وفق متطلبات التشغيل المعتمدة.',
    note: 'نراعي في الحلول المعروضة اشتراطات وزارة الموارد البشرية والتنمية الاجتماعية الخاصة بمراكز الرعاية النهارية.',
    cta: 'اطلب تجهيز مركز رعاية نهارية للأطفال',
    image: '/children-care.png',
    imageAlt: 'تجهيزات الرعاية النهارية للأطفال',
    tracks: [
      'غرف التخاطب والنطق',
      'غرف العلاج الوظيفي',
      'غرف التكامل الحسي',
      'غرف العلاج الطبيعي',
      'أركان التدخل المبكر'
    ],
    products: [
      'أجهزة وأدوات جلسات التخاطب والتأهيل',
      'مستلزمات التكامل الحسي وتنمية المهارات',
      'ألعاب تعليمية آمنة مناسبة للأطفال',
      'تجهيزات الفصول والقاعات العلاجية',
      'وسائل تدريب ومتابعة للحالات'
    ]
  },
  senior: {
    badge: 'تجهيز متخصص لكبار السن',
    title: 'تجهيز مراكز رعاية كبار السن',
    subtitle: 'حلول مريحة وآمنة للرعاية اليومية',
    description: 'نوفر تجهيزات متكاملة لمراكز رعاية كبار السن تشمل أجهزة الحركة والمساعدة، تجهيزات السلامة، وأدوات المتابعة اليومية بما يدعم جودة الحياة والرعاية المستمرة.',
    note: 'نراعي سهولة الاستخدام وسلامة الحركة داخل المركز في كل تفاصيل التجهيز.',
    cta: 'اطلب تجهيز مركز رعاية كبار السن',
    image: '/second-prompt.png',
    imageAlt: 'تجهيز مراكز رعاية كبار السن',
    tracks: [
      'مناطق الحركة والدعم',
      'مساحات المتابعة اليومية',
      'غرف الرعاية والتمريض',
      'محطات التمارين الخفيفة',
      'نقاط الأمان والوقاية'
    ],
    products: [
      'أجهزة الحركة والمساعدة',
      'أدوات التوازن والتأهيل البسيط',
      'تجهيزات الأمان ومنع الانزلاق',
      'أسرة وكراسي رعاية متخصصة',
      'أجهزة المتابعة الأساسية'
    ]
  }
}

type DaycareSectionProps = {
  activeSection?: ServiceSection
}

export default function DaycareSection({ activeSection = 'daycare' }: DaycareSectionProps) {
  const content = sectionContent[activeSection]

  return (
    <section id="service-detail" className="py-16 md:py-24 bg-white relative overflow-hidden">
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
              {content.badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
              {content.title}
              <br />
              <span className="text-primary">{content.subtitle}</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {content.description}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {content.note}
            </p>
            <a href="#contact" className="btn-primary inline-block">
              {content.cta}
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
              src={content.image}
              alt={content.imageAlt}
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
              {content.tracks.map((item) => (
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
              {content.products.map((item) => (
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
