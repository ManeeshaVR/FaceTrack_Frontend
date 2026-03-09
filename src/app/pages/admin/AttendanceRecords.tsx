import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Search, Filter, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { Button, Card, CardContent, Input, Select, Badge } from "../../components/ui";
import { apiFetch } from "../../utils/api";

interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  classSchedule: string;
  status: "Present" | "Absent";
  markedTime: string;
}

export default function AttendanceRecords() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dropdown for class schedules
  const [scheduleOptions, setScheduleOptions] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    fetchRecords();
    fetchSchedules();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await apiFetch("/attendance");
      const mapped = response.data.map((r: any) => {
        const student = r.studentId || {};
        const sched = r.classScheduleId || {};
        const cls = r.classId || {};
        const subjectName = cls.subjectId?.subjectName || "Unknown";

        let scheduleLabel = "N/A";
        if (sched.day) {
          scheduleLabel = `${subjectName} G${cls.grade} - ${sched.day.charAt(0).toUpperCase() + sched.day.slice(1)} ${sched.startTime}-${sched.endTime}`;
        }

        return {
          id: r._id,
          date: r.markedDate,
          studentId: student.studentNo ? `STU00${student.studentNo}` : student._id || "N/A",
          studentName: `${student.title || ''} ${student.fName || ''} ${student.lName || ''}`.trim() || "Unknown",
          classSchedule: scheduleLabel,
          status: r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1)) : "Present",
          markedTime: r.markedTime || "-",
        };
      });
      setRecords(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await apiFetch("/class-schedules");
      setScheduleOptions(res.data.map((s: any) => {
        const c = s.classId || {};
        const sub = c.subjectId?.subjectName || "Unknown";
        return {
          value: `${sub} G${c.grade} - ${s.day ? s.day.charAt(0).toUpperCase() + s.day.slice(1) : ''} ${s.startTime}-${s.endTime}`,
          label: `${sub} G${c.grade} - ${s.day ? s.day.charAt(0).toUpperCase() + s.day.slice(1) : ''} ${s.startTime}-${s.endTime}`
        };
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

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
        toast.success("Record deleted successfully");
        fetchRecords();
      } catch (e: any) {
        toast.error(e.message || "Failed to delete record");
      }
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = !filterClass || record.classSchedule === filterClass;
    const matchesStatus = !filterStatus || record.status === filterStatus;
    const matchesDate = !filterDate || record.date === filterDate;

    return matchesSearch && matchesClass && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
        <p className="text-gray-600 mt-1">View and manage attendance records</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search student name or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select label="Class" placeholder="All" value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                options={scheduleOptions}
              />
              <Select label="Status" placeholder="All" value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: "Present", label: "Present" },
                  { value: "Absent", label: "Absent" },
                ]}
              />
              <Input label="Date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-48"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Class Schedule</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Marked Time</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{record.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.studentId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.classSchedule}</td>
                    <td className="px-6 py-4">
                      <Badge variant={record.status === "Present" ? "success" : "danger"}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.markedTime}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 p-2"
                        icon={Trash2}
                        onClick={() => handleDeleteRecord(record.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{filteredRecords.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-green-600">
              {filteredRecords.filter(r => r.status === "Present").length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-red-600">
              {filteredRecords.filter(r => r.status === "Absent").length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Absent</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
