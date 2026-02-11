'use client'

import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

export default function Hero() {
  return (
    <section className="min-h-[90vh] bg-gradient-to-b from-secondary/50 to-background pt-12 pb-20 overflow-hidden relative">
      {/* Background Pattern - subtle geometric feel */}
      <div className="absolute inset-0 z-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#14215B 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Decorative circles - Refined */}
        <div className="absolute top-20 right-12 w-[30rem] h-[30rem] bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 left-12 w-[30rem] h-[30rem] bg-accent/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content - Right side on RTL */}
          <motion.div 
            className="flex flex-col justify-center order-2 md:order-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20">
                خدمات متخصصة وموثوقة
              </span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              سباما ميديكال
              <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-l from-primary to-primary/70">
                لتجهيزات مراكز العلاج
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
              نوفر كل ما يلزم أخصائي العلاج الطبيعي والمريض من مستلزمات العلاج الطبيعي للحصول على أفضل النتائج في جلسات العلاج سواء في مراكز الرعاية أو حتى في المنزل.
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-4 flex-wrap">
              <button className="btn-primary inline-flex items-center gap-2 group">
                اطلب الآن
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
              </button>
              <button className="btn-secondary">
                اعرف المزيد
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Image - Left side on RTL */}
          <motion.div 
            className="order-1 md:order-1 relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm">
              <Image
                src="/hero-physiotherapy.png"
                alt="جلسة علاج طبيعي احترافية"
                width={600}
                height={500}
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none mix-blend-overlay"></div>
            </div>
            
            {/* Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">جودة معتمدة</p>
                  <p className="text-xs text-gray-500">ضمان شامل</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {[
            { value: '50+', label: 'مركز علاج', color: 'text-primary' },
            { value: '1000+', label: 'جهاز متخصص', color: 'text-accent' },
            { value: '24/7', label: 'دعم فني', color: 'text-primary' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center shadow-lg border border-white/50 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
              <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
              <p className="text-muted-foreground font-medium text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
