import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const token = localStorage.getItem('jwt-token');

    return (user && token) ? children : <Navigate to='/login' replace />;
}

export default ProtectedRoute;