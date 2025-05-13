
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  formatLastSession,
  formatPercentile,
  getScoreColorClass,
} from "@/utils/dataProcessing";
import { Eye, FileText } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export interface Patient {
  user_id: string;
  name: string;
  age: number;
  adhdSubtype?: string | null;
  lastAssessment?: string | null;
  assessmentCount?: number;
}

interface PatientMetrics {
  percentile?: number;
}

interface PatientListProps {
  patients: Patient[];
  metrics: Record<string, PatientMetrics>;
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  metrics,
}) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handlePatientClick = (patientId: string) => {
    console.log("Navigating to patient:", patientId);
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="glass rounded-md overflow-hidden border border-border">
      <Table dir={language === "ar" ? "rtl" : "ltr"}>
        <TableHeader>
          <TableRow>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t("patientName")}
            </TableHead>
            <TableHead>{t("age")}</TableHead>
            <TableHead>{t("adhdSubtype")}</TableHead>
            <TableHead>{t("lastSession")}</TableHead>
            <TableHead>{t("sessions")}</TableHead>
            <TableHead>{t("percentile")}</TableHead>
            <TableHead
              className={language === "ar" ? "text-left" : "text-right"}
            >
              {t("actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.user_id}
              className="hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => handlePatientClick(patient.user_id)}
            >
              <TableCell
                className={`font-medium ${
                  language === "ar" ? "text-right" : ""
                }`}
              >
                {patient.name}
              </TableCell>

              <TableCell>{patient.age ?? "N/A"}</TableCell>

              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {patient.adhdSubtype
                    ? language === "ar"
                      ? t(patient.adhdSubtype.toLowerCase())
                      : patient.adhdSubtype
                    : t("unknown")}
                </Badge>
              </TableCell>

              <TableCell>{formatLastSession(patient.lastAssessment)}</TableCell>

              <TableCell>{patient.assessmentCount ?? 0}</TableCell>

              <TableCell>
                <span
                  className={`font-medium ${getScoreColorClass(
                    metrics[patient.user_id]?.percentile
                  )}`}
                >
                  {formatPercentile(metrics[patient.user_id]?.percentile)}
                </span>
              </TableCell>

              <TableCell
                className={language === "ar" ? "text-left" : "text-right"}
              >
                <div
                  className={`flex items-center ${
                    language === "ar"
                      ? "justify-start space-x-reverse"
                      : "justify-end space-x-2"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/analysis?patient=${patient.user_id}`);
                    }}
                    title={t("viewAnalysis")}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">{t("viewAnalysis")}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Change to navigate to the patient report tab directly
                      navigate(`/patients/${patient.user_id}?tab=reports`);
                    }}
                    title={t("viewReports")}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">{t("viewReports")}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
