
import { useEffect } from 'react';
import AuthService from './auth';
import { toast } from 'sonner';

// Constants for session timeout (in milliseconds)
const SESSION_TIMEOUT = 20 * 60 * 1000; // 20 minutes
const WARNING_BEFORE_TIMEOUT = 2 * 60 * 1000; // 2 minutes before timeout

let logoutTimer: NodeJS.Timeout | null = null;
let warningTimer: NodeJS.Timeout | null = null;

// Events we'll monitor to detect user activity
const USER_ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
];

// Reset the session timer when user activity is detected
const resetSessionTimer = () => {
  if (logoutTimer) clearTimeout(logoutTimer);
  if (warningTimer) clearTimeout(warningTimer);

  // Only set timers if user is authenticated
  if (AuthService.isAuthenticated()) {
    // Set warning timer to notify user before logout
    warningTimer = setTimeout(() => {
      toast.warning("Your session will expire soon. Please save your work.", {
        duration: 10000,
        id: "session-expiring",
      });
    }, SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT);

    // Set logout timer
    logoutTimer = setTimeout(() => {
      AuthService.logout();
      toast.error("Your session has expired. Please log in again.");
      window.location.href = '/login';
    }, SESSION_TIMEOUT);
  }
};

// Initialize session management
const initializeSessionManager = () => {
  // Set up initial timers
  resetSessionTimer();

  // Add event listeners for user activity
  USER_ACTIVITY_EVENTS.forEach(event => {
    window.addEventListener(event, resetSessionTimer);
  });

  return () => {
    // Clean up event listeners and timers
    USER_ACTIVITY_EVENTS.forEach(event => {
      window.removeEventListener(event, resetSessionTimer);
    });

    if (logoutTimer) clearTimeout(logoutTimer);
    if (warningTimer) clearTimeout(warningTimer);
  };
};

// React hook for components to use
export const useSessionTimeout = () => {
  useEffect(() => {
    const cleanup = initializeSessionManager();
    return cleanup;
  }, []);
};

// Manual control methods
const SessionManager = {
  initialize: initializeSessionManager,
  resetTimer: resetSessionTimer,
};

export default SessionManager;
