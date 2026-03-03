import { toast } from "sonner";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Card, CardContent, Button, Select, Modal, Input } from "../../components/ui";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { apiFetch } from "../../utils/api";

interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  enrollmentDate: string;
}

export default function EnrollmentModule() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [studentsList, setStudentsList] = useState<{ value: string, label: string }[]>([]);
  const [classesList, setClassesList] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    fetchEnrollments();
    fetchDropdowns();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await apiFetch("/enrollments");
      const mapped = response.data.map((e: any) => {
        const s = e.studentId || {};
        const c = e.classId || {};
        const sub = c.subjectId?.subjectName || "Unknown Subject";
        return {
          id: e._id,
          studentId: s.studentNo ? `STU00${s.studentNo}` : s._id || "N/A",
          studentName: `${s.title || ''} ${s.fName || ''} ${s.lName || ''}`.trim(),
          classId: c._id || "1",
          className: `${sub} G${c.grade || ''}`,
          enrollmentDate: e.createdAt ? e.createdAt.split('T')[0] : "N/A"
        };
      });
      setEnrollments(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const sRes = await apiFetch("/students");
      setStudentsList(sRes.data.map((s: any) => ({
        value: s.id,
        label: `${s.studentNo} - ${s.fName} ${s.lName}`
      })));

      const cRes = await apiFetch("/classes");
      setClassesList(cRes.data.map((c: any) => ({
        value: c.id,
        label: `${c.subject?.subjectName || 'Unknown'} G${c.grade}`
      })));
    } catch (e) {
      console.error(e);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");
  const [searchClass, setSearchClass] = useState("");

  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
  });

  const handleAddNew = () => {
    setFormData({
      studentId: "",
      classId: "",
      enrollmentDate: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this enrollment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/enrollments/${id}`, { method: "DELETE" });
        toast.success('Deleted successfully');
        fetchEnrollments();
      } catch (e: any) {
        toast.error(e.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/enrollments", {
        method: "POST",
        body: JSON.stringify({
          studentId: formData.studentId,
          classId: formData.classId,
        })
      });
      toast.success('Saved successfully');
      setIsModalOpen(false);
      fetchEnrollments();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Enrollment failed");
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesStudent = !searchStudent || enrollment.studentName.toLowerCase().includes(searchStudent.toLowerCase()) || enrollment.studentId.toLowerCase().includes(searchStudent.toLowerCase());
    const matchesClass = !searchClass || enrollment.className.toLowerCase().includes(searchClass.toLowerCase());
    return matchesStudent && matchesClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enrollments</h1>
          <p className="text-gray-600 mt-1">Enroll students into classes</p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Student Enrollment
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search student (name or ID)"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search class"
                value={searchClass}
                onChange={(e) => setSearchClass(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Class Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Enrollment Date</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{enrollment.studentId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{enrollment.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{enrollment.className}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{enrollment.enrollmentDate}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(enrollment.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enroll Student"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Select Student"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            options={studentsList}
            required
          />

          <Select
            label="Select Class"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            options={classesList}
            required
          />

          <Input
            label="Enrollment Date"
            type="date"
            value={formData.enrollmentDate}
            onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Enroll Student
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
