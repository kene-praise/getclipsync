import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import BlueGlowBackground from '@/components/BlueGlowBackground';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Zap, Shield, Globe, Clock, Users } from 'lucide-react';
import QuickShareTabs from '@/components/QuickShareTabs';
import { useResponsive } from '@/hooks/useResponsive';
import { Helmet } from 'react-helmet-async';

const LandingPage = () => {
  const { isMobile, isTablet, isWeb } = useResponsive();
  
  const getContainerPadding = () => {
    if (isMobile) return 'px-4';
    if (isTablet) return 'px-10';
    return 'px-16';
  };
  
  const getMainPadding = () => {
    if (isMobile) return 'py-6 px-4';
    if (isTablet) return 'py-8 px-10';
    return 'py-12 px-16';
  };

  return (
    <>
      <Helmet>
        <title>ClipSync - Transfer Text from Phone to PC | Sync Clipboard Between Devices</title>
        <meta name="description" content="Transfer text from phone to PC instantly. Sync clipboard between Android, iPhone, Windows, Mac. Copy text from PC to phone. Free cross-device clipboard synchronization." />
        <meta name="keywords" content="transfer text to PC, transfer text from phone to PC, sync clipboard, copy text from PC to phone, transfer text from Android to Mac, transfer text from iPhone to Windows laptop, clipboard sync, cross device clipboard, sync text between devices, share text between phone and computer, mobile to desktop transfer, phone to laptop text transfer, wireless clipboard, universal clipboard, multi device clipboard" />
        <link rel="canonical" href="https://clipsync.app/" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://clipsync.app/" />
        <meta property="og:title" content="ClipSync - Transfer Text from Phone to PC | Sync Clipboard Between Devices" />
        <meta property="og:description" content="Transfer text from phone to PC instantly. Sync clipboard between Android, iPhone, Windows, Mac. Free cross-device clipboard synchronization." />
        <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://clipsync.app/" />
        <meta property="twitter:title" content="ClipSync - Transfer Text from Phone to PC | Sync Clipboard Between Devices" />
        <meta property="twitter:description" content="Transfer text from phone to PC instantly. Sync clipboard between Android, iPhone, Windows, Mac. Free cross-device clipboard synchronization." />
        <meta property="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ClipSync",
            "description": "Transfer text from phone to PC instantly. Sync clipboard between Android, iPhone, Windows, Mac.",
            "url": "https://clipsync.app",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Web Browser, Android, iOS, Windows, Mac",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "ClipSync"
            }
          })}
        </script>
      </Helmet>
      
      <div className={`min-h-screen bg-transparent ${getContainerPadding()}`}>
        <UnifiedHeader />
      
      <main className={`container mx-auto ${getMainPadding()}`}>
        {/* Hero Section */}
        <section className={`${isMobile ? 'py-6' : isTablet ? 'py-10' : 'py-16 lg:py-20'} relative rounded-3xl`}>
          <BlueGlowBackground />
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left space-y-6 md:space-y-8">
              <div className="space-y-4">
                <h1 className={`font-bold tracking-tight animate-fade-in ${
                  isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
                }`}>
                  Sync Your Clipboard
                  <span className="text-primary block">Across All Devices</span>
                </h1>
                <p className={`text-muted-foreground max-w-2xl lg:max-w-none leading-relaxed ${
                  isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-base sm:text-lg md:text-xl'
                }`}>
                  Get free, secure, and privacy-focused cross-device clipboard synchronization. 
                  Transfer text from phone to PC, sync clipboard between Android, iPhone, Windows, Mac.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size={isMobile ? "default" : "lg"} className={`w-full sm:w-auto animate-fade-in ${
                  isMobile ? 'text-sm px-4' : 'text-base md:text-lg px-6 md:px-8'
                }`}>
                  <Link to="/auth">Get started for free 🚀</Link>
                </Button>
              </div>
            </div>

            {/* Quick Share Tabs */}
            <div className="w-full max-w-md mx-auto lg:max-w-none">
              <QuickShareTabs />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={`${isMobile ? 'py-8' : isTablet ? 'py-12' : 'py-12 md:py-20'}`}>
          <div className="text-center space-y-4 mb-8 md:mb-12">
            <h2 className={`font-bold ${
              isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl md:text-3xl'
            }`}>
              Why Choose ClipSync?
            </h2>
            <p className={`text-muted-foreground max-w-2xl mx-auto ${
              isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm md:text-base'
            }`}>
              Built with privacy and simplicity in mind, ClipSync makes cross-device sharing effortless.
              Transfer text from phone to PC, copy text from PC to phone, and sync your clipboard universally.
            </p>
          </div>
          
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[{
              icon: Share2,
              title: "Instant Sync",
              description: "Copy on one device, paste on another. Transfer text from Android to Mac, iPhone to Windows laptop instantly."
            }, {
              icon: Shield,
              title: "Privacy First",
              description: "End-to-end encryption ensures your data stays private. Auto-deletion keeps your clipboard sync secure."
            }, {
              icon: Zap,
              title: "Completely Free",
              description: "No subscriptions, no hidden fees. Universal clipboard synchronization is free for everyone, forever."
            }, {
              icon: Globe,
              title: "Universal Access",
              description: "Works on any device with a web browser. Transfer text between phone and computer without app downloads."
            }, {
              icon: Clock,
              title: "Quick Sharing",
              description: "Share content instantly with generated codes. Perfect for temporary multi-device clipboard sharing."
            }, {
              icon: Users,
              title: "Easy to Use",
              description: "Simple, intuitive interface. Start syncing clipboard between devices in seconds, no technical knowledge required."
            }].map((feature, index) => (
              <Card key={feature.title} className="hover-scale animate-fade-in" style={{
                animationDelay: `${index * 0.1}s`
              }}>
                <CardHeader className={isMobile ? "p-3" : isTablet ? "p-4" : "p-6"}>
                  <CardTitle className={`flex items-center gap-2 ${
                    isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-base md:text-lg'
                  }`}>
                    <feature.icon className={`text-primary ${
                      isMobile ? 'h-4 w-4' : 'h-4 w-4 md:h-5 md:w-5'
                    }`} />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className={isMobile ? "p-3 pt-0" : isTablet ? "p-4 pt-0" : "p-6 pt-0"}>
                  <p className={`text-muted-foreground ${
                    isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm md:text-base'
                  }`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={`${isMobile ? 'py-8' : isTablet ? 'py-12' : 'py-12 md:py-20'} text-center`}>
          <div className="space-y-4 md:space-y-6">
            <h2 className={`font-bold ${
              isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl md:text-3xl'
            }`}>
              Ready to Start Syncing?
            </h2>
            <p className={`text-muted-foreground max-w-md mx-auto ${
              isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm md:text-base'
            }`}>
              Save your place among the first 1,000 users 👩‍💻👨‍💻 who trust ClipSync for secure, 
              instant cross-device clipboard synchronization.
            </p>
            <Button asChild size={isMobile ? "default" : "lg"} className={`w-full sm:w-auto ${
              isMobile ? 'text-sm px-4' : 'text-base md:text-lg px-6 md:px-8'
            }`}>
              <Link to="/auth">Sign up for free</Link>
            </Button>
          </div>
        </section>
      </main>
      
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
