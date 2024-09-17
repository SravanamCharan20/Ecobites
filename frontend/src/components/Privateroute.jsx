import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Privateroute = ({ element: Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const location = useLocation();

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default Privateroute;