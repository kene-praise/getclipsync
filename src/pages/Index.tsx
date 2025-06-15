
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SendForm from '@/components/SendForm';
import ReceiveForm from '@/components/ReceiveForm';
import { ArrowLeftRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

type View = 'menu' | 'send' | 'receive';

const Index = () => {
  const [view, setView] = useState<View>('menu');
  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get('code');

  useEffect(() => {
    if (codeFromUrl && codeFromUrl.length === 6) {
      setView('receive');
    }
  }, [codeFromUrl]);

  const renderContent = () => {
    switch (view) {
      case 'send':
        return <SendForm />;
      case 'receive':
        return <ReceiveForm initialCode={view === 'receive' ? codeFromUrl : null} />;
      case 'menu':
      default:
        return (
          <div className="animate-fade-in text-center space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Instant Clipboard & File Transfer
            </h2>
            <p className="max-w-md mx-auto text-muted-foreground">
              Seamlessly copy and transfer text, links, or files between your devices. Fast, private, and simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => setView('send')}>
                Send a Clip
              </Button>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => setView('receive')}>
                Receive a Clip
              </Button>
            </div>
          </div>
        );
    }
  };

  const handleSetView = (newView: View) => {
    if (newView === 'menu' && codeFromUrl) {
      // If returning to menu, clear the URL param to avoid being stuck in receive mode
      window.history.pushState({}, '', '/');
    }
    setView(newView);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 flex flex-col items-center justify-center">
        {view !== 'menu' && (
          <Button 
            variant="ghost" 
            onClick={() => handleSetView('menu')} 
            className="absolute top-24 left-4 sm:left-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Switch Mode
          </Button>
        )}
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
