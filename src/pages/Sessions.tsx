
import { ActivityBreakdown } from "@/components/sessions/ActivityBreakdown";
import { SessionAnalysis } from "@/components/sessions/SessionAnalysis";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import PatientService from "@/services/patient";
import SessionService from "@/services/session";

import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sessions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [sessionsMap, setSessionsMap] = useState({});
  const [patientId, setPatientId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { userData } = useUser();
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clinicianId = userData?.id;
        const patientsRes = await PatientService.getPatientsByClinician(
          clinicianId
        );
        const patientList = patientsRes;
        setPatients(patientList);

        const map = {};
        for (const patient of patientList) {
          const sessionsRes = await SessionService.getUserSessions(
            patient.user_id
          );
          map[patient.user_id] = sessionsRes.data;
        }
        setSessionsMap(map);

        const params = new URLSearchParams(location.search);
        const pId = params.get("patient");
        const sId = params.get("session");

        const selectedPatientId =
          pId && patientList.some((p) => p.user_id === pId)
            ? pId
            : patientList[0]?.user_id;
        const selectedSessions = map[selectedPatientId] || [];
        const selectedSessionId =
          sId && selectedSessions.some((s) => s.session_id === sId)
            ? sId
            : selectedSessions[0]?.session_id;

        setPatientId(selectedPatientId);
        setSessionId(selectedSessionId);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [location, userData?.id]);

  const handlePatientChange = (id: string) => {
    if (sessionsMap[id]?.length > 0) {
      navigate(
        `/sessions?patient=${id}&session=${sessionsMap[id][0].session_id}`
      );
    } else {
      navigate(`/sessions?patient=${id}`);
    }
  };

  const handleSessionChange = (id: string) => {
    navigate(`/sessions?patient=${patientId}&session=${id}`);
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  const currentPatient = patients.find((p) => p.user_id === patientId);
  const patientSessions = patientId ? sessionsMap[patientId] || [] : [];
  const currentSession = patientSessions.find(
    (s) => s.session_id === sessionId
  );

  if (!currentPatient || !currentSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium">{t("No session data available")}</h3>
          <p className="text-muted-foreground">
            {t("Select a patient with recorded sessions")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 animate-fade-in ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-muted-foreground"
            onClick={handleBackToDashboard}
          >
            <ChevronLeft className={`${language === "ar" ? "ml-1" : "mr-1"} h-4 w-4`} />
            {t("Back to Dashboard")}
          </Button>
          <h1 className="text-3xl font-bold mb-1">{t("Session Analysis")}</h1>
          <p className="text-muted-foreground">
            {t("Detailed breakdown of individual assessment sessions")}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={patientId || ""} onValueChange={handlePatientChange}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder={t("Select a patient")} />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.user_id} value={patient.user_id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sessionId || ""} onValueChange={handleSessionChange}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder={t("Select a session")} />
            </SelectTrigger>
            <SelectContent>
              {patientSessions.map((session) => (
                <SelectItem key={session.session_id} value={session.session_id}>
                  {t("Session")} {session.session_id.split("-")[1]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SessionAnalysis session={currentSession} />
        <ActivityBreakdown session={currentSession} />
      </div>
    </div>
  );
};

export default Sessions;
