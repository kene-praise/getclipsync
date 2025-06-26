
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const SiteHeader = () => {
    const { user } = useAuth();
    const { data: isAdmin } = useAdminCheck();

    return (
        <header className="sticky top-6 z-50">
            <div className="container mx-auto max-w-3xl">
                <div className="flex items-center justify-between rounded-full bg-secondary/40 backdrop-blur-lg border border-secondary py-2 pl-4 pr-2">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        <Share2 className="h-6 w-6 text-primary" />
                        <span>ClipSync</span>
                    </Link>
                    <nav className="flex items-center gap-2">
                        <Button variant="ghost" asChild className="rounded-full">
                            <Link to="/pricing">Pricing</Link>
                        </Button>
                        {user ? (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" asChild className="rounded-full">
                                    <Link to="/">Go to Website</Link>
                                </Button>
                                {isAdmin && (
                                    <Button variant="ghost" asChild className="rounded-full">
                                        <Link to="/admin">Admin</Link>
                                    </Button>
                                )}
                                <Button asChild className="rounded-full">
                                    <Link to="/app">Go to App</Link>
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

export default SiteHeader;
