
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { PatientReports } from '@/components/reports/PatientReports';
import { ReportType } from '@/utils/types/patientTypes';
import { toast } from "@/hooks/use-toast";
import ReportVisualizations from '@/components/reports/ReportVisualizations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface PatientReportTabProps {
  patientId: string;
  patientName: string;
}

export const PatientReportTab: React.FC<PatientReportTabProps> = ({ patientId, patientName }) => {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { language } = useLanguage();
  
  // Function to handle adding a new report
  const handleAddReport = (newReport: ReportType) => {
    // Ensure the report has the proper data structure
    const enhancedReport = {
      ...newReport,
      data: {
        ...newReport.data,
        date: newReport.data?.date || new Date().toISOString(),
      }
    };
    
    setReports(prevReports => [enhancedReport, ...prevReports]);
    setSelectedReport(enhancedReport); // Auto-select the newly generated report
    setIsDialogOpen(true); // Open dialog to view the newly generated report
    
    toast({
      title: "Report Generated",
      description: "Your report has been added to the list.",
    });
  };
  
  // Function to handle viewing a report
  const handleViewReport = (report: ReportType) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };
  
  // Function to close the report dialog
  const handleCloseReport = () => {
    setIsDialogOpen(false);
  };
  
  // Function to send email with report
  const sendReportEmail = async (
    emailRecipient: string, 
    emailSubject: string, 
    emailMessage: string, 
    reportData: any
  ) => {
    try {
      // In a real application, this would call an API endpoint to send the email
      // For now we'll simulate this with a delayed response
      console.log('Sending email to:', emailRecipient);
      console.log('Email subject:', emailSubject);
      console.log('Email message:', emailMessage);
      console.log('Report data:', reportData);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Email Sent",
        description: `Email successfully sent to ${emailRecipient}.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Email Sending Failed",
        description: "There was an error sending the email. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${language === 'ar' ? 'lg:rtl' : ''}`}>
        <div className="lg:col-span-2">
          <PatientReports 
            reports={reports} 
            onViewReport={handleViewReport} 
          />
        </div>
        <div>
          <ReportGenerator 
            patient={{ user_id: patientId, name: patientName, age: 0, gender: 'Male' }}
            metrics={{
              patientId: patientId,
              date: new Date().toISOString(),
              attention: 75,
              memory: 65,
              executiveFunction: 80,
              behavioral: 70,
              percentile: 72,
              sessionsDuration: 120,
              sessionsCompleted: 12,
              progress: 8,
              clinicalConcerns: [],
            }}
            onReportGenerate={handleAddReport}
            onSendEmail={sendReportEmail}
          />
        </div>
      </div>
      
      {/* Dialog for report visualization */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedReport?.title || 'Report'}
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <ReportVisualizations 
              report={selectedReport} 
              patientId={patientId} 
              patientName={patientName} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
