import { toast } from "sonner";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Card, CardContent, Button, Input, Select, Modal, Badge } from "../../components/ui";
import { Plus, Search, Edit, Trash2, BookOpen, Users, Calendar, Filter } from "lucide-react";
import { apiFetch } from "../../utils/api";

interface Class {
  id: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  grade: string;
  fee: number;
  studentsCount: number;
  schedulesCount: number;
}

export default function ClassModule() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // For dropdowns
  const [subjects, setSubjects] = useState<{ value: string, label: string }[]>([]);
  const [teachers, setTeachers] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    fetchClasses();
    fetchDropdownData();
  }, []);

  const fetchClasses = async () => {
    try {
      // isActive could be false or true, admin sees all maybe? Let's just fetch all by not passing isActive
      const response = await apiFetch("/classes?isActive=");
      const mappedClasses = response.data.map((c: any) => ({
        id: c.id,
        subjectId: c.subject?._id || c.subject?.id || c.subject,
        subjectName: c.subject?.subjectName || "Unknown Subject",
        teacherId: c.teacher?._id || c.teacher?.id || c.teacher,
        teacherName: c.teacher ? `${c.teacher.title || ''} ${c.teacher.fName || ''} ${c.teacher.lName || ''}`.trim() : "Unknown Teacher",
        grade: String(c.grade),
        fee: c.fee,
        studentsCount: c.enrollmentsCount,
        schedulesCount: c.schedulesCount,
      }));
      setClasses(mappedClasses);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const subRes = await apiFetch("/subjects");
      setSubjects(subRes.data.map((s: any) => ({ value: s.id, label: s.subjectName })));

      const tchRes = await apiFetch("/teachers");
      setTeachers(tchRes.data.map((t: any) => ({ value: t.id, label: `${t.title || ''} ${t.fName || ''} ${t.lName || ''}`.trim() })));
    } catch (e) {
      console.error(e);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterGrade, setFilterGrade] = useState("");

  const [formData, setFormData] = useState({
    subjectId: "",
    teacherId: "",
    grade: "9",
    fee: "",
  });

  const handleAddNew = () => {
    setEditingClass(null);
    setFormData({
      subjectId: "",
      teacherId: "",
      grade: "9",
      fee: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setFormData({
      subjectId: cls.subjectId,
      teacherId: cls.teacherId,
      grade: cls.grade,
      fee: String(cls.fee),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this class?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/classes/${id}`, { method: "DELETE" });
        toast.success('Deleted successfully');
        fetchClasses();
      } catch (e: any) {
        toast.error(e.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        subjectId: formData.subjectId,
        teacherId: formData.teacherId,
        grade: Number(formData.grade),
        fee: Number(formData.fee),
      };

      if (editingClass) {
        await apiFetch(`/classes/${editingClass.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success("Updated successfully");
      } else {
        await apiFetch("/classes", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Saved successfully");
      }
      setIsModalOpen(false);
      fetchClasses();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Operation failed");
    }
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesSubject = !filterSubject || cls.subjectId === filterSubject;
    const matchesTeacher = !filterTeacher || cls.teacherId === filterTeacher;
    const matchesGrade = !filterGrade || cls.grade === filterGrade;
    return matchesSubject && matchesTeacher && matchesGrade;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600 mt-1">Manage class records</p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Add New Class
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select label="Subject" placeholder="All" value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              options={subjects}
            />
            <Select label="Teacher" placeholder="All" value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
              options={teachers}
            />
            <Select label="Grade" placeholder="All" value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              options={[
                { value: "9", label: "Grade 9" },
                { value: "10", label: "Grade 10" },
                { value: "11", label: "Grade 11" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {cls.subjectName} G{cls.grade}
                    </h3>
                    <p className="text-sm text-gray-500">{cls.teacherName}</p>
                  </div>
                </div>
                <Badge variant="info">Grade {cls.grade}</Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Monthly Fee</span>
                  <span className="font-semibold text-gray-900">LKR {cls.fee}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{cls.studentsCount}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{cls.schedulesCount}</p>
                    <p className="text-xs text-gray-500">Schedules</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  onClick={() => handleEdit(cls)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(cls.id)}
                  className="flex-1 text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? "Edit Class" : "Add New Class"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Subject"
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            options={subjects}
            required
          />

          <Select
            label="Teacher"
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            options={teachers}
            required
          />

          <Select
            label="Grade"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            options={[
              { value: "9", label: "Grade 9" },
              { value: "10", label: "Grade 10" },
              { value: "11", label: "Grade 11" },
            ]}
          />

          <Input
            label="Monthly Fee (LKR)"
            type="number"
            value={formData.fee}
            onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
            placeholder="150"
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingClass ? "Update Class" : "Add Class"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
