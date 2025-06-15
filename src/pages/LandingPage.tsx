
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import QuickShareForm from '@/components/QuickShareForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative text-center py-20 md:py-28 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] max-w-[1200px] h-[60%] z-0 bg-[radial-gradient(ellipse_at_bottom,theme(colors.glow/0.15),transparent_70%)]" />
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Seamlessly Sync Your Clipboard</h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Instantly share text, links, or files between devices with a simple code. No account needed for a quick share.
              </p>
            </div>
            
            <div className="mt-12 max-w-2xl mx-auto">
              <QuickShareForm />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-center">How It Works</h2>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                  <Card>
                      <CardHeader>
                          <CardTitle>Quick Share (No Account)</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                              <li>Paste any text or upload a file.</li>
                              <li>Click "Generate Share Link".</li>
                              <li>Share the generated code or link.</li>
                              <li>Content expires automatically in 24 hours.</li>
                          </ol>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader>
                          <CardTitle>Signed-in Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                              <li>Sign up for a free account.</li>
                              <li>Your clipboard history is saved securely.</li>
                              <li>Access your clips from any device.</li>
                              <li>Enable auto-sync to capture clipboard on the fly.</li>
                              <li>Your content never expires.</li>
                          </ol>
                      </CardContent>
                  </Card>
              </div>
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
