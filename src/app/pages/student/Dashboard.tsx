import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui";
import { BookOpen, Calendar, CheckCircle, DollarSign, User } from "lucide-react";
import { apiFetch } from "../../utils/api";

export default function StudentDashboard() {
  const [userInfo, setUserInfo] = useState<any>({});
  const [stats, setStats] = useState([
    { label: "Enrolled Classes", value: "0", icon: BookOpen, color: "bg-green-500" },
    { label: "Attendance Rate", value: "0%", icon: CheckCircle, color: "bg-blue-500" },
    { label: "Upcoming Classes", value: "0", icon: Calendar, color: "bg-purple-500" },
    { label: "Payment Status", value: "Paid", icon: DollarSign, color: "bg-yellow-500" },
  ]);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserInfo(user);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollRes, attRes, schedRes] = await Promise.all([
        apiFetch("/enrollments/my"),
        apiFetch("/attendance/my"),
        apiFetch("/class-schedules")
      ]);

      const enrollments = enrollRes.data || [];
      const attendances = attRes.data || [];
      const allSchedules = schedRes.data || [];

      // Filter schedules to only those classes the student is enrolled in
      const enrolledClassIds = enrollments.map((e: any) => e.classId?._id?.toString()).filter(Boolean);
      const studentSchedules = allSchedules.filter((s: any) => enrolledClassIds.includes(s.classId?._id?.toString()));

      const presentCount = attendances.filter((a: any) => a.status === "present").length;
      const attRate = attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 100;

      setStats([
        { label: "Enrolled Classes", value: enrollments.length.toString(), icon: BookOpen, color: "bg-green-500" },
        { label: "Attendance Rate", value: `${attRate}%`, icon: CheckCircle, color: "bg-blue-500" },
        { label: "Upcoming Classes", value: studentSchedules.length.toString(), icon: Calendar, color: "bg-purple-500" },
        { label: "Payment Status", value: "Paid", icon: DollarSign, color: "bg-yellow-500" }, // Mocked Payment
      ]);

      setUpcomingClasses(studentSchedules.slice(0, 3).reverse().map((s: any) => ({
        name: `${s.classId?.subjectId?.subjectName || 'Class'} G${s.classId?.grade || ''}`,
        time: `${s.day.charAt(0).toUpperCase() + s.day.slice(1)}, ${s.startTime} - ${s.endTime}`,
        teacher: `${s.classId?.teacherId?.fName || ''} ${s.classId?.teacherId?.lName || ''}`,
        room: s.classroom || "TBA"
      })));

      setRecentAttendance(attendances.slice(0, 3).map((a: any) => ({
        class: `${a.classScheduleId?.classId?.subjectId?.subjectName || 'Class'} G${a.classScheduleId?.classId?.grade || ''}`,
        date: a.markedDate,
        status: a.status.charAt(0).toUpperCase() + a.status.slice(1)
      })));

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {userInfo.fName || "Student"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className={`p-3 rounded-lg ${stat.color} text-white w-fit mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
          </div>
          <CardContent className="p-6 space-y-4">
            {upcomingClasses.map((cls, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">{cls.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{cls.time}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    {cls.teacher}
                  </div>
                  <span className="text-sm font-medium text-green-600">{cls.room}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Attendance</h2>
          </div>
          <CardContent className="p-6 space-y-4">
            {recentAttendance.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{record.class}</h4>
                  <p className="text-xs text-gray-600 mt-1">{record.date}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {record.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
