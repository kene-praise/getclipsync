
import AuthForm from '@/components/AuthForm';
import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';

const AuthPage = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground px-4 md:px-10 lg:px-16">
      <div
        className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)]"
      ></div>
      <UnifiedHeader />
      <main className="flex-grow container mx-auto flex flex-col items-center pt-20 pb-10">
        <AuthForm />
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
