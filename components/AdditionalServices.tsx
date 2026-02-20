'use client'

import { Hammer, Settings, Shield, Accessibility, ArrowUpLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const services = [
  {
    id: 1,
    title: 'تصنيع مستلزمات التأهيل',
    description: 'نمتلك ورشاً متخصصة لتصنيع الكراسي، أجهزة الوقوف، ومساند الأطراف بمواصفات عالمية تناسب احتياجات كل مريض.',
    icon: Hammer,
    color: 'bg-primary',
    text: 'text-primary'
  },
  {
    id: 2,
    title: 'الدعم الفني والصيانة',
    description: 'فريق هندسي متخصص لصيانة الأجهزة الطبية، توفير قطع الغيار، وعقود صيانة دورية لضمان استمرارية عمل مركزك.',
    icon: Settings,
    color: 'bg-accent',
    text: 'text-accent'
  },
  {
    id: 3,
    title: 'التعقيم ومكافحة العدوى',
    description: 'حلول متكاملة لتعقيم العيادات والأدوات، تشمل أجهزة التعقيم بالبخار ومواد التطهير المعتمدة من وزارة الصحة.',
    icon: Shield,
    color: 'bg-primary',
    text: 'text-primary'
  },
  {
    id: 4,
    title: 'تسهيل الوصول (Access)',
    description: 'تجهيز المداخل والممرات بالمنحدرات والدرابزين ومقابض الدعم لتسهيل حركة ذوي الاحتياجات الخاصة وكبار السن.',
    icon: Accessibility,
    color: 'bg-accent',
    text: 'text-accent'
  },
]

export default function AdditionalServices() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#7662AF 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block">قيمة مضافة</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">خدمات تتجاوز التوقعات</h2>
            <p className="text-xl text-gray-600">
              لا نكتفي بالتوريد، بل نقدم منظومة خدمات مساندة تضمن نجاح مشروعك واستدامته.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative bg-gray-50 rounded-[2rem] p-6 md:p-8 hover:bg-primary transition-colors duration-500 overflow-hidden"
              >
                {/* Background Pattern on Hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Number Indicator */}
                <span className="absolute top-8 left-8 text-6xl font-bold text-gray-200 group-hover:text-white/10 transition-colors duration-500 select-none">
                  0{service.id}
                </span>

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm transition-all duration-500 group-hover:bg-white/20 group-hover:backdrop-blur-sm ${service.color.replace('bg-', 'bg-').replace('primary', 'white').replace('accent', 'white')} bg-white`}>
                    <Icon size={28} className={`${service.text} group-hover:text-white transition-colors duration-500`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-white transition-colors duration-500">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-white/90 transition-colors duration-500">
                    {service.description}
                  </p>
                  
                  <div className="w-8 h-8 rounded-full border border-gray-300 group-hover:border-white/50 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-500">
                    <ArrowUpLeft size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
