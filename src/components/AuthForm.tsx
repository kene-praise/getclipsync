
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async () => {
    setIsLoading(true);
    
    const authMethod = isSignUp 
      ? supabase.auth.signUp 
      : supabase.auth.signInWithPassword;
      
    const { error } = await authMethod({
      email,
      password,
      options: {
        emailRedirectTo: isSignUp ? `${window.location.origin}/` : undefined,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      if (isSignUp) {
        toast.success('Check your email for a confirmation link!');
        setEmail('');
        setPassword('');
      } else {
        toast.success('Successfully logged in!');
        const from = location.state?.from?.pathname || '/';
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
    <Card className="w-full max-w-sm animate-fade-in">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Create an Account' : 'Sign In'}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Enter your email and password to create an account.' 
            : 'Welcome back! Sign in to access your clips.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button onClick={handleAuth} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
        <Button variant="link" className="w-full text-sm" onClick={toggleMode}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
