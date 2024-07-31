import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const data = useSelector((state) => state.auth);
  console.log(!data);
  const route = !(data?.accessToken && data?.user) ? children : <Navigate to="/chat" />;
  return route;
};

export default PublicRoute;
