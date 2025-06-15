
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import QuickShareForm from '@/components/QuickShareForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Seamlessly Sync Your Clipboard</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Instantly share text, links, or files between devices with a simple code. No account needed for a quick share.
          </p>
        </section>

        <section className="mt-12 max-w-2xl mx-auto">
            <QuickShareForm />
        </section>

        <section className="mt-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Why Sign Up?</h2>
            <p className="mt-2 text-lg text-muted-foreground">Unlock powerful features by creating a free account.</p>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Sync History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Keep a complete history of all your synced clips, accessible from any device.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Auto-Sync</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Automatically sync your clipboard content when you focus on the app page.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> No Expiration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Your synced items are saved to your account and never expire.</p>
                    </CardContent>
                </Card>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
