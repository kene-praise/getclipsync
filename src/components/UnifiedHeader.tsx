
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useResponsive } from '@/hooks/useResponsive';
import MobileNavMenu from '@/components/MobileNavMenu';

const UnifiedHeader = () => {
  const { user, signOut } = useAuth();
  const { data: isAdmin } = useAdminCheck();
  const location = useLocation();
  const { isMobile } = useResponsive();

  const getContextualNavigation = () => {
    if (!user) return null;

    const currentPath = location.pathname;
    
    if (currentPath === '/app') {
      return (
        <Button variant="ghost" asChild className="rounded-full text-sm">
          <Link to="/">Go to Website</Link>
        </Button>
      );
    } else if (currentPath === '/admin') {
      return (
        <>
          <Button variant="ghost" asChild className="rounded-full text-sm">
            <Link to="/">Go to Website</Link>
          </Button>
          <Button variant="ghost" asChild className="rounded-full text-sm">
            <Link to="/app">Go to App</Link>
          </Button>
        </>
      );
    } else {
      return (
        <Button variant="ghost" asChild className="rounded-full text-sm">
          <Link to="/app">Go to App</Link>
        </Button>
      );
    }
  };

  return (
    <header className="sticky top-6 z-50">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between rounded-full bg-secondary/40 backdrop-blur-lg border border-secondary py-2 pl-4 pr-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Share2 className="h-6 w-6 text-primary" />
            <span className={isMobile ? "text-lg" : "text-xl"}>ClipSync</span>
          </Link>
          
          {/* Desktop Navigation - Hidden on mobile */}
          {!isMobile && (
            <nav className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  {getContextualNavigation()}
                  {isAdmin && (
                    <Button variant="ghost" asChild className="rounded-full text-sm">
                      <Link to="/admin">Admin</Link>
                    </Button>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary max-w-[120px] truncate">{user.email}</span>
                  </div>
                  <Button variant="outline" onClick={signOut} className="rounded-full text-sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild className="rounded-full text-sm">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button asChild className="rounded-full text-sm">
                    <Link to={{ pathname: '/auth' }} state={{ isSignUp: true }}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          )}
          
          {/* Mobile Navigation - Only shown on mobile */}
          {isMobile && <MobileNavMenu />}
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
