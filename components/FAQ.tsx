'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { homeFaqs } from '@/lib/seo'

const faqs = homeFaqs.map((faq, index) => ({ id: index + 1, ...faq }))

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-white">
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
                type="button"
                aria-expanded={openId === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
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

              {/* Answers stay in the DOM so search engines can read them. */}
              <div
                id={`faq-answer-${faq.id}`}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  openId === faq.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 py-5 bg-white border-t border-gray-100">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
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
          <a href="/#contact" className="btn-primary inline-block">
            تواصل مع فريقنا
          </a>
        </motion.div>
      </div>
    </section>
  )
}
