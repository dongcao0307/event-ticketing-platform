import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AdminRoute = ({ children }) => {
  const isLoggedIn = authService.isLoggedIn();
  const [userRole, setUserRole] = useState('USER');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (isLoggedIn) {
        try {
          const role = await authService.getUserRole();
          setUserRole(role);
        } catch (error) {
          console.error('Error fetching role:', error);
          setUserRole('USER');
        }
      }
      setLoading(false);
    };

    fetchRole();
  }, [isLoggedIn]);

  if (loading) return <div>Loading...</div>;

  if (!isLoggedIn || userRole !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
