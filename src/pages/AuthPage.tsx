import AuthForm from '@/components/AuthForm';
import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

const AuthPage = () => {
  return <>
    <Helmet>
      <title>Sign In | ClipSync - Free Cross-Device Clipboard Sync</title>
      <meta name="description" content="Sign in to ClipSync and start syncing your clipboard across all devices. Free account with secure cloud storage for text and files." />
      <link rel="canonical" href="https://clipsync.app/auth" />
      <meta property="og:title" content="Sign In | ClipSync" />
      <meta property="og:description" content="Sign in to ClipSync and start syncing your clipboard across all devices." />
      <meta property="og:url" content="https://clipsync.app/auth" />
      <meta name="robots" content="noindex, follow" />
    </Helmet>
    
    <div className="relative flex flex-col min-h-screen bg-background text-foreground md:px-10 lg:px-16 px-0">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)]"></div>
      <UnifiedHeader />
      <main className="flex-grow container mx-auto flex flex-col items-center pt-20 pb-10">
        <AuthForm />
      </main>
      <Footer />
    </div>
  </>;
};

export default AuthPage;