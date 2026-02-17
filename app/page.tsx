'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import type { ServiceSection } from '@/components/Services'
import DaycareSection from '@/components/DaycareSection'
import Planning from '@/components/Planning'
import AdditionalServices from '@/components/AdditionalServices'
import ContactForm from '@/components/ContactForm'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  const [activeSection, setActiveSection] = useState<ServiceSection>('physio')

  return (
    <div className="w-full bg-background">
      <Navigation />
      <Hero />
      <Services activeSection={activeSection} onServiceSelect={setActiveSection} />
      <DaycareSection activeSection={activeSection} />
      <Planning />
      <AdditionalServices />
      <ContactForm />
      <FAQ />
      <Footer />
    </div>
  )
}
