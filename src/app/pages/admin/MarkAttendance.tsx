import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Camera, CheckCircle, XCircle, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { Button, Card, CardContent, Select, Switch, Badge } from "../../components/ui";
import { apiFetch } from "../../utils/api";

export default function MarkAttendance() {
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [livenessCheck, setLivenessCheck] = useState(false);
  const [studentState, setStudentState] = useState<"ready" | "notFound" | "found">("ready");

  const [schedulesList, setSchedulesList] = useState<{ value: string, label: string, classId: string }[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schedRes, studRes] = await Promise.all([
        apiFetch("/class-schedules"),
        apiFetch("/students")
      ]);
      setSchedulesList(schedRes.data.map((s: any) => {
        const c = s.classId || {};
        const sub = c.subjectId?.subjectName || "Unknown";
        return {
          value: s._id,
          label: `${sub} G${c.grade} - ${s.day} ${s.startTime}-${s.endTime}`,
          classId: c._id || c,
        };
      }));
      setStudentsList(studRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const [recognizedStudent, setRecognizedStudent] = useState<any>(null);
  const [attendanceLog, setAttendanceLog] = useState<{ id: string, time: string, student: string, status: string }[]>([]);

  const getCartoonAvatar = (name: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
  };

  const getGradientColor = (gender: string) => {
    return gender === "Male"
      ? "from-blue-500 to-cyan-500"
      : "from-pink-500 to-purple-500";
  };

  const handleScan = async () => {
    if (!selectedSchedule) {
      toast.success("Please select a class schedule first");
      return;
    }

    // Mock processing delay for face recognition hardware simulation
    setStudentState("ready");
    setTimeout(async () => {
      const found = Math.random() > 0.3 && studentsList.length > 0;

      if (!found) {
        setStudentState("notFound");
        setTimeout(() => setStudentState("ready"), 3000);
        return;
      }

      const randomStudent = studentsList[Math.floor(Math.random() * studentsList.length)];
      // Normally we check enrollments, but for demo we just assume enrolled and post
      const schedDetails = schedulesList.find(s => s.value === selectedSchedule);

      try {
        const response = await apiFetch("/attendance/mark", {
          method: "POST",
          body: JSON.stringify({
            studentId: randomStudent.id || randomStudent._id,
            classId: schedDetails?.classId,
            classScheduleId: selectedSchedule,
            status: "present",
            method: "face",
          })
        });

        const name = `${randomStudent.title || ''} ${randomStudent.fName} ${randomStudent.lName}`.trim();

        setRecognizedStudent({
          id: randomStudent.studentNo,
          name: name,
          enrolled: true,
          paymentStatus: "Paid",
          accessGranted: true,
          gender: randomStudent.gender,
        });

        setStudentState("found");

        const newLog = {
          id: response.data._id,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          student: name,
          status: "Present",
        };
        setAttendanceLog(prev => [newLog, ...prev]);

      } catch (e: any) {
        console.error(e);
        // Maybe "already marked" or other error
        setStudentState("notFound"); // Mock error as notFound
      }

      setTimeout(() => setStudentState("ready"), 4000);
    }, 1500);
  };

  const handleDeleteRecord = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this attendance record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/attendance/${id}`, { method: "DELETE" });
        setAttendanceLog(prev => prev.filter(log => log.id !== id));
        toast.success("Record deleted successfully");
      } catch (e: any) {
        toast.error(e.message || "Failed to delete record");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-600 mt-1">Face recognition attendance system</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <Select
                label="Select Class Schedule"
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
                options={schedulesList}
              />
            </div>
            <Switch
              checked={livenessCheck}
              onCheckedChange={setLivenessCheck}
              label="Liveness Detection"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Camera View */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <div
                className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden cursor-pointer"
                onClick={handleScan}
              >
                <div className="text-center text-white">
                  <Camera className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Camera preview would appear here</p>
                  <p className="text-sm text-gray-400 mt-2">Click to simulate face scan</p>
                </div>
                {/* Scanning overlay */}
                {studentState !== "ready" && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="text-white text-2xl font-bold">Scanning...</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Info Panel */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6">
              {studentState === "ready" && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Ready to scan</p>
                  <p className="text-sm text-gray-400 mt-2">Position face in camera</p>
                </div>
              )}

              {studentState === "notFound" && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="font-semibold text-red-600 text-lg">Student Not Found</p>
                  <p className="text-sm text-gray-600 mt-2">Face not recognized in database</p>
                </div>
              )}

              {studentState === "found" && recognizedStudent && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getGradientColor(recognizedStudent.gender)} p-1 shadow-lg mx-auto mb-3`}>
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        <img
                          src={getCartoonAvatar(recognizedStudent.name)}
                          alt={recognizedStudent.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900">{recognizedStudent.name}</h3>
                    <p className="text-sm text-gray-500">{recognizedStudent.id}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Enrollment</span>
                      <Badge variant={recognizedStudent.enrolled ? "success" : "danger"}>
                        {recognizedStudent.enrolled ? "Enrolled" : "Not Enrolled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Payment</span>
                      <Badge variant={recognizedStudent.paymentStatus === "Paid" ? "success" : "warning"}>
                        {recognizedStudent.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className={`mt-4 p-4 rounded-lg text-center ${recognizedStudent.accessGranted ? "bg-green-50" : "bg-red-50"}`}>
                    {recognizedStudent.accessGranted ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="font-semibold text-green-700">Access Granted</p>
                        <p className="text-xs text-green-600 mt-1">Attendance marked successfully</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <p className="font-semibold text-red-700">Access Denied</p>
                        <p className="text-xs text-red-600 mt-1">Please contact administration</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance Log */}
      <Card>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Attendance Log (Today)</h2>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceLog.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{log.time}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{log.student}</td>
                    <td className="px-6 py-4">
                      <Badge variant="success">{log.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 p-2"
                        icon={Trash2}
                        onClick={() => handleDeleteRecord(log.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}