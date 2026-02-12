'use client'

import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Planning from '@/components/Planning'
import AdditionalServices from '@/components/AdditionalServices'
import ContactForm from '@/components/ContactForm'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="w-full bg-background">
      <Navigation />
      <Hero />
      <Services />
      <Planning />
      <AdditionalServices />
      <ContactForm />
      <FAQ />
      <Footer />
    </div>
  )
}
