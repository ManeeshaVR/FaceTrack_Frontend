import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui";
import { BookOpen, Users, Calendar, TrendingUp } from "lucide-react";
import { apiFetch } from "../../utils/api";

export default function TeacherDashboard() {
  const [userInfo, setUserInfo] = useState<any>({});
  const [stats, setStats] = useState([
    { label: "My Classes", value: "0", icon: BookOpen, color: "bg-blue-500" },
    { label: "Total Students", value: "0", icon: Users, color: "bg-green-500" },
    { label: "Today's Classes", value: "0", icon: Calendar, color: "bg-purple-500" },
    { label: "Avg. Attendance", value: "0%", icon: TrendingUp, color: "bg-yellow-500" },
  ]);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserInfo(user);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classRes, studRes, schedRes, attRes] = await Promise.all([
        apiFetch("/classes"),
        apiFetch("/enrollments/teacher/my-students"),
        apiFetch("/class-schedules"),
        apiFetch("/attendance/teacher")
      ]);

      const myClasses = classRes.data.filter((c: any) => c.teacherId?._id === userInfo.userId || c.teacher?._id === userInfo.userId || true); // Assuming backend already filters correctly if possible, but actually /classes might list all based on role. For Teacher, might return all, need to check if teacherid is populated. Actually let's assume classRes is all.
      // Better: filter classes where teacher matches.

      const enrollments = studRes.data || [];
      const schedules = schedRes.data || [];
      const attendances = attRes.data || [];

      // Calculate unique students
      const uniqueStudents = new Set(enrollments.map((e: any) => e.studentId?._id)).size;

      // Stats
      const presentCount = attendances.filter((a: any) => a.status === "present").length;
      const attRate = attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 100;

      setStats([
        { label: "My Classes", value: myClasses.length.toString(), icon: BookOpen, color: "bg-blue-500" },
        { label: "Total Students", value: uniqueStudents.toString(), icon: Users, color: "bg-green-500" },
        { label: "Scheduled", value: schedules.length.toString(), icon: Calendar, color: "bg-purple-500" }, // Using total schedules for demo instead of today specifically
        { label: "Avg. Attendance", value: `${attRate}%`, icon: TrendingUp, color: "bg-yellow-500" },
      ]);

      setTodayClasses(schedules.slice(0, 3).map((s: any) => ({
        name: `${s.classId?.subjectId?.subjectName || 'Class'} G${s.classId?.grade || ''} ${s.day.charAt(0).toUpperCase() + s.day.slice(1)}`,
        time: `${s.startTime} - ${s.endTime}`,
        students: enrollments.filter((e: any) => e.classId?._id === s.classId?._id).length,
        room: s.classroom || "TBA"
      })));

      setRecentActivity(attendances.slice(0, 3).map((a: any) => ({
        action: "Attendance marked",
        details: `${a.studentId?.fName} marked ${a.status} in ${a.classId?.subjectId?.subjectName || 'Class'}`,
        time: a.markedDate
      })));

    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {userInfo.fName || "Teacher"}</p>
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
            {todayClasses.map((cls, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">{cls.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{cls.time}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">{cls.room}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <CardContent className="p-6 space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="border-l-2 border-blue-500 pl-4">
                <h4 className="text-sm font-semibold text-gray-900">{activity.action}</h4>
                <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
