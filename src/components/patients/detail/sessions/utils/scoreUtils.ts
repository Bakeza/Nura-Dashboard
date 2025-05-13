
// Format score for display
export const formatScore = (score: number) => {
  return Math.round(score * 10) / 10; // Round to 1 decimal place
};

// Determine color based on score value
export const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
};

// Format percentile with suffix
export const formatPercentile = (percentile: number): string => {
  if (percentile > 10 && percentile < 20) return `${percentile}th`;
  const lastDigit = percentile % 10;
  switch (lastDigit) {
    case 1: return `${percentile}st`;
    case 2: return `${percentile}nd`;
    case 3: return `${percentile}rd`;
    default: return `${percentile}th`;
  }
};

// Format classification with appropriate styling
export const getClassificationStyle = (classification: string) => {
  switch (classification?.toLowerCase()) {
    case 'excellent':
      return 'bg-green-100 text-green-800';
    case 'good':
      return 'bg-blue-100 text-blue-800';
    case 'average':
      return 'bg-yellow-100 text-yellow-800';
    case 'below average':
    case 'poor':
      return 'bg-orange-100 text-orange-800';
    case 'impaired':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
