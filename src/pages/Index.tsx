
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
      <main className="flex-grow container mx-auto px-4 flex flex-col items-center justify-center pt-20 pb-10">
        <div className="w-full max-w-md space-y-6">
          <CreateClipForm />
          <ClipList />
        </div>

        <div className="mt-12 flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
