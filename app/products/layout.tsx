import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-background">
      <Navigation />
      {children}
      <Footer />
    </div>
  )
}
