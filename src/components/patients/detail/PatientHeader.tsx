
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";

interface PatientHeaderProps {
  patientName: string;
  patientId: string;
  patientAgeGroup: string;
  patientAdhdSubtype: string | null;
  onBackClick: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  patientName,
  patientId,
  patientAgeGroup,
  patientAdhdSubtype,
  onBackClick
}) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 text-muted-foreground"
        onClick={onBackClick}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Patients
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{patientName}</h1>
          <p className="text-muted-foreground">Patient ID: {patientId}</p>
        </div>
        <div className="mt-2 md:mt-0 flex gap-2">
          <Badge variant="outline" className="text-sm">
            {patientAgeGroup}
          </Badge>
          {patientAdhdSubtype && (
            <Badge variant="secondary" className="text-sm">
              {patientAdhdSubtype}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};
