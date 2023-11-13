import { Outlet, Navigate } from 'react-router-dom'

const useAuth = () => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    return loggedIn === "true";
  };

const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to={"/"} replace />;
  };

export default ProtectedRoutes