// src/contexts/PatientContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

interface PatientContextType {
  patientIds: string[];
  setPatientIds: (ids: string[]) => void;
}

const PatientContext = createContext<PatientContextType>({
  patientIds: [],
  setPatientIds: () => {},
});

export const PatientProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [patientIds, setPatientIds] = useState<string[]>([]);

  return (
    <PatientContext.Provider value={{ patientIds, setPatientIds }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => useContext(PatientContext);
