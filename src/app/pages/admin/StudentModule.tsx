import { toast } from "sonner";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Card, CardContent, Button, Input, Select, Modal, Badge, Chip, Switch } from "../../components/ui";
import { Plus, Search, Edit, Trash2, Camera, Filter } from "lucide-react";
import { apiFetch } from "../../utils/api";

interface Student {
  id: string;
  studentNo: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  registeredDate: string;
  grade: string;
  active: boolean;
  classes: string[];
  hasFaceEmbedding: boolean;
}

export default function StudentModule() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await apiFetch("/students");
      const mappedStudents = response.data.map((s: any) => ({
        id: s.id,
        studentNo: s.studentNo,
        firstName: s.fName,
        lastName: s.lName,
        title: s.title || "Mr",
        email: s.email,
        phone: s.phone || "",
        gender: s.gender.charAt(0).toUpperCase() + s.gender.slice(1),
        dateOfBirth: s.dateOfBirth ? String(s.dateOfBirth).substring(0, 10) : "",
        registeredDate: s.registeredDate ? String(s.registeredDate).substring(0, 10) : "",
        grade: String(s.grade),
        active: s.isActive,
        classes: s.classes || [],
        hasFaceEmbedding: s.embeddingsCount > 0,
      }));
      setStudents(mappedStudents);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [cameraState, setCameraState] = useState<"preview" | "captured">("preview");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "Mr",
    email: "",
    phone: "",
    gender: "Male",
    dateOfBirth: "",
    registeredDate: new Date().toISOString().split("T")[0],
    grade: "9",
    active: true,
  });

  const handleAddNew = () => {
    setEditingStudent(null);
    setFormData({
      firstName: "",
      lastName: "",
      title: "Mr",
      email: "",
      phone: "",
      gender: "Male",
      dateOfBirth: "",
      registeredDate: new Date().toISOString().split("T")[0],
      grade: "9",
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      title: student.title,
      email: student.email,
      phone: student.phone,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      registeredDate: student.registeredDate,
      grade: student.grade,
      active: student.active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/students/${id}`, { method: "DELETE" });
        toast.success('Deleted successfully');
        fetchStudents();
      } catch (e: any) {
        toast.error(e.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        fName: formData.firstName,
        lName: formData.lastName,
        title: formData.title,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender.toLowerCase(),
        dateOfBirth: formData.dateOfBirth || null,
        registeredDate: formData.registeredDate || null,
        grade: Number(formData.grade),
        isActive: formData.active,
      };

      if (editingStudent) {
        await apiFetch(`/students/${editingStudent.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success("Updated successfully");
      } else {
        await apiFetch("/students", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Saved successfully");
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Operation failed");
    }
  };

  const handleCapture = () => {
    setCameraState("captured");
  };

  const handleRetake = () => {
    setCameraState("preview");
  };

  const handleSaveEmbedding = () => {
    // Mock saving face embedding
    toast.success("Face embedding saved successfully!");
    setIsCameraModalOpen(false);
    setCameraState("preview");
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.studentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || (filterStatus === "active" ? student.active : !student.active);
    const matchesGender = !filterGender || student.gender === filterGender;
    const matchesGrade = !filterGrade || student.grade === filterGrade;

    return matchesSearch && matchesStatus && matchesGender && matchesGrade;
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage student records</p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Add New Student
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name or student ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select label="Status" placeholder="All" value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
              <Select label="Gender" placeholder="All" value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                ]}
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
          </div>
        </CardContent>
      </Card>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-xl transition-all hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 flex flex-col h-full">
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getGradientColor(student.gender)} p-1 shadow-lg`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img
                        src={getCartoonAvatar(`${student.firstName}${student.lastName}`)}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {student.title} {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{student.studentNo}</p>
                  </div>
                </div>
                <Badge variant={student.active ? "success" : "danger"}>
                  {student.active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-900">{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-900">{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Grade:</span>
                  <span className="text-gray-900">{student.grade}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Gender:</span>
                  <span className="text-gray-900">{student.gender}</span>
                </div>
              </div>

              {student.classes.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Registered Classes:</p>
                  <div className="flex flex-wrap gap-2">
                    {student.classes.map((cls, index) => (
                      <Chip key={index}>{cls}</Chip>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDelete(student.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
                {!student.hasFaceEmbedding && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Camera}
                    onClick={() => setIsCameraModalOpen(true)}
                  >
                    Add Face
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? "Edit Student" : "Add New Student"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              options={[
                { value: "Mr", label: "Mr" },
                { value: "Ms", label: "Ms" },
                { value: "Mrs", label: "Mrs" },
              ]}
            />
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>

          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required
            />
            <Input
              label="Registered Date"
              type="date"
              value={formData.registeredDate}
              onChange={(e) => setFormData({ ...formData, registeredDate: e.target.value })}
              required
            />
          </div>

          <Switch
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            label="Active Status"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingStudent ? "Update Student" : "Add Student"}
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

      {/* Face Embedding Camera Modal */}
      <Modal
        isOpen={isCameraModalOpen}
        onClose={() => {
          setIsCameraModalOpen(false);
          setCameraState("preview");
        }}
        title="Add Face Embeddings"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
            {cameraState === "preview" ? (
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4" />
                <p>Camera preview would appear here</p>
                <p className="text-sm text-gray-400 mt-2">Position your face in the frame</p>
              </div>
            ) : (
              <div className="text-center text-white">
                <div className="w-48 h-48 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl">
                  👤
                </div>
                <p>Photo captured successfully!</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {cameraState === "preview" ? (
              <Button onClick={handleCapture} className="flex-1">
                Capture
              </Button>
            ) : (
              <>
                <Button onClick={handleRetake} variant="secondary" className="flex-1">
                  Retake
                </Button>
                <Button onClick={handleSaveEmbedding} className="flex-1">
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}