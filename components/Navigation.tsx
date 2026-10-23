'use client'

import { useState } from 'react'
import { ArrowUpLeft } from 'lucide-react'
import { storeUrl } from '@/lib/seo'

// Mirrors the header of the landing page (public/home.html).
const navLinks = [
  { name: 'الرئيسية', href: '/' },
  { name: 'خدماتنا', href: '/#services' },
  { name: 'شركاؤنا', href: '/#partners' },
  { name: 'المتجر والمنتجات', href: '/#store' },
  { name: 'لماذا مدماك؟', href: '/#why-madmak' },
  { name: 'الأسئلة الشائعة', href: '/#faq' },
  { name: 'المدونة', href: '/blog' },
  { name: 'تواصل معنا', href: '/#contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgb(21_55_99/7%)] bg-white/95 backdrop-blur-md shadow-[0_3px_16px_rgb(28_72_125/5%)]">
      <div className="mx-auto flex min-h-[76px] w-[min(1360px,88%)] items-center justify-between gap-8">
        <a href="/" aria-label="مدماك فيجن - الرئيسية" className="shrink-0">
          <img
            src="/assets/images/madmak-vision-logo-small.png"
            alt="مدماك فيجن"
            width={900}
            height={274}
            className="h-[52px] w-[170px] object-contain lg:h-[60px] lg:w-[190px]"
          />
        </a>

        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-[clamp(18px,2.4vw,32px)] lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group relative text-[13px] font-medium text-[#415b7c] transition-colors hover:text-[#2448b7]"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 origin-right scale-x-0 rounded bg-[#2448b7] transition-transform duration-200 group-hover:scale-x-100" />
            </a>
          ))}
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[39px] items-center gap-2 whitespace-nowrap rounded-full px-4 text-[12px] font-semibold text-white transition hover:-translate-y-0.5 bg-[linear-gradient(105deg,#5145bc_0%,#08bcae_100%)]"
          >
            زيارة المتجر
            <ArrowUpLeft size={16} />
          </a>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-[#e2e9f2] bg-white text-[#153763] lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'إغلاق قائمة التنقل' : 'فتح قائمة التنقل'}
          aria-expanded={isOpen}
          aria-controls="site-navigation-mobile"
        >
          <span className={`h-0.5 w-[19px] rounded bg-current transition-transform ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`h-0.5 w-[19px] rounded bg-current transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-[19px] rounded bg-current transition-transform ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <nav
          id="site-navigation-mobile"
          aria-label="التنقل الرئيسي"
          className="border-t border-[#e2e9f2] bg-white px-[6%] pb-5 pt-2 lg:hidden"
        >
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block border-b border-[#eef3f8] py-3 text-sm font-medium text-[#415b7c] hover:text-[#2448b7]"
            >
              {item.name}
            </a>
          ))}
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-full text-sm font-semibold text-white bg-[linear-gradient(105deg,#5145bc_0%,#08bcae_100%)]"
          >
            زيارة المتجر
            <ArrowUpLeft size={16} />
          </a>
        </nav>
      )}
    </header>
  )
}
