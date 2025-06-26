
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const UnifiedHeader = () => {
  const { user, signOut } = useAuth();
  const { data: isAdmin } = useAdminCheck();
  const location = useLocation();

  const getContextualNavigation = () => {
    if (!user) return null;

    const currentPath = location.pathname;
    
    if (currentPath === '/app') {
      return (
        <Button variant="ghost" asChild className="rounded-full">
          <Link to="/">Go to Website</Link>
        </Button>
      );
    } else if (currentPath === '/admin') {
      return (
        <>
          <Button variant="ghost" asChild className="rounded-full">
            <Link to="/">Go to Website</Link>
          </Button>
          <Button variant="ghost" asChild className="rounded-full">
            <Link to="/app">Go to App</Link>
          </Button>
        </>
      );
    } else {
      // On website/landing page
      return (
        <Button variant="ghost" asChild className="rounded-full">
          <Link to="/app">Go to App</Link>
        </Button>
      );
    }
  };

  return (
    <header className="sticky top-6 z-50">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between rounded-full bg-secondary/40 backdrop-blur-lg border border-secondary py-2 pl-4 pr-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Share2 className="h-6 w-6 text-primary" />
            <span>ClipSync</span>
          </Link>
          <nav className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                {getContextualNavigation()}
                {isAdmin && (
                  <Button variant="ghost" asChild className="rounded-full">
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <Button variant="outline" onClick={signOut} className="rounded-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="rounded-full">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link to={{ pathname: '/auth' }} state={{ isSignUp: true }}>Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
