import { useState, useEffect } from "react";
import { Card, CardContent, Badge } from "../../components/ui";
import { Clock, MapPin, User } from "lucide-react";
import { apiFetch } from "../../utils/api";

export default function StudentSchedule() {
  const [schedule, setSchedule] = useState<{ day: string, classes: any[] }[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollRes, schedRes] = await Promise.all([
        apiFetch("/enrollments/my"),
        apiFetch("/class-schedules")
      ]);

      const enrollments = enrollRes.data || [];
      const allSchedules = schedRes.data || [];
      const enrolledClassIds = enrollments.map((e: any) => e.classId?._id?.toString()).filter(Boolean);

      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const baseSchedule = days.map(day => ({ day, classes: [] as any[] }));

      allSchedules.forEach((s: any) => {
        if (enrolledClassIds.includes(s.classId?._id?.toString())) {
          const capDay = s.day ? s.day.charAt(0).toUpperCase() + s.day.slice(1) : "";
          const targetDay = baseSchedule.find(d => d.day === capDay);
          if (targetDay) {
            targetDay.classes.push({
              name: `${s.classId?.subjectId?.subjectName || 'Class'} G${s.classId?.grade || ''}`,
              teacher: `${s.classId?.teacherId?.fName || ''} ${s.classId?.teacherId?.lName || ''}`,
              time: `${s.startTime} - ${s.endTime}`,
              room: s.classroom || "TBA",
              status: "upcoming"
            });
          }
        }
      });

      // Sort classes by time
      baseSchedule.forEach(day => {
        day.classes.sort((a, b) => a.time.localeCompare(b.time));
      });

      setSchedule(baseSchedule);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-gray-600 mt-1">Your weekly class schedule</p>
      </div>

      <div className="space-y-6">
        {schedule.map((day) => (
          <Card key={day.day}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{day.day}</h2>
                {day.classes.length > 0 ? (
                  <Badge variant="info">{day.classes.length} {day.classes.length === 1 ? "class" : "classes"}</Badge>
                ) : (
                  <Badge variant="neutral">No classes</Badge>
                )}
              </div>
            </div>
            <CardContent className="p-6">
              {day.classes.length > 0 ? (
                <div className="space-y-4">
                  {day.classes.map((cls, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            {cls.teacher}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {cls.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {cls.room}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No classes scheduled for this day</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
