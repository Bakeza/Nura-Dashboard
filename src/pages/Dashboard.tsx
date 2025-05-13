import { DomainChart } from "@/components/dashboard/DomainChart";
import { PatientCard } from "@/components/dashboard/PatientCard";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatientContext } from "@/contexts/PatientContext";
import { useUser } from "@/contexts/UserContext";
import CognitiveService from "@/services/cognitive";
import PatientService from "@/services/patient";
import { sessionData } from "@/utils/mockData";
import { Brain, LineChart, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userData } = useUser();
  const { t, language } = useLanguage();
  const [patients, setPatients] = useState<any[]>([]);
  const [patientMetrics, setPatientMetrics] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const { patientIds, setPatientIds } = usePatientContext();

  // For dashboard metrics
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [averagePercentile, setAveragePercentile] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [numSessions, setNumSessions] = useState(0);

  // Generate domain trends for the dashboard chart (using mock data for now)
  const domainData = {
    attention: Array(10)
      .fill(0)
      .map((_, i) => 50 + Math.random() * 30),
    memory: Array(10)
      .fill(0)
      .map((_, i) => 55 + Math.random() * 25),
    executiveFunction: Array(10)
      .fill(0)
      .map((_, i) => 45 + Math.random() * 35),
    behavioral: Array(10)
      .fill(0)
      .map((_, i) => 60 + Math.random() * 20),
  };
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        if (!patientIds || patientIds.length === 0) return;

        const profiles = await Promise.all(
          patientIds.map((id) => CognitiveService.getCognitiveProfile(id))
        );

        let totalSessionCount = 0;

        profiles.forEach((profile) => {
          console.log("profile", profile);
          totalSessionCount += profile.data.trend_graph?.length || 0;
        });

        setNumSessions(totalSessionCount);
      } catch (error) {
        console.error("Failed to fetch cognitive profiles:", error);
      }
    };

    fetchProfiles();
  }, [patientIds]); // <- This ensures it reruns when patientIds is updated

  // Fetch patients from the API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        // Use clinicianId from authentication when available
        const clinicianId = userData?.id;
        
        // If no clinician ID is available, use fallback data instead of showing an error
        if (!clinicianId) {
          console.log("No clinician ID available, using fallback data");
          // Use mock data silently without showing error toast
          import("@/utils/mockData").then(({ patients, metricsMap }) => {
            setPatients(patients.slice(0, 4));
            setPatientMetrics(metricsMap);
            setTotalPatients(patients.length);
            setTotalSessions(sessionData.length);
            setAveragePercentile(75);
            setTotalMinutes(totalSessions * 15);
            setLoading(false);
          });
          return;
        }
        
        const patientList = await PatientService.getPatientsByClinician(
          clinicianId
        );
        setPatientIds(patientList.map((p) => p.user_id));

        // Get the total patient count directly from the API response length
        setTotalPatients(patientList.length);

        // Format patient data for display
        // Format patient data
        const formattedPatients = patientList.map((p: any) => {
          // Calculate age from date of birth if needed
          const birthDate = p.date_of_birth ? new Date(p.date_of_birth) : null;
          let age;
          if (birthDate) {
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
              age--;
            }
          }

          return {
            user_id: p.user_id,
            name: p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim(),
            age,
            gender: p.gender,
            adhd_subtype: p.adhd_subtype,
            last_session_date: p.last_session_date,
            total_sessions: p.total_sessions || 0,
          };
        });

        // Get detailed profiles for each patient to extract metrics
        const metrics: Record<string, any> = {};
        const profilePromises = formattedPatients
          .slice(0, 8)
          .map(async (patient: any) => {
            try {
              const profile = await PatientService.getPatientProfile(
                patient.user_id
              );
              // Calculate percentile as average of domain scores
              const domainScores = profile.avg_domain_scores || {};
              const scoreValues = Object.values(domainScores).filter(
                (score) => typeof score === "number"
              );
              const percentile =
                scoreValues.length > 0
                  ? Math.round(
                      scoreValues.reduce((a: number, b: number) => a + b, 0) /
                        scoreValues.length
                    )
                  : 0;

              metrics[patient.user_id] = {
                ...domainScores,
                percentile,
                // Mock progress data for now
                progress: Math.round(Math.random() * 15 + 5),
              };
              return profile;
            } catch (error) {
              // Log error to console but don't show toast
              console.error(
                `Error fetching profile for patient ${patient.user_id}:`,
                error
              );
              return null;
            }
          });

        // Wait for all profile requests to complete
        await Promise.all(profilePromises);

        // Display only the first 8 patients in the UI but store the total count
        setPatients(formattedPatients.slice(0, 8));
        setPatientMetrics(metrics);

        // Calculate dashboard metrics - use the full patient list length for total patients
        setTotalPatients(patientList.length); // Get the total number directly from the API response
        setTotalSessions(
          formattedPatients.reduce((sum, p) => sum + (p.total_sessions || 0), 0)
        );

        const allPercentiles = Object.values(metrics).map(
          (m: any) => m.percentile || 0
        );
        setAveragePercentile(
          allPercentiles.length > 0
            ? Math.round(
                allPercentiles.reduce((a: number, b: number) => a + b, 0) /
                  allPercentiles.length
              )
            : 0
        );

        // Mock total minutes for now
        setTotalMinutes(Math.round(totalSessions * 15));
      } catch (error) {
        // Log error to console but don't show error toast
        console.error("Failed to fetch patients:", error);
        
        // Silently fallback to mock data without showing an error toast
        import("@/utils/mockData").then(({ patients, metricsMap }) => {
          setPatients(patients.slice(0, 4));
          setPatientMetrics(metricsMap);
          setTotalPatients(patients.length);
          setTotalSessions(sessionData.length);
          setAveragePercentile(75);
          setTotalMinutes(totalSessions * 15);
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [userData?.id, toast, totalSessions, t, setPatientIds]);

  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const handleViewAllPatients = () => {
    navigate("/patients");
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in p-2 sm:p-4 md:p-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            {t("dashboard")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("overview")}
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-64 sm:h-80 w-full" />
          <Skeleton className="h-64 sm:h-80 w-full" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              {t("recentActivity")}
            </h2>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 sm:h-56 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-6 sm:space-y-8 animate-fade-in p-2 sm:p-4 md:p-6 overflow-x-hidden ${
        language === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">
          {t("dashboard")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("overview")}
        </p>
      </div>

      <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatusCard
          title={t("patients")}
          value={totalPatients}
          icon={<Users className="h-4 sm:h-5 w-4 sm:w-5" />}
          tooltip={t("Total number of patients under your care")}
        />
        <StatusCard
          title={t("percentile")}
          value={averagePercentile}
          isPercentile={true}
          change={{ value: 12, isImprovement: true }}
          icon={<Brain className="h-4 sm:h-5 w-4 sm:w-5" />}
          tooltip={t(
            "Average cognitive performance across all patients relative to their age group"
          )}
        />
        <StatusCard
          title={t("sessions")}
          value={numSessions}
          change={{ value: 8, isImprovement: true }}
          icon={<LineChart className="h-4 sm:h-5 w-4 sm:w-5" />}
          tooltip={t("Total number of assessment sessions conducted")}
        />
      </div>

      <div className="">
        <DomainChart domainData={domainData} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">
            {t("recentActivity")}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllPatients}
            className="text-xs sm:text-sm"
          >
            {t("viewAll")}
          </Button>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <PatientCard
                key={patient.user_id}
                patient={patient}
                metrics={patientMetrics[patient.user_id] || {}}
                onClick={handlePatientClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">{t("No patients found.")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
