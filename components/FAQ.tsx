'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    id: 1,
    question: 'ما الخدمات التي تقدمونها لتجهيز مركز علاج طبيعي؟',
    answer:
      'نوفّر حلاً متكاملاً يشمل توريد وتركيب أجهزة العلاج الطبيعي الأساسية والمعتمدة، لتجهيز المركز للتشغيل الفوري.',
  },
  {
    id: 2,
    question: 'هل أجهزة العلاج الطبيعي التي توفرونها معتمدة رسميًا؟',
    answer:
      'نعم، جميع الأجهزة مسجّلة ومعتمدة لدى هيئة الغذاء والدواء السعودية (SFDA)، ومطابقة لاشتراطات الاستخدام المهني.',
  },
  {
    id: 3,
    question: 'هل يمكن تخصيص التجهيزات حسب نوعية المرضى وحجم المركز؟',
    answer:
      'نعم، يمكننا تخصيص باقة الأجهزة بناءً على نوع الحالات المستهدفة (تأهيل عظام، رياضيين، كبار سن...) وكذلك حسب المساحة المتوفرة والميزانية.',
  },
  {
    id: 4,
    question: 'كم تستغرق مدة تجهيز مركز العلاج الطبيعي؟',
    answer:
      'مدة التنفيذ تعتمد على حجم الطلب والموقع، وتتراوح غالبًا من 7 إلى 21 يوم عمل داخل المملكة.',
  },
  {
    id: 5,
    question: 'هل تقدمون خدمات الشحن والتركيب داخل السعودية؟',
    answer:
      'نعم، نوفر شحن الأجهزة وتركيبها في جميع مدن المملكة، ضمن التجهيز الكامل أو عند الشراء المنفصل.',
  },
  {
    id: 6,
    question: 'هل تشمل أجهزة العلاج الطبيعي ضمانًا؟',
    answer:
      'جميع الأجهزة تشمل ضمانًا لمدة تصل إلى 24 شهرًا، مع توفر دعم فني وخدمة ما بعد البيع حسب سياسة الضمان.',
  },
  {
    id: 7,
    question: 'هل يشمل العرض تدريبًا على استخدام الأجهزة؟',
    answer:
      'نقدّم كتيّبات ودليل استخدام واضح لكل جهاز، كما يمكن ترتيب جلسة تعريفية عن بُعد عند الحاجة.',
  },
  {
    id: 8,
    question: 'هل تتوفر الأجهزة مباشرة أم تحتاج إلى طلب مسبق؟',
    answer:
      'الأجهزة الشائعة متوفرة في المخزون للتسليم السريع، أما الأجهزة المتخصصة فقد تحتاج إلى طلب مسبق خلال فترة محددة.',
  },
  {
    id: 9,
    question: 'هل يمكن للمرضى وكبار السن شراء أجهزة العلاج الطبيعي لاستخدام منزلي؟',
    answer:
      'نعم، نوفر خيارات مخصصة للمرضى وكبار السن تساعدهم على استكمال جلسات التأهيل في المنزل بسهولة وأمان.',
  },
  {
    id: 10,
    question: 'ما أنواع أجهزة التأهيل التي يمكن شراؤها للاستخدام المنزلي؟',
    answer:
      'نوفر أجهزة تمرين وتأهيل منزلي، مثل أدوات الحركة والتمارين والموازنة، المصممة خصيصًا لدعم برامج العلاج الطبيعي في المنزل.',
  },
]

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary font-semibold tracking-wide uppercase mb-2 block">الأسئلة الشائعة</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">كل ما تود معرفته</h2>
          <p className="text-xl text-muted-foreground">
            إجابات على أهم الأسئلة حول خدماتنا وتجهيزاتنا
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className={`w-full px-6 py-5 flex items-center justify-between text-right transition-colors ${
                  openId === faq.id ? 'bg-primary/5' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <h3 className={`text-lg font-semibold transition-colors ${
                  openId === faq.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {faq.question}
                </h3>
                <ChevronDown
                  size={20}
                  className={`text-primary flex-shrink-0 ml-4 transition-transform duration-300 ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 py-5 bg-white border-t border-gray-100">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-muted-foreground mb-6">هل لديك سؤال آخر لم تجد إجابته؟</p>
          <a href="#contact" className="btn-primary inline-block">
            تواصل مع فريقنا
          </a>
        </motion.div>
      </div>
    </section>
  )
}
