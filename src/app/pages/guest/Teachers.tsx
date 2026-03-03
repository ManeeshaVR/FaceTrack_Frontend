import { useState, useEffect } from "react";
import { Card, CardContent, Chip } from "../../components/ui";
import { apiFetch } from "../../utils/api";

export default function GuestTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await apiFetch("/teachers");
      const mapped = response.data.map((t: any) => ({
        id: t.id,
        name: `${t.title || ''} ${t.fName} ${t.lName}`.trim(),
        title: "Teacher",
        classes: t.classes, // Currently backend doesn't list teacher's subjects implicitly, mock empty
        experience: "10 years", // Not stored
        education: "Bsc",  // Not stored
        gender: t.gender ? t.gender.charAt(0).toUpperCase() + t.gender.slice(1) : "Unknown",
      }));
      setTeachers(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getCartoonAvatar = (name: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
  };

  const getGradientColor = (gender: string) => {
    return gender === "Male"
      ? "from-purple-500 to-indigo-500"
      : "from-pink-500 to-rose-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Our Teachers</h1>
        <p className="text-gray-600 mt-1">Meet our experienced and dedicated faculty</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-xl transition-all hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 flex flex-col h-full">
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getGradientColor(teacher.gender)} p-1 shadow-lg`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <img
                      src={getCartoonAvatar(teacher.name)}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                  <p className="text-sm text-gray-600">{teacher.title}</p>
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Subjects:</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.classes.length > 0 ? (
                      teacher.classes.map((cls: string, index: number) => (
                        <Chip key={index}>{cls}</Chip>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">No subjects assigned yet</span>
                    )}
                  </div>
                </div>

                <div className="flex-1"></div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 mt-auto">
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-medium text-gray-900">{teacher.experience}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Education</p>
                    <p className="text-sm font-medium text-gray-900">{teacher.education}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}