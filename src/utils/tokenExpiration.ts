
function getTokenExpiration(token: string): Date | null {
  try {
    // Check if token exists and has the expected format
    if (!token || token.split(".").length !== 3) return null;
    
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return null;

    // Convert from seconds to milliseconds
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  // If token is not provided, consider it expired
  if (!token) return true;
  
  const expirationDate = getTokenExpiration(token);
  if (!expirationDate) return true;

  const currentDate = new Date();
  return currentDate > expirationDate;
}

export { getTokenExpiration, isTokenExpired };
