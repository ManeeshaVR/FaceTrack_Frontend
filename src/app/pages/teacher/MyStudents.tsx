import { Card, CardContent, Badge, Chip, Input } from "../../components/ui";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api";

export default function MyStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const [enrollRes, attRes] = await Promise.all([
        apiFetch("/enrollments/teacher/my-students"),
        apiFetch("/attendance/teacher")
      ]);

      const enrollments = enrollRes.data || [];
      const attendances = attRes.data || [];

      const mapped = enrollments.map((e: any) => {
        const s = e.studentId || {};
        const c = e.classId || {};
        const subject = c.subjectId || {};

        // Calculate student's attendance in this class
        const studentAtts = attendances.filter((a: any) => a.studentId?._id === s._id && a.classId?._id === c._id);
        const presentCount = studentAtts.filter((a: any) => a.status === "present").length;
        const attPerc = studentAtts.length > 0 ? Math.round((presentCount / studentAtts.length) * 100) : 100;

        return {
          id: s.studentNo ? `STU00${s.studentNo}` : s._id || "N/A",
          name: `${s.title || ''} ${s.fName || ''} ${s.lName || ''}`.trim(),
          grade: c.grade || "N/A",
          class: `${subject.subjectName || 'Class'} G${c.grade || ''}`,
          attendance: `${attPerc}%`,
          status: "active",
          gender: s.gender ? s.gender.charAt(0).toUpperCase() + s.gender.slice(1) : "Unknown",
        };
      });

      // Filter duplicates if a student is in multiple classes but we only want to show unique, or keep them per-class
      // We'll keep per-class since "class" is a field in the card UI
      setStudents(mapped);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAttendanceColor = (attendance: string) => {
    const value = parseInt(attendance);
    if (value >= 90) return "text-green-600";
    if (value >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getCartoonAvatar = (name: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
  };

  const getGradientColor = (gender: string) => {
    return gender === "Male"
      ? "from-blue-500 to-cyan-500"
      : "from-pink-500 to-purple-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-600 mt-1">Students enrolled in your classes</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name or student ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-xl transition-all hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getGradientColor(student.gender)} p-1 shadow-lg`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img
                        src={getCartoonAvatar(student.name)}
                        alt={student.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.id}</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Class:</span>
                  <Chip>{student.class}</Chip>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Grade:</span>
                  <span className="font-medium text-gray-900">{student.grade}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Attendance:</span>
                  <span className={`font-semibold ${getAttendanceColor(student.attendance)}`}>
                    {student.attendance}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}