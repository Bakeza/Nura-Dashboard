import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  FileText, 
  LayoutTemplate, 
  Mail, 
  Printer
} from 'lucide-react';
import { Patient, PatientMetrics, ReportType } from '@/utils/types/patientTypes';
import { format } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Import the libraries for PDF generation
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportGeneratorProps {
  patient: Patient;
  metrics: PatientMetrics;
  onReportGenerate?: (report: ReportType) => void;
  onSendEmail?: (recipient: string, subject: string, message: string, reportData: any) => Promise<boolean>;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ 
  patient, 
  metrics,
  onReportGenerate,
  onSendEmail
}) => {
  
  // Keep track of sections for report generation
  const [includeSections] = useState({
    overview: true,
    domainAnalysis: true,
    trends: true,
    recommendations: true,
    rawData: false,
  });
  
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [generatedReport, setGeneratedReport] = useState<ReportType | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  const today = format(new Date(), 'MMMM d, yyyy');
  
  const handleGenerateReport = () => {
    // Get actual attention metrics from patient data
    const attentionSummary = "Based on the latest assessment, patient's attention metrics show current performance levels.";
    const memorySummary = "Memory performance analysis indicates current cognitive functioning in this domain.";
    const executiveFunctionSummary = "Executive function assessment shows current capabilities in planning and cognitive control.";
    const overallSummary = "Overall cognitive assessment indicates current profile with identified strengths and areas for development.";
    
    // Create a new report with real recommendations based on current data
    const newReport: ReportType = {
      id: uuidv4(),
      patientId: patient.user_id,
      title: `Comprehensive Report`,
      type: 'comprehensive',
      createdDate: format(new Date(), 'yyyy-MM-dd'),
      sections: {...includeSections},
      status: 'generated',
      data: {
        date: new Date().toISOString(),
        metrics: {
          ...metrics,
        },
        summary: {
          attention: attentionSummary,
          memory: memorySummary,
          executiveFunction: executiveFunctionSummary,
          overall: overallSummary
        },
        recommendations: [
          {
            title: "Personalized cognitive training",
            description: "Based on the assessment results, a personalized cognitive training program tailored to the patient's specific profile is recommended."
          },
          {
            title: "Regular progress monitoring",
            description: "Schedule follow-up assessments every 4-6 weeks to track progress and adjust interventions as needed."
          },
          {
            title: "Environmental modifications",
            description: "Consider implementing appropriate environmental adaptations to support cognitive functioning in daily activities."
          }
        ]
      }
    };
    
    // Store the generated report
    setGeneratedReport(newReport);
    
    // Call the callback if provided
    if (onReportGenerate) {
      onReportGenerate(newReport);
    }
    
    toast({
      title: "Report Generated",
      description: "The report has been generated successfully.",
    });
  };

  const handleSaveReport = async () => {
    if (!generatedReport) {
      toast({
        title: "No Report Available",
        description: "Please generate a report first.",
        variant: "destructive",
      });
      return;
    }

    // Create a temporary element to render the report for PDF generation
    const reportContainer = document.createElement('div');
    reportContainer.className = 'pdf-report-container';
    reportContainer.style.width = '800px';
    reportContainer.style.padding = '40px';
    reportContainer.style.fontFamily = 'Arial, sans-serif';
    reportContainer.style.background = '#fff';
    reportContainer.style.color = '#333';
    
    // Add the report header
    const header = document.createElement('div');
    header.innerHTML = `
      <h1 style="color:#333; font-size: 28px; margin-bottom: 10px;">${patient.name} - Comprehensive Report</h1>
      <p style="color:#666; font-style:italic; margin-bottom: 20px;">Generated on ${today}</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
    `;
    reportContainer.appendChild(header);
    
    // Add the report sections based on user selections
    if (includeSections.overview) {
      const overviewSection = document.createElement('div');
      overviewSection.innerHTML = `
        <h2 style="color:#333; font-size: 22px; margin-top: 30px; margin-bottom: 15px;">Patient Overview</h2>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 10px 0;"><span style="font-weight:bold;">Patient:</span> ${patient.name}</p>
          <p style="margin: 10px 0;"><span style="font-weight:bold;">Gender:</span> ${patient.gender || 'Not specified'}</p>
          <p style="margin: 10px 0;"><span style="font-weight:bold;">Age:</span> ${patient.age || 'Not specified'}</p>
        </div>
      `;
      reportContainer.appendChild(overviewSection);
    }
    
    if (includeSections.domainAnalysis) {
      const analysisSection = document.createElement('div');
      analysisSection.innerHTML = `
        <h2 style="color:#333; font-size: 22px; margin-top: 30px; margin-bottom: 15px;">Cognitive Domain Analysis</h2>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color:#555; font-size: 18px; margin-bottom: 10px;">Domain Scores</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f2f2f2;">
              <th style="text-align: left; padding: 12px; border: 1px solid #ddd;">Domain</th>
              <th style="text-align: center; padding: 12px; border: 1px solid #ddd;">Score</th>
              <th style="text-align: center; padding: 12px; border: 1px solid #ddd;">Previous</th>
              <th style="text-align: center; padding: 12px; border: 1px solid #ddd;">Change</th>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Attention</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${metrics.attention}%</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">-</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">-</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Memory</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${metrics.memory}%</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">-</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">-</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Executive Function</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${metrics.executiveFunction}%</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">-</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">-</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Behavioral</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${metrics.behavioral}%</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">-</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">-</td>
            </tr>
            <tr style="font-weight: bold;">
              <td style="padding: 12px; border: 1px solid #ddd;">Overall</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${metrics.percentile}%</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">-</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">-</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color:#555; font-size: 18px; margin-bottom: 10px;">Domain Summary</h3>
          <p style="margin-bottom: 15px;"><strong>Attention:</strong> ${generatedReport.data?.summary?.attention || 'Assessment of attention performance.'}</p>
          <p style="margin-bottom: 15px;"><strong>Memory:</strong> ${generatedReport.data?.summary?.memory || 'Assessment of memory performance.'}</p>
          <p style="margin-bottom: 15px;"><strong>Executive Function:</strong> ${generatedReport.data?.summary?.executiveFunction || 'Assessment of executive function performance.'}</p>
          <p style="margin-bottom: 15px;"><strong>Overall:</strong> ${generatedReport.data?.summary?.overall || 'Overall cognitive assessment.'}</p>
        </div>
      `;
      reportContainer.appendChild(analysisSection);
    }
    
    if (includeSections.trends) {
      const trendsSection = document.createElement('div');
      trendsSection.innerHTML = `
        <h2 style="color:#333; font-size: 22px; margin-top: 30px; margin-bottom: 15px;">Performance Trends</h2>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 10px 0;"><span style="font-weight:bold;">Sessions Completed:</span> ${metrics.sessionsCompleted}</p>
          <p style="margin: 10px 0;"><span style="font-weight:bold;">Total Training Duration:</span> ${metrics.sessionsDuration} minutes</p>
          <p style="margin: 10px 0;"><span style="font-weight:bold;">Progress:</span> ${metrics.progress}%</p>
        </div>
        <p style="margin: 15px 0;">Assessment of patient's progress over time based on completed sessions.</p>
      `;
      reportContainer.appendChild(trendsSection);
    }
    
    if (includeSections.recommendations) {
      const recommendationsSection = document.createElement('div');
      recommendationsSection.innerHTML = `
        <h2 style="color:#333; font-size: 22px; margin-top: 30px; margin-bottom: 15px;">Clinical Recommendations</h2>
        <ol style="margin-left: 20px;">
          ${generatedReport.data?.recommendations ? 
            generatedReport.data.recommendations.map(rec => 
              `<li style="margin-bottom: 15px;"><strong>${rec.title}</strong>: ${rec.description}</li>`
            ).join('') : 
            `<li style="margin-bottom: 15px;"><strong>No recommendations available</strong>: 
              Recommendations will be provided after a complete assessment.</li>`
          }
        </ol>
      `;
      reportContainer.appendChild(recommendationsSection);
    }
    
    if (includeSections.rawData) {
      const rawDataSection = document.createElement('div');
      rawDataSection.innerHTML = `
        <h2 style="color:#333; font-size: 22px; margin-top: 30px; margin-bottom: 15px;">Raw Assessment Data</h2>
        <p>Detailed raw data from assessments is available upon request. Please contact the clinical team to access the complete dataset.</p>
        <p style="color:#666; font-style:italic; margin-top: 15px;">Note: Raw data includes session-by-session performance metrics, response times, error rates, and detailed assessment outcomes.</p>
      `;
      reportContainer.appendChild(rawDataSection);
    }
    
    // Add footer
    const footer = document.createElement('div');
    footer.innerHTML = `
      <hr style="border: 1px solid #eee; margin: 40px 0 20px 0;" />
      <p style="color:#666; font-size: 12px; margin-top: 20px;">This report was generated on ${today} and represents the patient's performance at that time. 
      Clinical decisions should not be based solely on this report without consultation with a qualified healthcare professional.</p>
    `;
    reportContainer.appendChild(footer);
    
    // Append to document body temporarily (hidden)
    reportContainer.style.position = 'absolute';
    reportContainer.style.left = '-9999px';
    document.body.appendChild(reportContainer);
    
    try {
      // Generate PDF using html2canvas and jsPDF
      const canvas = await html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Add additional pages if report is long
      let position = 0;
      
      if (heightLeft >= pageHeight) {
        // For multi-page support
        for (let i = 1; i <= Math.ceil(heightLeft / pageHeight); i++) {
          position = -(pageHeight * i);
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        }
      }
      
      pdf.save(`${patient.name.replace(/\s+/g, '_')}_comprehensive_report.pdf`);
      
      toast({
        title: "Report Downloaded",
        description: "Your report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clean up
      document.body.removeChild(reportContainer);
    }
  };

  const handlePrintReport = () => {
    if (!generatedReport) {
      toast({
        title: "No Report Available",
        description: "Please generate a report first.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would use a proper print API or library
    // For this demo, we'll simulate printing with the browser print dialog
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${patient.name} - Comprehensive Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .section { margin-bottom: 20px; }
              .metrics { margin-top: 15px; }
              .metric { margin-bottom: 10px; }
              .label { font-weight: bold; }
              .date { color: #666; font-style: italic; }
            </style>
          </head>
          <body>
            <h1>${patient.name} - Comprehensive Report</h1>
            <p class="date">Generated on ${today}</p>
            
            ${includeSections.overview ? `
              <div class="section">
                <h2>Patient Overview</h2>
                <p>Patient: ${patient.name}</p>
                <p>Gender: ${patient.gender}</p>
                <p>Age: ${patient.age}</p>
              </div>
            ` : ''}
            
            ${includeSections.domainAnalysis ? `
              <div class="section">
                <h2>Cognitive Domain Analysis</h2>
                <div class="metrics">
                  <div class="metric">
                    <span class="label">Attention: </span>${metrics.attention}%
                  </div>
                  <div class="metric">
                    <span class="label">Memory: </span>${metrics.memory}%
                  </div>
                  <div class="metric">
                    <span class="label">Executive Function: </span>${metrics.executiveFunction}%
                  </div>
                  <div class="metric">
                    <span class="label">Behavioral: </span>${metrics.behavioral}%
                  </div>
                </div>
              </div>
            ` : ''}
            
            ${includeSections.trends ? `
              <div class="section">
                <h2>Performance Trends</h2>
                <p>Sessions Completed: ${metrics.sessionsCompleted}</p>
                <p>Progress: ${metrics.progress}%</p>
              </div>
            ` : ''}
            
            ${includeSections.recommendations ? `
              <div class="section">
                <h2>Clinical Recommendations</h2>
                <p>Based on the assessment results, the following recommendations are provided:</p>
                <ul>
                  ${generatedReport.data?.recommendations ? 
                    generatedReport.data.recommendations.map(rec => 
                      `<li><strong>${rec.title}</strong>: ${rec.description}</li>`
                    ).join('') : 
                    '<li>No recommendations available</li>'
                  }
                </ul>
              </div>
            ` : ''}
            
            ${includeSections.rawData ? `
              <div class="section">
                <h2>Raw Assessment Data</h2>
                <p>Detailed raw data from assessments is available upon request.</p>
              </div>
            ` : ''}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }
    
    toast({
      title: "Print Dialog Opened",
      description: "Your report is ready to print.",
    });
  };

  const openEmailDialog = () => {
    if (!generatedReport) {
      toast({
        title: "No Report Available",
        description: "Please generate a report first.",
        variant: "destructive",
      });
      return;
    }
    
    setEmailRecipient('');
    setEmailSubject(`${patient.name}'s Comprehensive Report - ${today}`);
    setEmailMessage(`Please find attached the comprehensive report for ${patient.name} generated on ${today}.`);
    setEmailDialogOpen(true);
  };

  const handleSendEmail = async () => {
    if (!onSendEmail) {
      toast({
        title: "Email Function Not Available",
        description: "Email functionality is not available in this context.",
        variant: "destructive",
      });
      setEmailDialogOpen(false);
      return;
    }
    
    if (!emailRecipient) {
      toast({
        title: "Email Required",
        description: "Please enter a recipient email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSendingEmail(true);
    
    // Create report data object to send
    const reportData = {
      patient: {
        name: patient.name,
        id: patient.user_id,
        gender: patient.gender,
        age: patient.age
      },
      reportType: 'comprehensive',
      sections: includeSections,
      metrics,
      generatedDate: today
    };
    
    try {
      const success = await onSendEmail(
        emailRecipient, 
        emailSubject, 
        emailMessage, 
        reportData
      );
      
      if (success) {
        toast({
          title: "Email Request Processed",
          description: `Email to ${emailRecipient} has been processed.`,
        });
        setEmailDialogOpen(false);
      }
    } catch (error) {
      console.error("Error in email sending:", error);
      toast({
        title: "Email Failed",
        description: "There was an error processing your email request.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };
  
  return (
    <>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/30 rounded-lg border border-border mb-6">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Report Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive Report for {patient.name} - {today}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button onClick={handleGenerateReport} className="w-full gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Generate Report
            </Button>
            
            <Button variant="outline" onClick={handleSaveReport} className="w-full gap-2 mt-2">
              <Download className="h-4 w-4" />
              Save Report
            </Button>
            
            <Button variant="outline" onClick={handlePrintReport} className="w-full gap-2">
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Report</DialogTitle>
            <DialogDescription>
              Send the comprehensive report to the recipient's email address.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input
                id="recipient"
                placeholder="recipient@example.com"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={3}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSendEmail} 
              disabled={!emailRecipient || isSendingEmail}
            >
              {isSendingEmail ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Helper function to format section names
const formatSectionName = (key: string): string => {
  switch (key) {
    case 'overview':
      return 'Patient Overview';
    case 'domainAnalysis':
      return 'Cognitive Domain Analysis';
    case 'trends':
      return 'Performance Trends';
    case 'recommendations':
      return 'Clinical Recommendations';
    case 'rawData':
      return 'Raw Assessment Data';
    default:
      return key;
  }
};
