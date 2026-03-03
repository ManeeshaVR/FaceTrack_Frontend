import { toast } from "sonner";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Card, CardContent, Button, Input, Select, Modal, Badge } from "../../components/ui";
import { Plus, Search, Edit, Trash2, Clock, MapPin, Filter } from "lucide-react";
import { apiFetch } from "../../utils/api";

interface Schedule {
  id: string;
  classId: string;
  className: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  classroom: string;
  description: string;
}

export default function ClassScheduleModule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // For dropdown
  const [classesList, setClassesList] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    fetchSchedules();
    fetchClassesData();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await apiFetch("/class-schedules");
      const mappedSchedules = response.data.map((s: any) => {
        const cls = s.classId || {};
        const subjectName = cls.subjectId?.subjectName || "Unknown Subject";
        const grade = cls.grade || "";
        const cName = `${subjectName} G${grade}`;
        return {
          id: s._id,
          classId: cls._id || cls,
          className: cName,
          name: `${cName} Schedule`, // Auto generated info
          day: s.day ? s.day.charAt(0).toUpperCase() + s.day.slice(1) : "Monday",
          startTime: s.startTime,
          endTime: s.endTime,
          classroom: s.classroom,
          description: "N/A", // Backend doesn't support description right now
        };
      });
      setSchedules(mappedSchedules);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClassesData = async () => {
    try {
      const res = await apiFetch("/classes");
      setClassesList(res.data.map((c: any) => {
        const subjectName = c.subject?.subjectName || "Unknown";
        return { value: c.id, label: `${subjectName} G${c.grade}` };
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [filterClass, setFilterClass] = useState("");
  const [filterDay, setFilterDay] = useState("");

  const [formData, setFormData] = useState({
    classId: "",
    name: "",
    day: "Monday",
    startTime: "",
    endTime: "",
    classroom: "",
    description: "",
  });

  const days = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
  ];

  const handleAddNew = () => {
    setEditingSchedule(null);
    setFormData({
      classId: "",
      name: "",
      day: "Monday",
      startTime: "",
      endTime: "",
      classroom: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      classId: schedule.classId,
      name: schedule.name,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      classroom: schedule.classroom,
      description: schedule.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this schedule?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/class-schedules/${id}`, { method: "DELETE" });
        toast.success('Deleted successfully');
        fetchSchedules();
      } catch (e: any) {
        toast.error(e.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        classId: formData.classId,
        classroom: formData.classroom,
        day: formData.day.toLowerCase(),
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      if (editingSchedule) {
        await apiFetch(`/class-schedules/${editingSchedule.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success('Updated successfully');
      } else {
        await apiFetch("/class-schedules", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success('Saved successfully');
      }
      setIsModalOpen(false);
      fetchSchedules();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Operation failed");
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesClass = !filterClass || schedule.classId === filterClass;
    const matchesDay = !filterDay || schedule.day === filterDay;
    return matchesClass && matchesDay;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Schedules</h1>
          <p className="text-gray-600 mt-1">Manage class schedules</p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Add Class Schedule
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select label="Class" placeholder="All" value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              options={classesList}
            />
            <Select label="Day" placeholder="All" value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              options={days}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchedules.map((schedule) => (
          <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{schedule.name}</h3>
                  <p className="text-sm text-gray-500">{schedule.className}</p>
                </div>
                <Badge variant="info">{schedule.day}</Badge>
              </div>

              <p className="text-sm text-gray-600 mb-4">{schedule.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-900">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-gray-900">{schedule.classroom}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  onClick={() => handleEdit(schedule)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(schedule.id)}
                  className="flex-1 text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSchedule ? "Edit Schedule" : "Add Class Schedule"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Class"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            options={classesList}
            required
          />

          <Input
            label="Schedule Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Mathematics G9 Morning"
            required
          />

          <Select
            label="Day"
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
            options={days}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <Input
            label="Classroom"
            value={formData.classroom}
            onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
            placeholder="e.g., Room 101"
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter schedule description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingSchedule ? "Update Schedule" : "Add Schedule"}
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
