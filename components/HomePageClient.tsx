import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import Services from "@/components/Services"
import Partners from "@/components/Partners"
import WhyMadmak from "@/components/WhyMadmak"
import ProjectJourney from "@/components/ProjectJourney"
import FAQ from "@/components/FAQ"
import ContactForm from "@/components/ContactForm"
import Footer from "@/components/Footer"

export default function HomePageClient() {
  return (
    <div className="w-full bg-background">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Partners />
        <WhyMadmak />
        <ProjectJourney />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
