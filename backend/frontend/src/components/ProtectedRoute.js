import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user, allowedRoles }) => {
    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />; // Или на страницу 403
    }

    return <Outlet />;
};

export default ProtectedRoute;