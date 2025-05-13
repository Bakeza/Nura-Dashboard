
/*
import { format, subDays } from 'date-fns';
import { CognitiveDomain, PatientMetrics } from '../types/patientTypes';
import { randomFloat } from '../helpers/randomUtils';

/**
 * Generate historical trends for a specific domain
 */
/*export const generateTrendData = (domain: keyof CognitiveDomain, days: number = 90) => {
  const data = [];
  for (let i = days; i >= 0; i -= randomInt(3, 7)) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    // Add some randomness but ensure an overall improving trend
    const baseValue = 50 + ((days - i) / days) * 15;
    const randomVariation = randomFloat(-5, 5);
    const value = Math.min(Math.max(baseValue + randomVariation, 0), 100); // Ensure value is between 0 and 100
    data.push({ date, value });
  }
  return data;
};

/**
 * Generate percentile data for normative comparison
 */
/*export const generatePercentileData = () => {
  return {
    patient: {
      attention: randomFloat(40, 95),
      memory: randomFloat(40, 95),
      executiveFunction: randomFloat(40, 95),
      behavioral: randomFloat(40, 95)
    },
    ageGroup: {
      attention: randomFloat(45, 55),
      memory: randomFloat(45, 55),
      executiveFunction: randomFloat(45, 55),
      behavioral: randomFloat(45, 55)
    },
    adhdSubtype: {
      attention: randomFloat(35, 45),
      memory: randomFloat(40, 50),
      executiveFunction: randomFloat(30, 45),
      behavioral: randomFloat(35, 45)
    }
  };
};*/

// Helper function from randomUtils to avoid circular dependency
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Empty implementations to avoid import errors
export const generateTrendData = () => [];
export const generatePercentileData = () => ({
  patient: {},
  ageGroup: {},
  adhdSubtype: {}
});
