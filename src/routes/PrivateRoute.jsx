import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // Si está autenticado, renderiza el componente
  // Si no, redirige a /login y pasa en state la ruta actual para redirección post-login
  return isAuthenticated ? (
    element
  ) : (
    <Navigate
      to="/login"
      state={{ from: { pathname: location.pathname } }}
      replace
    />
  );
};

export default PrivateRoute;
