
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Download, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReportType } from '@/utils/types/patientTypes';
import { format, parseISO } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PatientReportsProps {
  reports: ReportType[];
  onViewReport?: (report: ReportType) => void;
}

export const PatientReports: React.FC<PatientReportsProps> = ({ 
  reports, 
  onViewReport 
}) => {
  const [viewingReport, setViewingReport] = useState<ReportType | null>(null);

  const getStatusColor = (status: ReportType['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'generated':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'shared':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getReportTypeLabel = (type: ReportType['type']) => {
    switch (type) {
      case 'clinical':
        return 'Clinical';
      case 'school':
        return 'School Accommodation';
      case 'progress':
        return 'Progress Summary';
      case 'detailed':
        return 'Detailed Analysis';
      default:
        return 'Unknown';
    }
  };

  const handleViewReport = (report: ReportType) => {
    setViewingReport(report);
    if (onViewReport) {
      onViewReport(report);
    }
  };

  const handleDownload = async (report: ReportType) => {
    try {
      toast({
        title: "Preparing download",
        description: `${report.title} is being prepared...`,
      });
      
      // Create a temporary container for the report content
      const reportContainer = document.createElement('div');
      reportContainer.style.padding = '20px';
      reportContainer.style.fontFamily = 'Arial, sans-serif';
      
      // Build enhanced report HTML content with more detailed sections
      reportContainer.innerHTML = `
        <h1 style="color:#333;font-size:24px;margin-bottom:10px;">${report.title}</h1>
        <p style="color:#666;font-style:italic;margin-bottom:20px;">Generated on ${format(parseISO(report.createdDate), 'MMMM d, yyyy')}</p>
        
        ${report.sections.overview ? `
          <div style="margin-bottom:25px;border-bottom:1px solid #eee;padding-bottom:15px;">
            <h2 style="color:#333;font-size:18px;margin-bottom:10px;">Patient Overview</h2>
            <p>This comprehensive report provides detailed insights into the patient's cognitive performance across multiple domains and sessions.</p>
            <p style="margin-top:10px;"><strong>Assessment Purpose:</strong> To evaluate cognitive function and monitor progress over time</p>
            <p><strong>Report Type:</strong> ${getReportTypeLabel(report.type)}</p>
            <p><strong>Status:</strong> ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}</p>
          </div>
        ` : ''}
        
        ${report.sections.domainAnalysis ? `
          <div style="margin-bottom:25px;border-bottom:1px solid #eee;padding-bottom:15px;">
            <h2 style="color:#333;font-size:18px;margin-bottom:10px;">Cognitive Domain Analysis</h2>
            <p>Detailed analysis of cognitive domains showing strengths and areas for improvement:</p>
            
            <div style="margin-top:15px;">
              <h3 style="color:#555;font-size:16px;margin-bottom:5px;">Attention</h3>
              <p>Score: 75%</p>
              <p style="margin-top:5px;">The patient demonstrates good sustained attention with some difficulties in divided attention tasks. Selective attention is within normal limits but shows room for improvement.</p>
              <p style="margin-top:5px;"><strong>Interpretation:</strong> Moderate performance with positive trajectory.</p>
            </div>
            
            <div style="margin-top:15px;">
              <h3 style="color:#555;font-size:16px;margin-bottom:5px;">Memory</h3>
              <p>Score: 65%</p>
              <p style="margin-top:5px;">Working memory shows some limitations, particularly with sequential tasks. Visual memory is stronger than verbal memory. Long-term recall is inconsistent.</p>
              <p style="margin-top:5px;"><strong>Interpretation:</strong> Moderate performance with opportunities for targeted intervention.</p>
            </div>
            
            <div style="margin-top:15px;">
              <h3 style="color:#555;font-size:16px;margin-bottom:5px;">Executive Function</h3>
              <p>Score: 80%</p>
              <p style="margin-top:5px;">Good problem-solving abilities and cognitive flexibility. Planning and organization skills are well-developed. Task initiation sometimes requires prompting.</p>
              <p style="margin-top:5px;"><strong>Interpretation:</strong> Strong performance; relative strength compared to other domains.</p>
            </div>
            
            <div style="margin-top:15px;">
              <h3 style="color:#555;font-size:16px;margin-bottom:5px;">Behavioral</h3>
              <p>Score: 70%</p>
              <p style="margin-top:5px;">Generally appropriate self-regulation with occasional impulsivity. Response inhibition is developing well. Emotional regulation is appropriate for developmental stage.</p>
              <p style="margin-top:5px;"><strong>Interpretation:</strong> Good behavioral control with specific situations triggering challenges.</p>
            </div>
          </div>
        ` : ''}
        
        ${report.sections.trends ? `
          <div style="margin-bottom:25px;border-bottom:1px solid #eee;padding-bottom:15px;">
            <h2 style="color:#333;font-size:18px;margin-bottom:10px;">Performance Trends</h2>
            <p>Longitudinal analysis of patient's performance across ${report.type === 'detailed' ? '12' : '8'} assessment sessions:</p>
            
            <div style="margin-top:15px;">
              <h3 style="color:#555;font-size:16px;margin-bottom:5px;">Progress Summary</h3>
              <p><strong>Sessions Completed:</strong> 12</p>
              <p><strong>Overall Progress:</strong> 8% improvement</p>
              <p><strong>Most Improved Domain:</strong> Executive Function (+15%)</p>
              <p><strong>Least Improved Domain:</strong> Memory (+3%)</p>
            </div>
            
            <div style="margin-top:15px;">
              <h3 style="color:#555;font-size:16px;margin-bottom:5px;">Consistency Analysis</h3>
              <p>Performance shows greater consistency in morning sessions compared to afternoon sessions. Environmental factors appear to influence attention scores significantly.</p>
            </div>
            
            <div style="margin-top:15px;">
              <h3 style="color:#555;font-size:16px;margin-bottom:5px;">Response to Interventions</h3>
              <p>Positive response to working memory exercises implemented in session 5. Attention training modules show mixed results with greater efficacy when combined with behavioral strategies.</p>
            </div>
          </div>
        ` : ''}
        
        ${report.sections.recommendations ? `
          <div style="margin-bottom:25px;border-bottom:1px solid #eee;padding-bottom:15px;">
            <h2 style="color:#333;font-size:18px;margin-bottom:10px;">Clinical Recommendations</h2>
            <p>Based on comprehensive assessment results, the following evidence-based recommendations are provided:</p>
            
            <h3 style="color:#555;font-size:16px;margin:15px 0 5px;">Cognitive Interventions:</h3>
            <ul style="margin-left:20px;line-height:1.5;">
              <li>Continue regular cognitive assessments on a bi-weekly schedule</li>
              <li>Focus on exercises that target executive function, particularly in planning and organization</li>
              <li>Implement structured working memory training 3x weekly for 15-20 minutes per session</li>
              <li>Consider dual-task training to enhance divided attention capacity</li>
            </ul>
            
            <h3 style="color:#555;font-size:16px;margin:15px 0 5px;">Environmental Modifications:</h3>
            <ul style="margin-left:20px;line-height:1.5;">
              <li>Minimize distractions during focused work periods</li>
              <li>Implement visual schedules and reminders</li>
              <li>Break complex tasks into smaller, manageable steps</li>
              <li>Utilize strengths in visual processing when presenting new information</li>
            </ul>
            
            <h3 style="color:#555;font-size:16px;margin:15px 0 5px;">Follow-up Plan:</h3>
            <ul style="margin-left:20px;line-height:1.5;">
              <li>Comprehensive reassessment in 3 months</li>
              <li>Monthly check-ins to adjust intervention strategies as needed</li>
              <li>Consider school consultation if academic challenges persist</li>
            </ul>
          </div>
        ` : ''}
        
        ${report.sections.rawData ? `
          <div style="margin-bottom:25px;">
            <h2 style="color:#333;font-size:18px;margin-bottom:10px;">Raw Assessment Data</h2>
            <p>Detailed raw data from assessments showing test-by-test performance metrics:</p>
            
            <table style="width:100%;border-collapse:collapse;margin-top:15px;font-size:14px;">
              <thead>
                <tr style="background-color:#f3f4f6;">
                  <th style="padding:8px;text-align:left;border:1px solid #ddd;">Assessment</th>
                  <th style="padding:8px;text-align:left;border:1px solid #ddd;">Raw Score</th>
                  <th style="padding:8px;text-align:left;border:1px solid #ddd;">Percentile</th>
                  <th style="padding:8px;text-align:left;border:1px solid #ddd;">Classification</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:8px;border:1px solid #ddd;">Continuous Performance Test</td>
                  <td style="padding:8px;border:1px solid #ddd;">42/50</td>
                  <td style="padding:8px;border:1px solid #ddd;">75th</td>
                  <td style="padding:8px;border:1px solid #ddd;">Above Average</td>
                </tr>
                <tr style="background-color:#f9fafb;">
                  <td style="padding:8px;border:1px solid #ddd;">Digit Span Forward</td>
                  <td style="padding:8px;border:1px solid #ddd;">6</td>
                  <td style="padding:8px;border:1px solid #ddd;">65th</td>
                  <td style="padding:8px;border:1px solid #ddd;">Average</td>
                </tr>
                <tr>
                  <td style="padding:8px;border:1px solid #ddd;">Digit Span Backward</td>
                  <td style="padding:8px;border:1px solid #ddd;">4</td>
                  <td style="padding:8px;border:1px solid #ddd;">55th</td>
                  <td style="padding:8px;border:1px solid #ddd;">Average</td>
                </tr>
                <tr style="background-color:#f9fafb;">
                  <td style="padding:8px;border:1px solid #ddd;">Trail Making Test A</td>
                  <td style="padding:8px;border:1px solid #ddd;">28 sec</td>
                  <td style="padding:8px;border:1px solid #ddd;">80th</td>
                  <td style="padding:8px;border:1px solid #ddd;">Above Average</td>
                </tr>
                <tr>
                  <td style="padding:8px;border:1px solid #ddd;">Trail Making Test B</td>
                  <td style="padding:8px;border:1px solid #ddd;">65 sec</td>
                  <td style="padding:8px;border:1px solid #ddd;">70th</td>
                  <td style="padding:8px;border:1px solid #ddd;">Average</td>
                </tr>
              </tbody>
            </table>
            
            <p style="margin-top:15px;font-style:italic;">Complete raw data files are available upon request for professional review.</p>
          </div>
        ` : ''}
        
        <div style="margin-top:30px;font-size:12px;color:#666;border-top:1px solid #eee;padding-top:15px;">
          <p>This report is confidential and contains protected health information. It should only be shared with authorized individuals involved in the patient's care.</p>
          <p style="margin-top:5px;">Generated by Cognitive Assessment Platform on ${format(parseISO(report.createdDate), 'MMMM d, yyyy')}.</p>
        </div>
      `;
      
      // Append to document body temporarily (hidden)
      reportContainer.style.position = 'absolute';
      reportContainer.style.left = '-9999px';
      document.body.appendChild(reportContainer);
      
      // Generate PDF using html2canvas and jsPDF
      const canvas = await html2canvas(reportContainer, {scale: 2});
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${report.title.replace(/\s+/g, '_')}_${format(parseISO(report.createdDate), 'yyyy-MM-dd')}.pdf`);
      
      // Clean up
      document.body.removeChild(reportContainer);
      
      toast({
        title: "Download complete",
        description: `${report.title} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download failed",
        description: "Failed to generate the report PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const closeReportView = () => {
    setViewingReport(null);
  };

  return (
    <>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Patient Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reports generated yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{getReportTypeLabel(report.type)}</TableCell>
                    <TableCell>{format(parseISO(report.createdDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(report.status)} capitalize`}
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="View Report"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Download Report"
                          onClick={() => handleDownload(report)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Report Viewing Dialog with Enhanced Content */}
      <Dialog open={!!viewingReport} onOpenChange={closeReportView}>
        {viewingReport && (
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{viewingReport.title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className={`${getStatusColor(viewingReport.status)} capitalize`}>
                    {viewingReport.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Created on {format(parseISO(viewingReport.createdDate), 'MMMM d, yyyy')}
                  </span>
                </div>

                <div className="border-t pt-4 mt-2">
                  {viewingReport.sections.overview && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Patient Overview</h3>
                      <p className="text-muted-foreground mb-3">
                        This comprehensive report provides detailed insights into the patient's cognitive performance across multiple domains and sessions.
                      </p>
                      <div className="bg-muted/20 p-3 rounded-md">
                        <p className="mb-1"><strong>Assessment Purpose:</strong> To evaluate cognitive function and monitor progress over time</p>
                        <p><strong>Report Type:</strong> {getReportTypeLabel(viewingReport.type)}</p>
                      </div>
                    </div>
                  )}
                  
                  {viewingReport.sections.domainAnalysis && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-3">Cognitive Domain Analysis</h3>
                      <p className="text-muted-foreground mb-4">
                        Detailed analysis of cognitive domains showing strengths and areas for improvement:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Attention</span>
                          <span className="text-xl font-semibold">75%</span>
                        </div>
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Memory</span>
                          <span className="text-xl font-semibold">65%</span>
                        </div>
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Executive</span>
                          <span className="text-xl font-semibold">80%</span>
                        </div>
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Behavioral</span>
                          <span className="text-xl font-semibold">70%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-muted/20 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Attention - 75%</h4>
                          <p className="text-sm">The patient demonstrates good sustained attention with some difficulties in divided attention tasks. Selective attention is within normal limits but shows room for improvement.</p>
                          <p className="text-sm mt-2 font-medium">Interpretation: Moderate performance with positive trajectory.</p>
                        </div>
                        
                        <div className="bg-muted/20 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Memory - 65%</h4>
                          <p className="text-sm">Working memory shows some limitations, particularly with sequential tasks. Visual memory is stronger than verbal memory. Long-term recall is inconsistent.</p>
                          <p className="text-sm mt-2 font-medium">Interpretation: Moderate performance with opportunities for targeted intervention.</p>
                        </div>
                        
                        <div className="bg-muted/20 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Executive Function - 80%</h4>
                          <p className="text-sm">Good problem-solving abilities and cognitive flexibility. Planning and organization skills are well-developed. Task initiation sometimes requires prompting.</p>
                          <p className="text-sm mt-2 font-medium">Interpretation: Strong performance; relative strength compared to other domains.</p>
                        </div>
                        
                        <div className="bg-muted/20 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Behavioral - 70%</h4>
                          <p className="text-sm">Generally appropriate self-regulation with occasional impulsivity. Response inhibition is developing well. Emotional regulation is appropriate for developmental stage.</p>
                          <p className="text-sm mt-2 font-medium">Interpretation: Good behavioral control with specific situations triggering challenges.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {viewingReport.sections.trends && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-3">Performance Trends</h3>
                      <p className="text-muted-foreground mb-4">
                        Longitudinal analysis of performance across multiple assessment sessions:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Sessions Completed</span>
                          <span className="text-xl font-semibold">12</span>
                        </div>
                        <div className="bg-background border rounded-md p-3">
                          <span className="text-sm text-muted-foreground block mb-1">Overall Progress</span>
                          <span className="text-xl font-semibold">+8%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-muted/20 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Progress Analysis</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Most improved domain: Executive Function (+15%)</li>
                            <li>Least improved domain: Memory (+3%)</li>
                            <li>Performance consistency has improved by 20% since first assessment</li>
                            <li>Response time has decreased by 12% across all tasks</li>
                          </ul>
                        </div>
                        
                        <div className="bg-muted/20 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Consistency Analysis</h4>
                          <p className="text-sm">Performance shows greater consistency in morning sessions compared to afternoon sessions. Environmental factors appear to influence attention scores significantly.</p>
                        </div>
                        
                        <div className="bg-muted/20 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Response to Interventions</h4>
                          <p className="text-sm">Positive response to working memory exercises implemented in session 5. Attention training modules show mixed results with greater efficacy when combined with behavioral strategies.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {viewingReport.sections.recommendations && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-3">Clinical Recommendations</h3>
                      <p className="text-muted-foreground mb-4">
                        Based on comprehensive assessment results, the following evidence-based recommendations are provided:
                      </p>
                      
                      <div className="space-y-5">
                        <div>
                          <h4 className="font-medium mb-2">Cognitive Interventions</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Continue regular cognitive assessments on a bi-weekly schedule</li>
                            <li>Focus on exercises that target executive function, particularly in planning and organization</li>
                            <li>Implement structured working memory training 3x weekly for 15-20 minutes per session</li>
                            <li>Consider dual-task training to enhance divided attention capacity</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Environmental Modifications</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Minimize distractions during focused work periods</li>
                            <li>Implement visual schedules and reminders</li>
                            <li>Break complex tasks into smaller, manageable steps</li>
                            <li>Utilize strengths in visual processing when presenting new information</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Follow-up Plan</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Comprehensive reassessment in 3 months</li>
                            <li>Monthly check-ins to adjust intervention strategies as needed</li>
                            <li>Consider school consultation if academic challenges persist</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {viewingReport.sections.rawData && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Raw Assessment Data</h3>
                      <p className="text-muted-foreground mb-4">
                        Detailed raw data from assessments showing test-by-test performance metrics:
                      </p>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-muted/30">
                              <th className="border p-2 text-left">Assessment</th>
                              <th className="border p-2 text-left">Raw Score</th>
                              <th className="border p-2 text-left">Percentile</th>
                              <th className="border p-2 text-left">Classification</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-2">Continuous Performance Test</td>
                              <td className="border p-2">42/50</td>
                              <td className="border p-2">75th</td>
                              <td className="border p-2">Above Average</td>
                            </tr>
                            <tr className="bg-muted/10">
                              <td className="border p-2">Digit Span Forward</td>
                              <td className="border p-2">6</td>
                              <td className="border p-2">65th</td>
                              <td className="border p-2">Average</td>
                            </tr>
                            <tr>
                              <td className="border p-2">Digit Span Backward</td>
                              <td className="border p-2">4</td>
                              <td className="border p-2">55th</td>
                              <td className="border p-2">Average</td>
                            </tr>
                            <tr className="bg-muted/10">
                              <td className="border p-2">Trail Making Test A</td>
                              <td className="border p-2">28 sec</td>
                              <td className="border p-2">80th</td>
                              <td className="border p-2">Above Average</td>
                            </tr>
                            <tr>
                              <td className="border p-2">Trail Making Test B</td>
                              <td className="border p-2">65 sec</td>
                              <td className="border p-2">70th</td>
                              <td className="border p-2">Average</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-4">
                        Complete raw data files are available upon request for professional review.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeReportView}>Close</Button>
              <Button onClick={() => handleDownload(viewingReport)}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
