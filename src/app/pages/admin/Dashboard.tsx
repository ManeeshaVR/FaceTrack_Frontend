import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui";
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { apiFetch } from "../../utils/api";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>({
    stats: {
      totalStudents: 0,
      totalTeachers: 0,
      activeClasses: 0,
      monthlyRevenue: 0
    },
    recentActivities: []
  });
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const dbRes = await apiFetch("/dashboard");
      setDashboardData(dbRes.data);

      const clsRes = await apiFetch("/class-schedules");
      // Pick first 3 as upcoming for now
      setUpcomingClasses(clsRes.data.slice(0, 3).map((s: any) => ({
        name: `${s.classId?.subjectId?.subjectName || 'Class'} G${s.classId?.grade || ''}`,
        teacher: `${s.classId?.teacherId?.fName || ''} ${s.classId?.teacherId?.lName || ''}`,
        time: `${s.day} ${s.startTime} - ${s.endTime}`,
        students: 0 // Ideally this comes from count of enrollments
      })));
    } catch (e) {
      console.error(e);
    }
  };

  const stats = [
    { label: "Total Students", value: dashboardData.stats.totalStudents, icon: GraduationCap, color: "bg-blue-500", change: "+12%" },
    { label: "Total Teachers", value: dashboardData.stats.totalTeachers, icon: Users, color: "bg-purple-500", change: "+5%" },
    { label: "Active Classes", value: dashboardData.stats.activeClasses, icon: BookOpen, color: "bg-green-500", change: "+8%" },
    { label: "Monthly Revenue", value: `LKR ${dashboardData.stats.monthlyRevenue}`, icon: DollarSign, color: "bg-yellow-500", change: "+15%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <Card className="lg:col-span-2">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">{cls.name}</h4>
                    <p className="text-sm text-gray-600">{cls.teacher}</p>
                    <p className="text-sm text-gray-500 mt-1">{cls.time}</p>
                  </div>
                  <div className="text-right">
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {cls.students} students
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity: any, index: number) => (
                <div key={index} className="border-l-2 border-blue-500 pl-4">
                  <h4 className="text-sm font-semibold text-gray-900">{activity.action}</h4>
                  <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
