
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '@/services/auth';
import { useUser } from '@/contexts/UserContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const { userData, refreshUserData } = useUser();
  
  // When mounting a protected route, refresh user data from token
  // Added check to prevent refreshing if userData is already available
  useEffect(() => {
    if (isAuthenticated && !userData) {
      refreshUserData();
    }
  }, [refreshUserData, isAuthenticated, userData]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
