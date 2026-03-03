import { toast } from "sonner";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Card, CardContent, Button, Input, Modal } from "../../components/ui";
import { Plus, Search, Edit, Trash2, BookOpen, Users, Calendar } from "lucide-react";
import { apiFetch } from "../../utils/api";

interface Subject {
  id: string;
  code: string;
  name: string;
  description: string;
  studentsCount: number;
  classesCount: number;
  teachersCount: number;
}

export default function SubjectModule() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await apiFetch("/subjects");
      const mappedSubjects = response.data.map((s: any) => ({
        id: s.id,
        code: s.subjectCode,
        name: s.subjectName,
        description: s.description || "",
        studentsCount: s.studentsCount || 0,
        classesCount: s.classesCount || 0,
        teachersCount: s.teachersCount || 0,
      }));
      setSubjects(mappedSubjects);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch subjects");
    } finally {
      setIsLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    code: "", // Note: subjectCode is generated directly by backend during creation
    name: "",
    description: "",
  });

  const handleAddNew = () => {
    setEditingSubject(null);
    setFormData({
      code: "",
      name: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      code: subject.code,
      name: subject.name,
      description: subject.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this subject?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/subjects/${id}`, { method: "DELETE" });
        toast.success('Deleted successfully');
        fetchSubjects();
      } catch (e: any) {
        toast.error(e.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        subjectName: formData.name,
        description: formData.description,
      };

      if (editingSubject) {
        await apiFetch(`/subjects/${editingSubject.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success('Updated successfully');
      } else {
        await apiFetch("/subjects", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success('Saved successfully');
      }
      setIsModalOpen(false);
      fetchSubjects();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Operation failed");
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-600 mt-1">Manage subject records</p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Add New Subject
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by subject name or code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{subject.name}</h3>
                  <p className="text-sm text-gray-500">{subject.code}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{subject.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{subject.studentsCount}</p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{subject.classesCount}</p>
                  <p className="text-xs text-gray-500">Classes</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{subject.teachersCount}</p>
                  <p className="text-xs text-gray-500">Teachers</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  onClick={() => handleEdit(subject)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(subject.id)}
                  className="flex-1 text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? "Edit Subject" : "Add New Subject"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Subject Code (Auto-generated)"
            value={formData.code}
            disabled
            placeholder="Backend generates code automatically"
          />

          <Input
            label="Subject Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Mathematics"
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter subject description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingSubject ? "Update Subject" : "Add Subject"}
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
