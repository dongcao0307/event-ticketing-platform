import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AdminRoute = ({ children }) => {
  const user = authService.getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
