'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ClipboardCheck, PenTool, LayoutDashboard, Truck, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'تحليل الاحتياجات',
    description: 'دراسة متعمقة لمتطلبات المشروع، نوعية المرضى، والمساحة المتاحة لتقديم أفضل الحلول.',
    icon: ClipboardCheck,
  },
  {
    id: 2,
    title: 'التصميم والتخطيط',
    description: 'تصميم هندسي دقيق (2D/3D) لتوزيع الأجهزة والمساحات وفق اشتراطات وزارة الصحة.',
    icon: PenTool,
  },
  {
    id: 3,
    title: 'تجهيز البنية التحتية',
    description: 'تحديد نقاط الكهرباء، السباكة، ومتطلبات الشبكة لضمان تشغيل مثالي للمعدات.',
    icon: LayoutDashboard,
  },
  {
    id: 4,
    title: 'التوريد والتركيب',
    description: 'شحن آمن وتركيب احترافي للأجهزة بواسطة مهندسين معتمدين، مع اختبار الأداء.',
    icon: Truck,
  },
]

export default function Planning() {
  return (
    <section className="py-16 md:py-24 bg-[#0F172A] relative overflow-hidden text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Image 
              src="/ministry-of-health.png" 
              alt="وزارة الصحة" 
              width={180} 
              height={80} 
              className="mx-auto brightness-0 invert opacity-80"
            />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          >
            تخطيط وتجهيز مراكز العلاج الطبيعي تبعــاً لاشتراطات
            <br />
            <span className="text-primary">وزارة الصحـــة</span> في المملكة العربية السعودية
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto"
          >
            نحول رؤيتك إلى واقع ملموس من خلال منهجية عمل دقيقة تضمن لك مركزاً علاجياً متطوراً ومطابقاً لأعلى المعايير الرسمية في المملكة.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 hidden lg:block rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 -translate-y-1/2 hidden lg:block rounded-full opacity-30"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="relative group"
                >
                  {/* Step Card */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-primary/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col items-center text-center relative z-10">
                    
                    {/* Icon Circle */}
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 group-hover:border-primary group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center mb-6 transition-all duration-300 shadow-lg relative">
                      <Icon size={32} />
                      {/* Step Number Badge */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-800 text-gray-400 flex items-center justify-center text-sm font-bold shadow-sm group-hover:bg-white group-hover:text-primary transition-colors">
                        {index + 1}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-primary to-accent relative overflow-hidden text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8">
             <div className="text-right">
               <h3 className="text-2xl font-bold text-white mb-1">جاهز لبدء مشروعك؟</h3>
               <p className="text-white/90">احصل على استشارة أولية مجانية لتخطيط مركزك</p>
             </div>
             <button className="bg-white text-primary hover:bg-gray-50 font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
               تواصل مع خبرائنا الآن
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
