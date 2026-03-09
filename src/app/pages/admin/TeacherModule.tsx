import { toast } from "sonner";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Card, CardContent, Button, Input, Select, Modal, Badge, Chip, Switch } from "../../components/ui";
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react";
import { apiFetch } from "../../utils/api";

interface Teacher {
  id: string;
  teacherNo: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  joinedDate: string;
  active: boolean;
  classes: string[];
}

export default function TeacherModule() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await apiFetch("/teachers");
      const mappedTeachers = response.data.map((t: any) => ({
        id: t.id,
        teacherNo: t.teacherNo,
        firstName: t.fName,
        lastName: t.lName,
        title: t.title || "Mr",
        email: t.email,
        phone: t.phone || "",
        gender: t.gender.charAt(0).toUpperCase() + t.gender.slice(1),
        dateOfBirth: t.dateOfBirth ? t.dateOfBirth.split('T')[0] : "",
        joinedDate: t.joinedDate ? t.joinedDate.split('T')[0] : "",
        active: t.isActive,
        classes: t.classes || [],
      }));
      setTeachers(mappedTeachers);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch teachers");
    } finally {
      setIsLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGender, setFilterGender] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "Mr",
    email: "",
    phone: "",
    gender: "Male",
    dateOfBirth: "",
    joinedDate: new Date().toISOString().split("T")[0],
    active: true,
  });

  const handleAddNew = () => {
    setEditingTeacher(null);
    setFormData({
      firstName: "",
      lastName: "",
      title: "Mr",
      email: "",
      phone: "",
      gender: "Male",
      dateOfBirth: "",
      joinedDate: new Date().toISOString().split("T")[0],
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      title: teacher.title,
      email: teacher.email,
      phone: teacher.phone,
      gender: teacher.gender,
      dateOfBirth: teacher.dateOfBirth,
      joinedDate: teacher.joinedDate,
      active: teacher.active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this teacher?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/teachers/${id}`, { method: "DELETE" });
        toast.success('Deleted successfully');
        fetchTeachers();
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
        joinedDate: formData.joinedDate || null,
        isActive: formData.active,
      };

      if (editingTeacher) {
        await apiFetch(`/teachers/${editingTeacher.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success("Updated successfully");
      } else {
        await apiFetch("/teachers", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Saved successfully");
      }
      setIsModalOpen(false);
      fetchTeachers();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Operation failed");
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.teacherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || (filterStatus === "active" ? teacher.active : !teacher.active);
    const matchesGender = !filterGender || teacher.gender === filterGender;

    return matchesSearch && matchesStatus && matchesGender;
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">Manage teacher records</p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Add New Teacher
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name or teacher ID"
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-xl transition-all hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 flex flex-col h-full">
            <CardContent className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getGradientColor(teacher.gender)} p-1 shadow-lg`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img
                        src={getCartoonAvatar(`${teacher.firstName}${teacher.lastName}`)}
                        alt={`${teacher.firstName} ${teacher.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {teacher.title} {teacher.firstName} {teacher.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{teacher.teacherNo}</p>
                  </div>
                </div>
                <Badge variant={teacher.active ? "success" : "danger"}>
                  {teacher.active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-900 truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-900">{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Gender:</span>
                  <span className="text-gray-900">{teacher.gender}</span>
                </div>
              </div>

              {teacher.classes.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Teaching Classes:</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.classes.map((cls, index) => (
                      <Chip key={index}>{cls}</Chip>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  onClick={() => handleEdit(teacher)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(teacher.id)}
                  className="flex-1 text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Teacher Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? "Edit Teacher" : "Add New Teacher"}
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
                { value: "Dr", label: "Dr" },
                { value: "Prof", label: "Prof" },
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
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required
            />
          </div>

          <Input
            label="Joined Date"
            type="date"
            value={formData.joinedDate}
            onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
            required
          />

          <Switch
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            label="Active Status"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingTeacher ? "Update Teacher" : "Add Teacher"}
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