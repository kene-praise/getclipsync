
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';

const PricingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4">
          <PricingSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
