import { useState, useEffect } from "react";
import { Card, CardContent, Badge, Chip } from "../../components/ui";
import { Users, Clock, MapPin, DollarSign } from "lucide-react";
import { apiFetch } from "../../utils/api";

export default function StudentClasses() {
  const [classes, setClasses] = useState<any[]>([]);

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

      const mappedClasses = enrollments.map((e: any) => {
        const c = e.classId || {};
        const subject = c.subjectId || {};
        const teacher = c.teacherId || {};
        const schedsForClass = allSchedules.filter((s: any) => s.classId?._id?.toString() === c._id?.toString());

        return {
          id: e._id,
          name: `${subject.subjectName || "Subject"} G${c.grade || ""}`,
          teacher: `${teacher.fName || "Unknown"} ${teacher.lName || ""}`.trim(),
          fee: c.fee || 0,
          paymentStatus: "Paid", // Demo mock
          schedules: schedsForClass.map((s: any) => ({
            day: s.day.charAt(0).toUpperCase() + s.day.slice(1),
            time: `${s.startTime} - ${s.endTime}`,
            room: s.classroom || "TBA"
          })),
        };
      });

      setClasses(mappedClasses);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
        <p className="text-gray-600 mt-1">Classes you're enrolled in</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{cls.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{cls.teacher}</p>
                </div>
                <Badge variant={cls.paymentStatus === "Paid" ? "success" : "warning"}>
                  {cls.paymentStatus}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Monthly Fee</p>
                  <p className="font-semibold text-gray-900">LKR {cls.fee}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700">Class Schedule:</p>
                {cls.schedules.reverse().map((schedule: any, index: number) => (
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
