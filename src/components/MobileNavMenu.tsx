
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Share2, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const MobileNavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { data: isAdmin } = useAdminCheck();
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  const getContextualNavigation = () => {
    if (!user) return null;

    const currentPath = location.pathname;
    
    if (currentPath === '/app') {
      return (
        <Button variant="ghost" asChild className="w-full justify-start" onClick={closeMenu}>
          <Link to="/">Go to Website</Link>
        </Button>
      );
    } else if (currentPath === '/admin') {
      return (
        <>
          <Button variant="ghost" asChild className="w-full justify-start" onClick={closeMenu}>
            <Link to="/">Go to Website</Link>
          </Button>
          <Button variant="ghost" asChild className="w-full justify-start" onClick={closeMenu}>
            <Link to="/app">Go to App</Link>
          </Button>
        </>
      );
    } else {
      return (
        <Button variant="ghost" asChild className="w-full justify-start" onClick={closeMenu}>
          <Link to="/app">Go to App</Link>
        </Button>
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-4">
          <div className="flex items-center gap-2 pb-4 border-b">
            <Share2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ClipSync</span>
          </div>
          
          {user ? (
            <div className="flex flex-col space-y-4">
              {getContextualNavigation()}
              {isAdmin && (
                <Button variant="ghost" asChild className="w-full justify-start" onClick={closeMenu}>
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary truncate">{user.email}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  signOut();
                  closeMenu();
                }} 
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <Button variant="ghost" asChild className="w-full justify-start" onClick={closeMenu}>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="w-full justify-start" onClick={closeMenu}>
                <Link to={{ pathname: '/auth' }} state={{ isSignUp: true }}>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavMenu;
