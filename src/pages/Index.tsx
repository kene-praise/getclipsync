
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SendForm from '@/components/SendForm';
import ReceiveForm from '@/components/ReceiveForm';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';

type View = 'send' | 'receive';

const Index = () => {
  const [view, setView] = useState<View>('send');
  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get('code');
  const { signOut, user } = useAuth();

  useEffect(() => {
    if (codeFromUrl && codeFromUrl.length === 6) {
      setView('receive');
    } else if (view === 'receive' && !codeFromUrl) {
      // If we are in receive view but the code is gone from URL, switch back to send.
      window.history.pushState({}, '', '/');
      setView('send');
    }
  }, [codeFromUrl, view]);

  const renderContent = () => {
    switch (view) {
      case 'send':
        return <SendForm />;
      case 'receive':
        return <ReceiveForm initialCode={view === 'receive' ? codeFromUrl : null} />;
      default:
        return <SendForm />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 flex flex-col items-center justify-center relative pt-20 pb-10">
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={signOut} title="Log out">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <div className="w-full max-w-md">
           <div className="flex justify-center mb-6">
             <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full max-w-xs">
                <Button
                    onClick={() => setView('send')}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${view === 'send' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50'}`}
                >
                    Send
                </Button>
                <Button
                    onClick={() => setView('receive')}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${view === 'receive' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50'}`}
                >
                    Receive
                </Button>
            </div>
           </div>
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
