
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AlertCircle, RefreshCw } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { PatientHeader } from "@/components/patients/detail/PatientHeader";
import { PatientDetailTabs } from "@/components/patients/detail/PatientDetailTabs";

// Services
import PatientService from "@/services/patient";

// Contexts
import { useLanguage } from "@/contexts/LanguageContext";

// Types
import { PatientProfile } from "@/services/patient";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  
  // Extract the tab from query parameters
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab');

  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const fetchPatient = async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await PatientService.getPatientProfile(patientId);
      setPatient(data);
    } catch (error) {
      console.error("Failed to fetch patient profile:", error);
      setError(error instanceof Error ? error.message : t("Failed to fetch patient data"));
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/patients");
      return;
    }
    
    fetchPatient(id);
  }, [id, navigate]);

  const handleRetry = () => {
    if (!id) return;
    setRetrying(true);
    fetchPatient(id);
  };

  const handleBackClick = () => {
    navigate("/patients");
  };

  // Loading state with skeletons for better UX
  if (loading) {
    return (
      <div className={`container mx-auto p-4 max-w-7xl ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-muted-foreground"
          onClick={handleBackClick}
        >
          <Skeleton className="h-4 w-4 mr-1" />
          <Skeleton className="h-4 w-20" />
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        {/* Skeleton for tabs */}
        <div className="mb-8">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Skeleton for profile content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className={`container mx-auto p-4 max-w-7xl ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-muted-foreground"
          onClick={handleBackClick}
        >
          <AlertCircle className="mr-1 h-4 w-4" />
          {t("Back to Patients")}
        </Button>
        
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("Error Loading Patient Data")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={handleBackClick}
          >
            {t("Return to Patients List")}
          </Button>
          <Button 
            onClick={handleRetry}
            disabled={retrying}
          >
            {retrying ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                {t("retrying")}
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("retry")}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className={`container mx-auto p-4 max-w-7xl ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-muted-foreground"
          onClick={handleBackClick}
        >
          <AlertCircle className="mr-1 h-4 w-4" />
          {t("Back to Patients")}
        </Button>
        
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("Patient Not Found")}</AlertTitle>
          <AlertDescription>{t("The requested patient could not be found or has been removed.")}</AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          onClick={handleBackClick}
        >
          {t("Return to Patients List")}
        </Button>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-4 max-w-7xl ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <PatientHeader 
        patientName={patient.user_name}
        patientId={patient.user_id}
        patientAgeGroup={patient.age_group}
        patientAdhdSubtype={patient.adhd_subtype}
        onBackClick={handleBackClick}
      />

      <PatientDetailTabs 
        patientId={patient.user_id}
        patientName={patient.user_name}
        patientAgeGroup={patient.age_group}
        patientAdhdSubtype={patient.adhd_subtype}
        avgDomainScores={patient.avg_domain_scores}
        trendGraph={patient.trend_graph}
        totalSessions={patient.total_sessions}
        firstSessionDate={patient.first_session_date}
        lastSessionDate={patient.last_session_date}
        age={patient.age}
        gender={patient.gender}
        defaultTab={activeTab === 'reports' ? 'reports' : 'profile'}
      />
    </div>
  );
};

export default PatientDetail;
