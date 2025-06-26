
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import AdminDashboard from '@/components/AdminDashboard';
import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import { Loader2, Shield } from 'lucide-react';

const AdminPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminCheckLoading } = useAdminCheck();

  // Show loading while checking authentication
  if (authLoading || adminCheckLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <UnifiedHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access the admin dashboard.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact the administrator if you believe this is an error.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
