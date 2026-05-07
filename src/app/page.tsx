import Hero from "./components/Hero";
import Header from "./components/Header";
import ScrollImmersion from "./components/ScrollImmersion";
import ScrollClient from "./components/ScrollClient";
import ScrollMerchant from "./components/ScrollMerchant";
import ScrollBusinesses from "./components/ScrollBusinesses";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <ScrollImmersion />
      <ScrollClient />
      <ScrollMerchant />
      <ScrollBusinesses />
      <CTASection />
      <Footer />
    </main>
  );
}
