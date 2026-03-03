import { toast } from "sonner";
import { Card, CardContent, Button } from "../../components/ui";
import { FileText, Download, Eye } from "lucide-react";

export default function Reports() {
  const reports = [
    {
      id: "1",
      title: "Attendance Report",
      description: "Comprehensive attendance records for all students",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: "2",
      title: "Payment Report",
      description: "Complete payment history and financial records",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      id: "3",
      title: "Enrollment Report",
      description: "Student enrollment statistics and trends",
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      id: "4",
      title: "Class Performance Report",
      description: "Analysis of class performance and student progress",
      icon: FileText,
      color: "bg-yellow-500",
    },
    {
      id: "5",
      title: "Teacher Performance Report",
      description: "Teacher statistics and class management data",
      icon: FileText,
      color: "bg-pink-500",
    },
    {
      id: "6",
      title: "Monthly Summary Report",
      description: "Overall monthly summary of all activities",
      icon: FileText,
      color: "bg-indigo-500",
    },
  ];

  const handleView = (reportTitle: string) => {
    toast.success(`Viewing ${reportTitle}`);
  };

  const handleDownloadPDF = (reportTitle: string) => {
    toast.success(`Downloading ${reportTitle} as PDF`);
  };

  const handleDownloadExcel = (reportTitle: string) => {
    toast.success(`Downloading ${reportTitle} as Excel`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and download various reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 ${report.color} rounded-lg`}>
                  <report.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Eye}
                  onClick={() => handleView(report.title)}
                  className="w-full"
                >
                  View Report
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownloadPDF(report.title)}
                  >
                    PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownloadExcel(report.title)}
                  >
                    Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
