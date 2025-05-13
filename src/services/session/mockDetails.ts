
/*
import { format, subDays } from 'date-fns';

// Helper function to generate trend data points for a specific domain
const generateDomainTrendData = (domain: string, daysCount: number = 30) => {
  const trendData = [];
  const baseValue = {
    attention: 75,
    memory: 80,
    executiveFunction: 65,
    behavioral: 70
  }[domain] || 65;
  
  const varianceMax = 10; // Maximum variance in score
  
  for (let i = 0; i < daysCount; i++) {
    const date = format(subDays(new Date(), daysCount - i), 'yyyy-MM-dd');
    // Generate a slightly random value around the base value
    const variance = Math.random() * varianceMax - (varianceMax / 2);
    const value = Math.min(Math.max(baseValue + variance, 30), 95); // Keep between 30-95
    
    trendData.push({
      date,
      value
    });
  }
  
  return trendData;
};

// Mock data for attention domain
const getMockAttentionData = (sessionId: string) => {
  return {
    session_id: sessionId,
    overall_score: 75,
    percentile: 68,
    classification: "Above Average",
    components: {
      sustained_attention: 78,
      selective_attention: 72,
      divided_attention: 75
    },
    trendData: generateDomainTrendData('attention'),
    data_completeness: 0.95
  };
};

// Mock data for memory domain
const getMockMemoryData = (sessionId: string) => {
  return {
    session_id: sessionId,
    overall_score: 80,
    percentile: 75,
    classification: "Strong",
    components: {
      working_memory: {
        score: 78,
        components: {
          verbal: 80,
          visual: 76
        }
      },
      visual_memory: {
        score: 82,
        components: {
          recognition: 85,
          recall: 79
        }
      }
    },
    trendData: generateDomainTrendData('memory'),
    data_completeness: 0.92
  };
};

// Mock data for executive function domain
const getMockExecutiveData = (sessionId: string) => {
  return {
    session_id: sessionId,
    overall_score: 65,
    percentile: 58,
    classification: "Average",
    components: {
      planning: 68,
      flexibility: 62,
      inhibition: 65
    },
    trendData: generateDomainTrendData('executiveFunction'),
    data_completeness: 0.88
  };
};

// Mock data for behavioral domain
const getMockBehavioralData = (sessionId: string) => {
  return {
    session_id: sessionId,
    overall_score: 70,
    percentile: 65,
    classification: "Average",
    components: {
      impulse_control: 72,
      emotional_regulation: 68,
      self_monitoring: 70
    },
    trendData: generateDomainTrendData('behavioral'),
    data_completeness: 0.9
  };
};

// Get mock data for a specific domain
export const getMockDomainDetails = (sessionId: string, domain: string) => {
  switch (domain.toLowerCase()) {
    case 'attention':
      return getMockAttentionData(sessionId);
    case 'memory':
      return getMockMemoryData(sessionId);
    case 'executive':
      return getMockExecutiveData(sessionId);
    case 'behavioral':
      return getMockBehavioralData(sessionId);
    default:
      console.error(`Unknown domain: ${domain}`);
      return null;
  }
};*/

// Empty implementation to avoid import errors
export const getMockDomainDetails = () => ({
  session_id: '',
  overall_score: 0,
  percentile: 0,
  classification: "No Data",
  components: {},
  trendData: [],
  data_completeness: 0
});
