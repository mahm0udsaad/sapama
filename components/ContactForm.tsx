'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, User, MessageSquare, Building2, Map } from 'lucide-react'
import { motion } from 'framer-motion'

const regions = [
  'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'القصيم', 'الدمام',
  'جدة', 'الإحساء', 'تبوك', 'الجوف', 'حائل',
  'الحدود الشمالية', 'جازان', 'نجران', 'الباحة', 'عسير',
]

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    region: '',
    message: '',
  })

  const [focus, setFocus] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

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
          className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row min-h-[600px]"
        >
          
          {/* Contact Info Panel (Side) */}
          <div className="bg-primary lg:w-2/5 p-10 lg:p-14 text-white relative overflow-hidden flex flex-col justify-between">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/30 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6">معلومات التواصل</h3>
              <p className="text-white/90 text-lg leading-relaxed mb-12">
                هل لديك استفسار أو ترغب في تجهيز مركزك؟ 
                <br />
                فريقنا متاح لمساعدتك وتقديم أفضل الحلول.
              </p>
              
              <div className="space-y-8">
                <a href="tel:8001280001" className="flex items-center gap-5 group transition-all hover:translate-x-2">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-colors">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">رقم الموحد</p>
                    <p className="text-xl font-bold font-mono tracking-wide">800 128 0001</p>
                  </div>
                </a>

                <a href="mailto:admin@spama.sa" className="flex items-center gap-5 group transition-all hover:translate-x-2">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-colors">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">البريد الإلكتروني</p>
                    <p className="text-xl font-bold">admin@spama.sa</p>
                  </div>
                </a>

                <div className="flex items-center gap-5 group transition-all hover:translate-x-2">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-colors">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">المركز الرئيسي</p>
                    <p className="text-xl font-bold">جدة، حي الشرفية</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 pt-8 border-t border-white/20">
               <p className="text-white/80 text-sm">
                 ساعات العمل: الأحد - الخميس 
                 <br />
                 9:00 صباحاً - 5:00 مساءً
               </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:w-3/5 p-10 lg:p-14 bg-white">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">اطلب عرض سعر</h2>
              <p className="text-gray-500">املأ النموذج أدناه وسيقوم فريق المبيعات بالتواصل معك فوراً</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group relative">
                  <div className={`absolute left-4 top-3.5 transition-colors ${focus === 'name' ? 'text-primary' : 'text-gray-400'}`}>
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="الاسم الكامل"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocus('name')}
                    onBlur={() => setFocus(null)}
                    className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="group relative">
                  <div className={`absolute left-4 top-3.5 transition-colors ${focus === 'phone' ? 'text-primary' : 'text-gray-400'}`}>
                    <Phone size={20} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="رقم الهاتف"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocus('phone')}
                    onBlur={() => setFocus(null)}
                    className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="group relative">
                <div className={`absolute left-4 top-3.5 transition-colors ${focus === 'email' ? 'text-primary' : 'text-gray-400'}`}>
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="البريد الإلكتروني"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocus('email')}
                  onBlur={() => setFocus(null)}
                  className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group relative">
                  <div className={`absolute left-4 top-3.5 transition-colors ${focus === 'city' ? 'text-primary' : 'text-gray-400'}`}>
                    <Building2 size={20} />
                  </div>
                  <input
                    type="text"
                    name="city"
                    placeholder="المدينة"
                    value={formData.city}
                    onChange={handleChange}
                    onFocus={() => setFocus('city')}
                    onBlur={() => setFocus(null)}
                    className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div className="group relative">
                   <div className={`absolute left-4 top-3.5 transition-colors ${focus === 'region' ? 'text-primary' : 'text-gray-400'}`}>
                    <Map size={20} />
                  </div>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    onFocus={() => setFocus('region')}
                    onBlur={() => setFocus(null)}
                    className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder-gray-400 appearance-none"
                    required
                  >
                    <option value="">اختر المنطقة</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="group relative">
                <div className={`absolute left-4 top-3.5 transition-colors ${focus === 'message' ? 'text-primary' : 'text-gray-400'}`}>
                  <MessageSquare size={20} />
                </div>
                <textarea
                  name="message"
                  placeholder="كيف يمكننا مساعدتك؟"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocus('message')}
                  onBlur={() => setFocus(null)}
                  rows={4}
                  className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-[#25A098] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <span>إرسال الطلب</span>
                <Send size={20} />
              </button>
            </form>
          </div>

        </motion.div>
      </div>
    </section>
  )
}