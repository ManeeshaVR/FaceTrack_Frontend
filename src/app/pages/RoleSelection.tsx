import { useNavigate } from "react-router";
import { GraduationCap, Users, BookOpen, UserCircle } from "lucide-react";
import { Card, CardContent } from "../components/ui";

export default function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      id: "admin",
      name: "Admin",
      icon: UserCircle,
      description: "Full access to manage the system",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
    },
    {
      id: "teacher",
      name: "Teacher",
      icon: Users,
      description: "Manage classes and students",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      id: "student",
      name: "Student",
      icon: GraduationCap,
      description: "View classes and schedule",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      id: "guest",
      name: "Guest",
      icon: BookOpen,
      description: "Browse institute information",
      color: "bg-gray-500",
      hoverColor: "hover:bg-gray-600",
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    if (roleId === "guest") {
      navigate("/guest");
    } else {
      navigate(`/login/${roleId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Dream Institute</h1>
          </div>
          <p className="text-lg text-gray-600">Select your role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div className={`p-4 rounded-full ${role.color} ${role.hoverColor} text-white mb-4 transition-colors`}>
                    <role.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {role.name}
                  </h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
