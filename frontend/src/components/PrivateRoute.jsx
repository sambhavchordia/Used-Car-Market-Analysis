import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken'); // store token on login
  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
