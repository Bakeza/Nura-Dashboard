
// Main entry point that exports all session-related functionality
import { addSession } from './sessionApi';
import { getUserSessions, getUserSession } from './sessionQueries';
import { getSessionDomainDetails } from './domainDetails';
import { generateMockSessions } from './mockData';

const SessionService = {
  addSession,
  getUserSessions,
  getUserSession,
  getSessionDomainDetails,
  generateMockSessions, // Exporting this for testing purposes
};

export default SessionService;
