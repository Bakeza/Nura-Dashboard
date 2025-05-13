import { PatientAnalysis } from "@/components/patients/detail/PatientAnalysis";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatientContext } from "@/contexts/PatientContext";
import { useUser } from "@/contexts/UserContext";
import CognitiveService from "@/services/cognitive";
import PatientService, { TrendData } from "@/services/patient";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { userData } = useUser();
  const { patientIds, setPatientIds } = usePatientContext();

  const [patientId, setPatientId] = useState<string | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [patientList, setPatientList] = useState<any[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const clinicianId = userData?.id;
        if (!clinicianId) return;

        const patients = await PatientService.getPatientsByClinician(
          clinicianId
        );
        setPatientList(patients);
        setPatientIds(patients.map((p) => p.user_id));

        const params = new URLSearchParams(location.search);
        const id = params.get("patient");
        const validId = id && patients.find((p) => p.user_id === id)?.user_id;
        const selectedId = validId || patients[0]?.user_id || null;

        setPatientId(selectedId);

        if (selectedId) {
          const profile = await CognitiveService.getCognitiveProfile(
            selectedId
          );
          setTrendData(profile.data.trend_graph || []);
        }
      } catch (error) {
        console.error("Error fetching patients or trend data:", error);
      }
    };

    fetchPatients();
  }, [location, setPatientIds, userData?.id]);

  const handlePatientChange = async (id: string) => {
    setPatientId(id);
    navigate(`/analysis?patient=${id}`);
    const profile = await CognitiveService.getCognitiveProfile(id);
    setTrendData(profile.data.trend_graph || []);
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  return (
    <div
      className={`space-y-8 animate-fade-in ${
        language === "ar" ? "rtl" : "ltr"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-muted-foreground"
            onClick={handleBackToDashboard}
          >
            <ChevronLeft
              className={`${language === "ar" ? "ml-1" : "mr-1"} h-4 w-4`}
            />
            {t("Back to Dashboard")}
          </Button>
          <h1 className="text-3xl font-bold mb-1 nura-title">
            {t("analysis")}
          </h1>
          <p className="text-muted-foreground">
            {t("Detailed cognitive domain assessment and trends")}
          </p>
        </div>

        <div className="min-w-[200px]">
          <Select value={patientId || ""} onValueChange={handlePatientChange}>
            <SelectTrigger className="pixel-border">
              <SelectValue placeholder={t("Select a patient")} />
            </SelectTrigger>
            <SelectContent>
              {patientList.map((patient) => (
                <SelectItem key={patient.user_id} value={patient.user_id}>
                  {`${patient.first_name} ${patient.last_name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <PatientAnalysis
        trendGraph={trendData}
        hasTrendData={trendData.length > 0}
      />
    </div>
  );
};

export default Analysis;
