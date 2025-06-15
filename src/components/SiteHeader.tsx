
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clapperboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SiteHeader = () => {
    const { user } = useAuth();

    return (
        <header className="py-4 px-4 sm:px-6 lg:px-8 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                    <Clapperboard className="h-6 w-6 text-primary" />
                    <span>ClipSync</span>
                </Link>
                <nav>
                    {user ? (
                         <Button asChild>
                            <Link to="/app">Go to App</Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link to="/auth">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link to={{ pathname: '/auth' }} state={{ isSignUp: true }}>Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default SiteHeader;
