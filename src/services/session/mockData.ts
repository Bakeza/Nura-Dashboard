
/*
import { format, subDays } from "date-fns";
import { TrendData } from "../patient";

/**
 * Generate mock session data for development and testing
 */
/*export const generateMockSessions = (userId: string, count: number = 10): { data: TrendData[] } => {
  const sessions: TrendData[] = [];
  
  for (let i = 0; i < count; i++) {
    const date = format(subDays(new Date(), i * 5), "yyyy-MM-dd'T'HH:mm:ss");
    const baseScore = 50 + Math.floor(Math.random() * 40); // Random score between 50-90
    const sessionId = `session-${userId}-${i}`; // Generate a session ID
    
    const session: TrendData = {
      id: sessionId, 
      session_id: sessionId, // Using the same ID for both properties for consistency
      session_date: date,
      memory_score: baseScore + Math.floor(Math.random() * 20 - 10),
      attention_score: baseScore + Math.floor(Math.random() * 20 - 10),
      impulse_score: baseScore + Math.floor(Math.random() * 20 - 10),
      executive_score: baseScore + Math.floor(Math.random() * 20 - 10),
      memory_details: {
        overall_score: baseScore + Math.floor(Math.random() * 15 - 5),
        percentile: Math.floor(Math.random() * 100),
        classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
        components: {
          working_memory: {
            score: baseScore + Math.floor(Math.random() * 10),
            components: {
              recall_span: Math.floor(Math.random() * 10) + 1,
              sequential_memory: Math.floor(Math.random() * 100),
              dual_processing: Math.floor(Math.random() * 100),
              visual_working_memory: Math.floor(Math.random() * 100)
            }
          },
          visual_memory: {
            score: baseScore + Math.floor(Math.random() * 10),
            components: {
              pattern_recognition: Math.floor(Math.random() * 100),
              spatial_recall: Math.floor(Math.random() * 100),
              object_memory: Math.floor(Math.random() * 100),
              delayed_recall: Math.floor(Math.random() * 100)
            }
          }
        },
        data_completeness: Math.floor(Math.random() * 40) + 60, // 60-100%
        tasks_used: ['Memory Matrix', 'Sequence Recall', 'Dual N-Back', 'Pattern Memory'].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1)
      },
      attention_details: {
        overall_score: baseScore + Math.floor(Math.random() * 15 - 5),
        percentile: Math.floor(Math.random() * 100),
        classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
        components: {
          crop_score: baseScore + Math.floor(Math.random() * 20 - 10),
          sequence_score: baseScore + Math.floor(Math.random() * 20 - 10)
        },
        data_completeness: Math.random(), // 0-1 value
        tasks_used: ['Continuous Performance', 'Visual Search', 'Divided Attention'].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1)
      },
      impulse_details: {
        overall_score: baseScore + Math.floor(Math.random() * 15 - 5),
        percentile: Math.floor(Math.random() * 100),
        classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
        components: {
          inhibitory_control: baseScore + Math.floor(Math.random() * 20 - 10),
          response_control: baseScore + Math.floor(Math.random() * 20 - 10),
          decision_speed: baseScore + Math.floor(Math.random() * 20 - 10),
          error_adaptation: baseScore + Math.floor(Math.random() * 20 - 10)
        },
        data_completeness: Math.random(), // 0-1 value
        games_used: ['Go/No-Go', 'Flanker Task', 'Stroop Test', 'Stop Signal'].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1)
      },
      executive_details: {
        overall_score: baseScore + Math.floor(Math.random() * 15 - 5),
        percentile: Math.floor(Math.random() * 100),
        classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
        components: {
          memory_contribution: baseScore + Math.floor(Math.random() * 20 - 10),
          attention_contribution: baseScore + Math.floor(Math.random() * 20 - 10),
          impulse_contribution: baseScore + Math.floor(Math.random() * 20 - 10)
        },
        data_completeness: Math.random(), // 0-1 value
        profile_pattern: [
          "Balanced cognitive profile with good integration across domains",
          "Strong memory with moderate attention and impulse control",
          "Attention challenges impacting executive function",
          "Impulse control difficulties affecting overall cognitive functioning",
          "Executive function strengths with varying domain performance"
        ][Math.floor(Math.random() * 5)]
      }
    };
    
    sessions.push(session);
  }
  
  return { data: sessions };
};*/

// Empty implementation to avoid import errors
export const generateMockSessions = () => ({ data: [] });
