import { Link, Outlet, useNavigate, useLocation } from "react-router";
import { Home, Users, BookOpen, LogOut, GraduationCap } from "lucide-react";

export default function GuestLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/guest", icon: Home, label: "Home" },
    { path: "/guest/teachers", icon: Users, label: "Teachers" },
    { path: "/guest/classes", icon: BookOpen, label: "Classes" },
  ];

  const isActive = (path: string) => {
    if (path === "/guest") {
      return location.pathname === "/guest";
    }
    return location.pathname.startsWith(path);
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Dream Institute</h1>
                <p className="text-xs text-gray-500">Guest Portal</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex items-center gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? "bg-gray-800 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Guest Badge & Back to Login */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-800">Guest Mode</p>
              </div>
              <button
                onClick={handleBackToLogin}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Login</span>
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