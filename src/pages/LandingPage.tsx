import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import BlueGlowBackground from '@/components/BlueGlowBackground';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Zap, Shield, Globe, Clock, Users } from 'lucide-react';
import QuickShareTabs from '@/components/QuickShareTabs';
const LandingPage = () => {
  return <div className="min-h-screen bg-background px-4 md:px-10 lg:px-16">
      <UnifiedHeader />
      
      <main className="container mx-auto py-8 md:py-12">
        {/* Hero Section - Side by side on web */}
        <section className="py-12 md:py-16 lg:py-20 relative">
          <BlueGlowBackground />
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left space-y-6 md:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  Sync Your Clipboard
                  <span className="text-primary block">Across All Devices</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl lg:max-w-none">Get free, secure, and privacy-focused cross-device clipboard synchronization. Transfer text from phone to PC, sync clipboard between Android, iPhone, Windows, Mac. </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="text-base md:text-lg px-6 md:px-8">
                  <Link to="/auth">Get started for free 🚀</Link>
                </Button>
              </div>
            </div>

            {/* Quick Share Tabs */}
            <div className="w-full max-w-md mx-auto lg:max-w-none">
              <div className="text-center space-y-4 mb-6 lg:mb-8">
                
                
              </div>
              <QuickShareTabs />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-20">
          <div className="text-center space-y-4 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Why Choose ClipSync?</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Built with privacy and simplicity in mind, ClipSync makes cross-device sharing effortless.
              Transfer text from phone to PC, copy text from PC to phone, and sync your clipboard universally.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Share2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Instant Sync
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground">
                  Copy on one device, paste on another. Transfer text from Android to Mac, iPhone to Windows laptop instantly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Privacy First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground">
                  End-to-end encryption ensures your data stays private. Auto-deletion keeps your clipboard sync secure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Completely Free
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground">
                  No subscriptions, no hidden fees. Universal clipboard synchronization is free for everyone, forever.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Globe className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Universal Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground">
                  Works on any device with a web browser. Transfer text between phone and computer without app downloads.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Quick Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground">
                  Share content instantly with generated codes. Perfect for temporary multi-device clipboard sharing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Easy to Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground">
                  Simple, intuitive interface. Start syncing clipboard between devices in seconds, no technical knowledge required.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 text-center">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to Start Syncing?</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
              Be among the first 1,000 users who trust ClipSync for secure, instant cross-device clipboard synchronization. 👩‍💻👨‍💻
            </p>
            <Button asChild size="lg" className="text-base md:text-lg px-6 md:px-8">
              <Link to="/auth">Sign up for free</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default LandingPage;