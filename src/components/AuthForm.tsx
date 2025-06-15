import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import GoogleIcon from './icons/GoogleIcon';

const AuthForm = () => {
  const location = useLocation();
  const initialIsSignUp = location.state?.isSignUp === true;
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignUp(location.state?.isSignUp === true);
  }, [location.state]);

  const handleOAuthSignIn = async (provider: 'google') => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/app`,
      },
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
    // On success, Supabase handles the redirect.
  };

  const handleAuth = async () => {
    setIsLoading(true);
    
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message, {
          description: "Can't log in? Try signing in with Google instead.",
        });
      } else if (data.session) {
        // If email confirmation is disabled, a session is returned.
        toast.success('Account created successfully!');
        const from = location.state?.from?.pathname || '/app';
        navigate(from, { replace: true });
      } else if (data.user) {
        // If email confirmation is enabled, user needs to verify.
        toast.info('Please check your email to confirm your account.');
        clearForm();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Successfully logged in!');
        const from = location.state?.from?.pathname || '/app';
        navigate(from, { replace: true });
      }
    }
    setIsLoading(false);
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    clearForm();
  }

  return (
    <Card className="w-full max-w-sm animate-fade-in bg-secondary/20 backdrop-blur-md border border-white/10">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Create an Account' : 'Sign In'}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'For the best experience, we recommend signing up with Google.' 
            : 'Welcome back! Sign in to access your clips.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" onClick={() => handleOAuthSignIn('google')} disabled={isLoading}>
          <GoogleIcon className="mr-2 h-4 w-4" />
          {isSignUp ? 'Sign Up with Google' : 'Sign In with Google'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or with email
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'} 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <Button onClick={handleAuth} variant="outline" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
        <Button variant="link" className="w-full text-sm" onClick={toggleMode}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Button>
        <div className="text-center text-sm text-muted-foreground pt-2">
            Having trouble?{' '}
            <a href="mailto:support@example.com" className="underline hover:text-primary">
                Contact Support
            </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
