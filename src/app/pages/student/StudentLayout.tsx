import { Link, Outlet, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, BookOpen, Calendar, LogOut, GraduationCap } from "lucide-react";

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/student", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/classes", icon: BookOpen, label: "My Classes" },
    { path: "/student/schedule", icon: Calendar, label: "Schedule" },
  ];

  const isActive = (path: string) => {
    if (path === "/student") {
      return location.pathname === "/student";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Dream Institute</h1>
                <p className="text-xs text-gray-500">Student Portal</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex items-center gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive(item.path)
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{JSON.parse(localStorage.getItem("user") || "{}").title || "Mr"} {JSON.parse(localStorage.getItem("user") || "{}").fName || "John"} {JSON.parse(localStorage.getItem("user") || "{}").lName || "Doe"}</p>
                <p className="text-xs text-gray-500">{JSON.parse(localStorage.getItem("user") || "{}").email || "STU001"}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-sm">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${JSON.parse(localStorage.getItem("user") || "{}").fName || "Student"}${JSON.parse(localStorage.getItem("user") || "{}").lName || ""}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}