'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ClipboardCheck, PenTool, LayoutDashboard, Truck } from 'lucide-react'

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
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="p-8 rounded-3xl bg-gradient-to-r from-[#48ae57] to-[#a6e7b9] relative overflow-hidden text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8">
             <div className="text-right">
               <h3 className="text-2xl font-bold text-[#1d4b27] mb-1">جاهز لبدء مشروعك؟</h3>
               <p className="text-[#368541]">احصل على استشارة أولية مجانية لتخطيط مركزك</p>
             </div>
             <a
               href="#contact"
               className="bg-white text-gray-700 hover:bg-[#e6fcec] font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
             >
               تواصل مع خبرائنا الآن
             </a>
          </div>
        </motion.div>
  )
}
