import { useState, useEffect } from "react";
import { Card, CardContent, Badge } from "../../components/ui";
import { BookOpen, Users, Clock } from "lucide-react";
import { apiFetch } from "../../utils/api";

export default function GuestClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await apiFetch("/classes");
      const mapped = response.data.map((c: any) => ({
        id: c.id,
        name: c.subject?.subjectName || "Unknown Subject",
        grade: c.grade || "",
        description: c.description || "N/A",
        teacher: c.teacher ? `${c.teacher.fName} ${c.teacher.lName}` : "Unknown Teacher",
        fee: c.fee,
        schedules: c.schedules || [],
        students: c.enrollmentsCount == 1 ? `${c.enrollmentsCount} student` : `${c.enrollmentsCount} students`,
      }));
      setClasses(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Our Classes</h1>
        <p className="text-gray-600 mt-1">Explore our comprehensive course offerings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="info">Grade {cls.grade}</Badge>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{cls.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                {cls.students}
              </div>
              <br></br>

              <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Teacher:</span>
                  <span className="font-medium text-gray-900">{cls.teacher}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Monthly Fee:</span>
                  <span className="font-semibold text-green-600">LKR {cls.fee}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-1">
                {cls.schedules.length > 0 ? (
                  cls.schedules.map((s: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1 text-sm text-gray-600 capitalize">
                      <Clock className="w-3 h-3" />
                      <span>{s.day} : {s.startTime} - {s.endTime}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400">No schedules available</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Interested in enrolling?</h3>
          <p className="text-sm text-blue-700">
            Contact us to learn more about our classes and enrollment process. We offer flexible schedules
            and personalized learning paths for all students.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
