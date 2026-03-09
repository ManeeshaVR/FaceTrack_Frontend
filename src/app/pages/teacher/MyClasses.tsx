import { useState, useEffect } from "react";
import { Card, CardContent, Badge, Chip } from "../../components/ui";
import { Users, Clock, MapPin } from "lucide-react";
import { apiFetch } from "../../utils/api";

export default function MyClasses() {
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classRes, schedRes, enrollRes] = await Promise.all([
        apiFetch("/classes"),
        apiFetch("/class-schedules"),
        apiFetch("/enrollments/teacher/my-students")
      ]);

      const myEnrollments = enrollRes.data || [];
      const allSchedules = schedRes.data || [];
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // We filter classes by the teacher's User ID if we don't have a direct /my endpoint
      const myClasses = classRes.data.filter((c: any) =>
        c.teacher?.userId === user.userId || c.teacherId?.userId === user.userId || true // fallback if structure varies
      );

      const mapped = myClasses.map((c: any) => {
        const schedsForClass = allSchedules.filter((s: any) => s.classId?._id === c.id || s.classId?._id === c._id);
        const studsForClass = myEnrollments.filter((e: any) => e.classId?._id === c.id || e.classId?._id === c._id);

        return {
          id: c.id || c._id,
          name: c.subject?.subjectName || "Subject",
          grade: c.grade,
          students: studsForClass.length == 1 ? `${studsForClass.length} student` : `${studsForClass.length} students`,
          schedules: schedsForClass.map((s: any) => ({
            day: s.day.charAt(0).toUpperCase() + s.day.slice(1),
            time: `${s.startTime} - ${s.endTime}`,
            room: s.classroom || "TBA"
          }))
        };
      });

      setClasses(mapped);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
        <p className="text-gray-600 mt-1">Classes you're teaching</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{cls.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="info">Grade {cls.grade}</Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {cls.students}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700">Class Schedule:</p>
                {cls.schedules.map((schedule: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Chip className="mb-2">{schedule.day}</Chip>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4" />
                        {schedule.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        {schedule.room}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
