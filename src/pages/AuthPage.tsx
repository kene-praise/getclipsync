
import AuthForm from '@/components/AuthForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AuthPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 flex flex-col items-center justify-center">
        <AuthForm />
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
