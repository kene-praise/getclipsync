
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CreateClipForm from '@/components/CreateClipForm';
import ClipList from '@/components/ClipList';
import { LogOut } from 'lucide-react';

const Index = () => {
  const { signOut, user } = useAuth();

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

        <div className="w-full max-w-md space-y-6">
          <CreateClipForm />
          <ClipList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
