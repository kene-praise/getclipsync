
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SiteHeader = () => {
    const { user } = useAuth();

    return (
        <header className="sticky top-4 z-50">
            <div className="container mx-auto max-w-3xl">
                <div className="flex items-center justify-between rounded-full bg-secondary/40 backdrop-blur-lg border border-secondary p-2 px-4">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        <Share2 className="h-6 w-6 text-primary" />
                        <span>ClipSync</span>
                    </Link>
                    <nav>
                        {user ? (
                            <Button asChild className="rounded-full">
                                <Link to="/app">Go to App</Link>
                            </Button>
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

export default SiteHeader;
