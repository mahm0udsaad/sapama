'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Mail, Phone, MapPin, Send, User, MessageSquare, Map, ArrowUpLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa6'
import { contactInfo } from '@/lib/seo'

const regions = [
  'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'القصيم', 'المنطقة الشرقية',
  'عسير', 'تبوك', 'حائل', 'الحدود الشمالية', 'جازان',
  'نجران', 'الباحة', 'الجوف',
]

const projectWorks = [
  { src: '/images/home/project-work-01.webp', alt: 'منطقة علاج وتأهيل مجهزة بأدوات التمارين والتعليق الحركي', caption: 'تجهيز منطقة العلاج والتأهيل' },
  { src: '/images/home/project-work-02.webp', alt: 'غرفة تأهيل نهاري بأرضية ملونة وأجهزة تمارين وأنشطة حركية', caption: 'مساحة الرعاية والتأهيل النهاري' },
  { src: '/images/home/project-work-03.webp', alt: 'مركز علاج طبيعي مجهز بأجهزة التمارين ومسارات التدريب على المشي', caption: 'تجهيز مركز العلاج الطبيعي' },
  { src: '/images/home/project-work-04.webp', alt: 'قاعة علاج وتأهيل واسعة مجهزة بأجهزة تمارين ومعدات إعادة التأهيل', caption: 'قاعة متكاملة للعلاج والتأهيل' },
  { src: '/images/home/project-work-05.webp', alt: 'مركز علاج طبيعي واسع مجهز بأجهزة تمارين وطاولات علاجية وحصائر', caption: 'تجهيز مركز علاج طبيعي' },
  { src: '/images/home/project-work-06.webp', alt: 'غرفة علاج طبيعي تضم طاولة علاج زرقاء وأجهزة ومستلزمات التأهيل', caption: 'غرفة العلاج الطبيعي' },
  { src: '/images/home/project-work-07.webp', alt: 'مسارات تدريب على المشي وسلالم تأهيل خشبية داخل مركز علاجي', caption: 'تجهيز مسارات التأهيل الحركي' },
]

const inputClass =
  'w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder-gray-400'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    region: '',
    message: '',
  })
  // Hidden field that only bots fill in.
  const [website, setWebsite] = useState('')

  const [focus, setFocus] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [workIndex, setWorkIndex] = useState(0)

  const work = projectWorks[workIndex]
  const showWork = (index: number) => setWorkIndex((index + projectWorks.length) % projectWorks.length)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (website) return
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send')
      }

      setFormData({
        name: '',
        phone: '',
        email: '',
        region: '',
        message: '',
      })
      setSubmitMessage({ type: 'success', text: 'تم إرسال طلبك بنجاح. سيتم التواصل معك قريباً.' })
    } catch {
      setSubmitMessage({ type: 'error', text: 'تعذر إرسال الطلب حالياً. حاول مرة أخرى خلال دقائق.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactLinks = [
    { label: 'تواصل عبر واتساب', value: 'ابدأ محادثة مع الفريق', href: contactInfo.whatsappUrl, Icon: FaWhatsapp, external: true, ltr: false },
    { label: 'اتصل بنا', value: contactInfo.phoneDisplay, href: `tel:${contactInfo.phoneIntl}`, Icon: Phone, external: false, ltr: true },
    { label: 'راسلنا', value: contactInfo.email, href: `mailto:${contactInfo.email}`, Icon: Mail, external: false, ltr: true },
  ]

  return (
    <section id="contact" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-12"
        >

          {/* Contact Info Panel (Side) */}
          <div className="bg-primary lg:col-span-2 xl:col-span-4 p-8 lg:p-10 text-white relative overflow-hidden flex flex-col">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/30 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <p className="text-white/80 font-semibold text-sm mb-3">تواصل معنا</p>
              <h2 className="text-3xl font-bold mb-4">فريقنا جاهز لمساعدتك</h2>
              <p className="text-white/90 text-lg leading-relaxed mb-10">
                شاركنا تفاصيل طلبك أو تواصل معنا مباشرة لمناقشة خيارات التجهيز.
              </p>

              <div className="space-y-4">
                {contactLinks.map(({ label, value, href, Icon, external, ltr }) => (
                  <a
                    key={label}
                    href={href}
                    {...(external && { target: '_blank', rel: 'noreferrer' })}
                    className="flex items-center gap-3 group rounded-2xl border border-white/20 bg-white/5 hover:bg-white/15 p-3 transition-colors"
                  >
                    <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-colors flex-shrink-0">
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white/70 text-sm mb-1">{label}</p>
                      <p className="font-bold text-sm sm:text-[15px] break-all" {...(ltr && { dir: 'ltr', style: { textAlign: 'right' as const } })}>
                        {value}
                      </p>
                    </div>
                    <ArrowUpLeft size={18} className="text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>

              <p className="flex items-center gap-3 mt-8 text-white/90 font-semibold">
                <MapPin size={20} />
                {contactInfo.city}، {contactInfo.district}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3 xl:col-span-5 p-8 lg:p-10 bg-white">
            <div className="mb-8">
              <p className="text-primary font-semibold text-sm mb-2">ابدأ مشروعك</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">اطلب عرض سعر</h3>
              <p className="text-gray-500 text-sm">
                الحقول المميزة بـ <span className="text-red-600">*</span> مطلوبة
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group relative">
                  <label htmlFor="contact-name" className="sr-only">الاسم الكامل</label>
                  <div className={`absolute left-4 top-3.5 transition-colors ${focus === 'name' ? 'text-primary' : 'text-gray-400'}`}>
                    <User size={20} />
                  </div>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="الاسم الكامل *"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocus('name')}
                    onBlur={() => setFocus(null)}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="group relative">
                  <label htmlFor="contact-phone" className="sr-only">رقم الهاتف</label>
                  <div className={`absolute left-4 top-3.5 transition-colors ${focus === 'phone' ? 'text-primary' : 'text-gray-400'}`}>
                    <Phone size={20} />
                  </div>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="رقم الهاتف *"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocus('phone')}
                    onBlur={() => setFocus(null)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group relative">
                  <label htmlFor="contact-email" className="sr-only">البريد الإلكتروني</label>
                  <div className={`absolute left-4 top-3.5 transition-colors ${focus === 'email' ? 'text-primary' : 'text-gray-400'}`}>
                    <Mail size={20} />
                  </div>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="البريد الإلكتروني *"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocus('email')}
                    onBlur={() => setFocus(null)}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="group relative">
                  <label htmlFor="contact-region" className="sr-only">المنطقة</label>
                  <div className={`absolute left-4 top-3.5 transition-colors ${focus === 'region' ? 'text-primary' : 'text-gray-400'}`}>
                    <Map size={20} />
                  </div>
                  <select
                    id="contact-region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    onFocus={() => setFocus('region')}
                    onBlur={() => setFocus(null)}
                    className={`${inputClass} appearance-none`}
                    required
                  >
                    <option value="">اختر المنطقة *</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="group relative">
                <label htmlFor="contact-message" className="sr-only">تفاصيل الطلب</label>
                <div className={`absolute left-4 top-3.5 transition-colors ${focus === 'message' ? 'text-primary' : 'text-gray-400'}`}>
                  <MessageSquare size={20} />
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="تفاصيل الطلب *: ما نوع المنشأة أو التجهيزات التي تبحث عنها؟"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocus('message')}
                  onBlur={() => setFocus(null)}
                  rows={4}
                  minLength={10}
                  maxLength={3000}
                  className={`${inputClass} resize-none`}
                  required
                ></textarea>
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">اترك هذا الحقل فارغًا</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب عرض السعر'}</span>
                <Send size={20} />
              </button>

              {submitMessage && (
                <p role="status" className={`text-sm font-semibold ${submitMessage.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {submitMessage.text}
                </p>
              )}

              <p className="text-xs text-gray-500 leading-relaxed">
                لن تُحفظ بياناتك في هذا الموقع. عند إرسال النموذج، تُرسل البيانات إلى مزود الخدمة لمعالجة طلبك.
              </p>
            </form>
          </div>

          {/* Project Gallery */}
          <div
            className="relative lg:col-span-5 xl:col-span-3 min-h-[340px] xl:min-h-0"
            role="region"
            aria-label="معرض من أعمالنا"
            aria-roledescription="معرض صور"
          >
            <Image
              key={work.src}
              src={work.src}
              alt={work.alt}
              fill
              sizes="(min-width: 1280px) 25vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

            <button
              type="button"
              onClick={() => showWork(workIndex - 1)}
              aria-label="صورة العمل السابقة"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-lg transition"
            >
              <ChevronRight size={22} />
            </button>
            <button
              type="button"
              onClick={() => showWork(workIndex + 1)}
              aria-label="صورة العمل التالية"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-lg transition"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="absolute bottom-0 inset-x-0 p-6 text-white">
              <p className="text-lg font-bold mb-3" aria-live="polite">{work.caption}</p>
              <div className="flex items-center gap-2" aria-label="اختيار صورة عمل">
                {projectWorks.map((item, index) => (
                  <button
                    key={item.src}
                    type="button"
                    onClick={() => showWork(index)}
                    aria-label={`عرض صورة العمل: ${item.caption}`}
                    aria-current={index === workIndex}
                    className={`h-2 rounded-full transition-all ${index === workIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
