import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Card, CardContent, Button, Input, Select, Modal, Badge } from "../../components/ui";
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "../../utils/api";

interface Score {
    _id: string; // From backend
    id?: string;
    studentId: any;
    subjectId: any;
    grade: number;
    term: number;
    marks: number;
}

export default function ScoreModule() {
    const [scores, setScores] = useState<Score[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [studentsList, setStudentsList] = useState<{ value: string, label: string }[]>([]);
    const [subjectsList, setSubjectsList] = useState<{ value: string, label: string }[]>([]);

    useEffect(() => {
        fetchScores();
        fetchDropdowns();
    }, []);

    const fetchDropdowns = async () => {
        try {
            const stuRes = await apiFetch("/students");
            setStudentsList(stuRes.data.map((s: any) => ({
                value: s.id,
                label: `${s.studentNo} - ${s.fName} ${s.lName}`
            })));

            const subRes = await apiFetch("/subjects");
            setSubjectsList(subRes.data.map((s: any) => ({
                value: s.id,
                label: `${s.subjectCode} - ${s.subjectName}`
            })));
        } catch (e) {
            console.error(e);
        }
    };

    const fetchScores = async () => {
        try {
            const response = await apiFetch("/scores");
            setScores(response.data);
        } catch (e) {
            console.error(e);
            toast.error("Failed to fetch scores");
        } finally {
            setIsLoading(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterSubject, setFilterSubject] = useState("");
    const [filterGrade, setFilterGrade] = useState("");
    const [filterTerm, setFilterTerm] = useState("");

    const [formData, setFormData] = useState({
        studentId: "",
        subjectId: "",
        grade: "9",
        term: "1",
        marks: "",
    });

    const handleAddNew = () => {
        setFormData({
            studentId: "",
            subjectId: "",
            grade: "9",
            term: "1",
            marks: "",
        });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleEdit = (score: Score) => {
        setFormData({
            studentId: score.studentId?._id || "",
            subjectId: score.subjectId?._id || "",
            grade: String(score.grade),
            term: String(score.term),
            marks: String(score.marks),
        });
        setEditingId(score._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this score?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await apiFetch(`/scores/${id}`, { method: "DELETE" });
                toast.success('Deleted successfully');
                fetchScores();
            } catch (e: any) {
                toast.error(e.message || "Delete failed");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                studentId: formData.studentId,
                subjectId: formData.subjectId,
                grade: Number(formData.grade),
                term: Number(formData.term),
                marks: Number(formData.marks),
            };

            if (editingId) {
                await apiFetch(`/scores/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload)
                });
                toast.success('Updated successfully');
            } else {
                await apiFetch("/scores", {
                    method: "POST",
                    body: JSON.stringify(payload)
                });
                toast.success('Saved successfully');
            }

            setIsModalOpen(false);
            fetchScores();
        } catch (e: any) {
            console.error(e);
            toast.error(e.message || "Operation failed");
        }
    };

    const filteredScores = scores.filter((score) => {
        // Search by student name or no
        const student = score.studentId || {};
        const stuName = `${student.fName || ""} ${student.lName || ""}`.toLowerCase();
        const stuNo = student.studentNo ? String(`STU00${student.studentNo}`).toLowerCase() : "";
        const query = searchQuery.toLowerCase();

        const matchesSearch = !query || stuName.includes(query) || stuNo.includes(query);
        const matchesSubject = !filterSubject || (score.subjectId && score.subjectId._id === filterSubject);
        const matchesGrade = !filterGrade || String(score.grade) === filterGrade;
        const matchesTerm = !filterTerm || String(score.term) === filterTerm;

        return matchesSearch && matchesSubject && matchesGrade && matchesTerm;
    });

    const getCartoonAvatar = (name: string) => {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Scores</h1>
                    <p className="text-gray-600 mt-1">Manage student marks</p>
                </div>
                <Button icon={Plus} onClick={handleAddNew}>
                    Add New Score
                </Button>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Search by student no or name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2 items-center flex-wrap">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <Select label="Subject" placeholder="All" value={filterSubject}
                                onChange={(e) => setFilterSubject(e.target.value)}
                                options={subjectsList}
                            />
                            <Select label="Grade" placeholder="All" value={filterGrade}
                                onChange={(e) => setFilterGrade(e.target.value)}
                                options={[
                                    { value: "9", label: "Grade 9" },
                                    { value: "10", label: "Grade 10" },
                                    { value: "11", label: "Grade 11" },
                                ]}
                            />
                            <Select label="Term" placeholder="All" value={filterTerm}
                                onChange={(e) => setFilterTerm(e.target.value)}
                                options={[
                                    { value: "1", label: "Term 1" },
                                    { value: "2", label: "Term 2" },
                                    { value: "3", label: "Term 3" },
                                ]}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScores.map((score) => {
                    const student = score.studentId || {};
                    const subject = score.subjectId || {};
                    const sName = `${student.fName || "Unknown"} ${student.lName || ""}`;

                    return (
                        <Card key={score._id} className="hover:shadow-xl transition-all hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 flex flex-col h-full">
                            <CardContent className="p-6 flex flex-col flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-sm">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                                <img
                                                    src={getCartoonAvatar(sName)}
                                                    alt={sName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{sName}</h3>
                                            <p className="text-xs text-gray-500">{student.studentNo ? `STU00${student.studentNo}` : "No ID"}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge variant={score.marks >= 50 ? "success" : "danger"}>
                                            {score.marks} Marks
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500">Subject:</span>
                                        <span className="text-gray-900 font-medium">{subject.subjectName || "Unknown"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500">Grade:</span>
                                        <span className="text-gray-900">{score.grade}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500">Term:</span>
                                        <span className="text-gray-900">{score.term}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="flex-1"
                                        icon={Edit}
                                        onClick={() => handleEdit(score)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 p-2"
                                        icon={Trash2}
                                        onClick={() => handleDelete(score._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Score"
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                        label="Student"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        options={studentsList}
                        required
                    />

                    <Select
                        label="Subject"
                        value={formData.subjectId}
                        onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                        options={subjectsList}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Grade"
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            options={[
                                { value: "9", label: "Grade 9" },
                                { value: "10", label: "Grade 10" },
                                { value: "11", label: "Grade 11" },
                            ]}
                            required
                        />
                        <Select
                            label="Term"
                            value={formData.term}
                            onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                            options={[
                                { value: "1", label: "Term 1" },
                                { value: "2", label: "Term 2" },
                                { value: "3", label: "Term 3" },
                            ]}
                            required
                        />
                    </div>

                    <Input
                        label="Marks (0-100)"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.marks}
                        onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                        required
                    />

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">
                            Save Score
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
