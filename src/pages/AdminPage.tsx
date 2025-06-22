
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '@/components/AdminDashboard';
import Header from '@/components/Header';

const AdminPage = () => {
  const { user } = useAuth();

  // For now, allow any authenticated user to access admin
  // In production, you'd check for admin role
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default AdminPage;
