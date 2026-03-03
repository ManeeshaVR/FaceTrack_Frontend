import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { apiFetch } from "../../utils/api";

export default function Analysis() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dbRes = await apiFetch("/dashboard/analysis");
      const data = dbRes.data;
      setAttendanceData(data.attendanceData || []);
      setEnrollmentData(data.enrollmentData || []);
      setGradeDistribution(data.gradeDistribution || []);
      setRevenueData(data.revenueData || []);
    } catch (e) {
      console.error("Failed to fetch analysis data", e);
    }
  };

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analysis</h1>
        <p className="text-gray-600 mt-1">Data insights and analytics</p>
      </div>

      {/* Attendance Trend */}
      <Card>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Attendance Trend</h2>
          <p className="text-sm text-gray-600">Monthly attendance overview</p>
        </div>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#10B981" name="Present" />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Enrollment Growth */}
        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Student Enrollment Growth</h2>
            <p className="text-sm text-gray-600">Total students over time</p>
          </div>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} name="Students" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Grade Distribution</h2>
            <p className="text-sm text-gray-600">Students by grade level</p>
          </div>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
          <p className="text-sm text-gray-600">Monthly revenue from payments</p>
        </div>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
