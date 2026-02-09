'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Planning from '@/components/Planning'
import AdditionalServices from '@/components/AdditionalServices'
import Clients from '@/components/Clients'
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
      <Clients />
      <ContactForm />
      <FAQ />
      <Footer />
    </div>
  )
}
