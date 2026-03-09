import { toast } from "sonner";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Card, CardContent, Button, Select, Modal, Input } from "../../components/ui";
import { Plus, Search, Trash2, Filter } from "lucide-react";
import { apiFetch } from "../../utils/api";

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  month: string;
  paymentDate: string;
  paidAmount: number;
  description: string;
}

export default function PaymentModule() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [studentsList, setStudentsList] = useState<{ value: string, label: string }[]>([]);
  const [classesList, setClassesList] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    fetchPayments();
    fetchDropdowns();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await apiFetch("/payments");
      const mapped = response.data.map((p: any) => {
        const s = p.studentId || {};
        const c = p.classId || {};
        const sub = c.subjectId?.subjectName || "Unknown Subject";
        return {
          id: p._id,
          studentId: s.studentNo ? `STU00${s.studentNo}` : s._id || "N/A",
          studentName: `${s.title || ''} ${s.fName || ''} ${s.lName || ''}`.trim(),
          classId: c._id || "1",
          className: `${sub} G${c.grade || ''}`,
          month: p.month.charAt(0).toUpperCase() + p.month.slice(1),
          paymentDate: p.paymentDate ? p.paymentDate.split('T')[0] : "N/A",
          paidAmount: p.amount,
          description: p.reference || "",
        };
      });
      setPayments(mapped);
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    month: "January",
    paymentDate: new Date().toISOString().split("T")[0],
    paidAmount: "",
    description: "",
  });

  const months = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const handleAddNew = () => {
    setFormData({
      studentId: "",
      classId: "",
      month: "January",
      paymentDate: new Date().toISOString().split("T")[0],
      paidAmount: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await apiFetch(`/payments/${id}`, { method: "DELETE" });
        toast.success('Deleted successfully');
        fetchPayments();
      } catch (e: any) {
        toast.error(e.message || "Delete failed");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/payments", {
        method: "POST",
        body: JSON.stringify({
          studentId: formData.studentId,
          classId: formData.classId,
          month: formData.month.toLowerCase(),
          amount: Number(formData.paidAmount),
          paymentDate: formData.paymentDate,
          reference: formData.description,
        })
      });
      toast.success('Saved successfully');
      setIsModalOpen(false);
      fetchPayments();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Payment submission failed");
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = !filterClass || payment.classId === filterClass;
    const matchesMonth = !filterMonth || payment.month === filterMonth;
    return matchesSearch && matchesClass && matchesMonth;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Manage student payments</p>
        </div>
        <Button icon={Plus} onClick={handleAddNew}>
          Student Payment
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search student"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select label="Class" placeholder="All" value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                options={classesList}
              />
              <Select label="Month" placeholder="All" value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                options={months}
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Class</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Month</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Payment Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.studentId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.className}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.month}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.paymentDate}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">LKR {payment.paidAmount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.description}</td>
                    <td className="px-6 py-4 text-right flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(payment.id)}
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
        title="Record Payment"
        size="lg"
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

          <Select
            label="Month"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            options={months}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Payment Date"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              required
            />
            <Input
              label="Paid Amount (LKR)"
              type="number"
              value={formData.paidAmount}
              onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter payment description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Record Payment
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
