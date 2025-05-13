
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '@/utils/tokenExpiration';
import { useUser } from '@/contexts/UserContext';
import { toast } from "sonner";

const SessionTimeoutHandler = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useUser();
  
  useEffect(() => {
    const checkToken = () => {
      try {
        const token = localStorage.getItem('neurocog_token');
        
        if (!token || isTokenExpired(token)) {
          localStorage.removeItem('neurocog_token');
          // Only show toast if token exists but expired - not on initial load
          if (token) {
            // Use success toast for session expired rather than error toast
            toast.success("Your session has expired. Please log in again.");
          }
          
          // Only navigate if we're not already on the login or landing page
          const currentPath = window.location.pathname;
          if (currentPath !== '/login' && currentPath !== '/') {
            navigate('/login');
          }
        } else {
          // Token is valid, refresh user data
          refreshUserData();
        }
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };

    // Check token immediately
    checkToken();
    
    // Set up interval to check token periodically
    const intervalId = setInterval(checkToken, 60000); // Check every minute
    
    return () => {
      clearInterval(intervalId);
    };
  }, [navigate, refreshUserData]);
  
  return null; // This component doesn't render anything
};

export default SessionTimeoutHandler;
