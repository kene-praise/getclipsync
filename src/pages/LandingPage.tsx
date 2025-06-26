import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Zap, Shield, Globe, Clock, Users } from 'lucide-react';
import QuickShareForm from '@/components/QuickShareForm';
const LandingPage = () => {
  return <div className="min-h-screen bg-background">
      <UnifiedHeader />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center space-y-8 py-20">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              Sync Your Clipboard
              <span className="text-primary block">Across All Devices</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Seamlessly share text and files between your devices. 
Free, secure, and privacy-focused.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/auth">Get started for free 🚀</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8" asChild>
              <Link to="#features">Learn More</Link>
            </Button>
          </div>
        </section>

        {/* Quick Share Section */}
        <section className="py-12">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold">Try It Now</h2>
            <p className="text-muted-foreground">
              Share content instantly without creating an account
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <QuickShareForm />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Why Choose ClipSync?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with privacy and simplicity in mind, ClipSync makes cross-device sharing effortless.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  Instant Sync
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Copy on one device, paste on another. Your clipboard syncs instantly across all your devices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacy First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  End-to-end encryption ensures your data stays private. Auto-deletion keeps your information secure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Completely Free
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No subscriptions, no hidden fees. ClipSync is free for everyone, forever.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Universal Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Works on any device with a web browser. No app downloads required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Quick Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Share content instantly with generated codes. Perfect for temporary sharing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Easy to Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simple, intuitive interface. Start syncing in seconds, no technical knowledge required.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Ready to Start Syncing?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Be among the first 1,000 users who trust ClipSync for secure, instant cross-device sharing. 👩‍💻👨‍💻</p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/auth">Sign up for free</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default LandingPage;