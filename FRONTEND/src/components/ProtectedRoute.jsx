import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken");
  const location = useLocation();
  const alertShown = useRef(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!token && !alertShown.current) {
      alert("You need to create an account or sign in to access this page."

);
      alertShown.current = true;
      setRedirect(true);
    }
  }, [token]);

  if (!token && redirect) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return token ? children : null;
};

export default ProtectedRoute;
