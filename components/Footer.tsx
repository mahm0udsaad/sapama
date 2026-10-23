import { ArrowUp } from 'lucide-react'
import { contactInfo, storeUrl } from '@/lib/seo'

// Mirrors the footer of the landing page (public/home.html).
const quickLinks = [
  { name: 'خدماتنا', href: '/#services' },
  { name: 'تجهيز مراكز العلاج الطبيعي', href: '/physiotherapy-center-setup' },
  { name: 'تجهيز مراكز الرعاية النهارية', href: '/daycare-center-setup' },
  { name: 'تجهيز المرافق الطبية', href: '/physiotherapy-equipment' },
  { name: 'الأسئلة الشائعة', href: '/#faq' },
  { name: 'لماذا مدماك فيجن؟', href: '/#why-madmak' },
  { name: 'المتجر الرسمي', href: storeUrl, external: true },
  { name: 'اطلب عرض سعر', href: '/#contact' },
  { name: 'سياسة الخصوصية', href: '/privacy.html' },
  { name: 'المدونة', href: '/blog' },
]

const socialLinks = [
  { label: 'IG', name: 'إنستغرام', href: 'https://www.instagram.com/madmakvi/' },
  { label: 'X', name: 'إكس', href: 'https://x.com/madmakvi' },
  { label: 'TK', name: 'تيك توك', href: 'https://www.tiktok.com/@madmak_vi' },
  { label: 'SC', name: 'سناب شات', href: 'https://snapchat.com/t/7YWtIQ3X' },
]

const linkClass = 'text-[12px] text-white/75 transition-colors hover:text-[#7be0d1]'

export default function Footer() {
  return (
    <footer className="bg-[#092e50] text-white">
      <div className="mx-auto grid w-[min(1360px,88%)] grid-cols-2 gap-x-6 gap-y-8 pb-8 pt-10 md:grid-cols-[1.35fr_.75fr_1fr] md:gap-[78px] md:pb-[50px] md:pt-[62px]">
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-[22px] font-bold text-white">مدماك فيجن</h2>
          <p className="mt-4 max-w-[340px] text-[13px] leading-loose text-white/75">
            حلول تجهيز وتوريد لمراكز العلاج الطبيعي والرعاية النهارية والمرافق الطبية في المملكة العربية السعودية.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <h2 className="mb-2 text-sm font-bold text-white">روابط سريعة</h2>
          {quickLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={linkClass}
              {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-start gap-2">
          <h2 className="mb-2 text-sm font-bold text-white">تواصل معنا</h2>
          <a href={`tel:${contactInfo.phoneIntl}`} dir="ltr" className={linkClass}>
            {contactInfo.phoneDisplay}
          </a>
          <a href={`mailto:${contactInfo.email}`} className={linkClass}>
            {contactInfo.email}
          </a>
          <span className="text-[12px] text-white/75">
            {contactInfo.city}، {contactInfo.district}
          </span>
          <div className="mt-2 flex gap-2" aria-label="حسابات التواصل الاجتماعي">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/30 text-[9px] font-semibold text-white transition-colors hover:bg-[#0da990]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-[min(1360px,88%)] flex-col items-start gap-2 border-t border-white/20 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-[11px] text-white/70">© 2026 مدماك فيجن. جميع الحقوق محفوظة.</p>
        <a href="#top" className="inline-flex items-center gap-2 text-[11px] text-white/70 transition-colors hover:text-[#7be0d1]">
          العودة إلى الأعلى
          <ArrowUp size={14} />
        </a>
      </div>
    </footer>
  )
}
