import { Link, Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  UserPlus,
  DollarSign,
  Star,
  CheckSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  HelpCircle
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/students", icon: GraduationCap, label: "Students" },
    { path: "/admin/teachers", icon: Users, label: "Teachers" },
    { path: "/admin/subjects", icon: BookOpen, label: "Subjects" },
    { path: "/admin/classes", icon: ClipboardList, label: "Classes" },
    { path: "/admin/schedules", icon: Calendar, label: "Class Schedules" },
    { path: "/admin/enrollments", icon: UserPlus, label: "Enrollments" },
    { path: "/admin/payments", icon: DollarSign, label: "Payments" },
    { path: "/admin/scores", icon: Star, label: "Scores" },
    { path: "/admin/attendance-records", icon: FileText, label: "Attendance Records" },
    { path: "/admin/analysis", icon: BarChart3, label: "Analysis" },
    { path: "/admin/reports", icon: FileText, label: "Reports" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
    { path: "/admin/user-manual", icon: HelpCircle, label: "User Manual" },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${isSidebarOpen ? "w-64" : "w-0"
          } overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dream Institute</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"
          }`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{JSON.parse(localStorage.getItem("user") || "{}").fName || "Admin User"}</p>
                <p className="text-xs text-gray-500">{JSON.parse(localStorage.getItem("user") || "{}").email || "admin@dreaminstitute.com"}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${JSON.parse(localStorage.getItem("user") || "{}").fName || "AdminUser"}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
