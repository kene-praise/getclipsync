
import { useAuth } from '@/contexts/AuthContext';
import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import CreateClipForm from '@/components/CreateClipForm';
import ClipList from '@/components/ClipList';
import { useResponsive } from '@/hooks/useResponsive';

const AppPage = () => {
  const { user } = useAuth();
  const { isMobile } = useResponsive();

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <div
        className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      ></div>
      <UnifiedHeader />
      <main className={`flex-grow container mx-auto flex flex-col items-center justify-center pt-20 pb-10 px-4`}>
        <div className={`w-full space-y-6 ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
          <div className="text-center space-y-2">
            <h1 className={`font-bold animate-fade-in ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              Welcome to ClipSync
            </h1>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-base'}`}>
              Sync your clipboard across all devices
            </p>
            {user && (
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Signed in as {user.email}
              </p>
            )}
          </div>
          <CreateClipForm />
          <ClipList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppPage;
