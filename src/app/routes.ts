import { createBrowserRouter } from "react-router";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import StudentModule from "./pages/admin/StudentModule";
import TeacherModule from "./pages/admin/TeacherModule";
import SubjectModule from "./pages/admin/SubjectModule";
import ClassModule from "./pages/admin/ClassModule";
import ClassScheduleModule from "./pages/admin/ClassScheduleModule";
import EnrollmentModule from "./pages/admin/EnrollmentModule";
import PaymentModule from "./pages/admin/PaymentModule";
import ScoreModule from "./pages/admin/ScoreModule";
import AttendanceRecords from "./pages/admin/AttendanceRecords";
import Analysis from "./pages/admin/Analysis";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import UserManual from "./pages/admin/UserManual";
import TeacherLayout from "./pages/teacher/TeacherLayout";
import TeacherDashboard from "./pages/teacher/Dashboard";
import MyClasses from "./pages/teacher/MyClasses";
import MyStudents from "./pages/teacher/MyStudents";
import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./pages/student/Dashboard";
import StudentClasses from "./pages/student/MyClasses";
import StudentSchedule from "./pages/student/Schedule";
import GuestLayout from "./pages/guest/GuestLayout";
import GuestHome from "./pages/guest/Home";
import GuestTeachers from "./pages/guest/Teachers";
import GuestClasses from "./pages/guest/Classes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RoleSelection,
  },
  {
    path: "/login/:role",
    Component: Login,
  },
  {
    path: "/signup/:role",
    Component: Signup,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "students", Component: StudentModule },
      { path: "teachers", Component: TeacherModule },
      { path: "subjects", Component: SubjectModule },
      { path: "classes", Component: ClassModule },
      { path: "schedules", Component: ClassScheduleModule },
      { path: "enrollments", Component: EnrollmentModule },
      { path: "payments", Component: PaymentModule },
      { path: "scores", Component: ScoreModule },
      { path: "attendance-records", Component: AttendanceRecords },
      { path: "analysis", Component: Analysis },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
      { path: "user-manual", Component: UserManual },
    ],
  },
  {
    path: "/teacher",
    Component: TeacherLayout,
    children: [
      { index: true, Component: TeacherDashboard },
      { path: "classes", Component: MyClasses },
      { path: "students", Component: MyStudents },
    ],
  },
  {
    path: "/student",
    Component: StudentLayout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "classes", Component: StudentClasses },
      { path: "schedule", Component: StudentSchedule },
    ],
  },
  {
    path: "/guest",
    Component: GuestLayout,
    children: [
      { index: true, Component: GuestHome },
      { path: "teachers", Component: GuestTeachers },
      { path: "classes", Component: GuestClasses },
    ],
  },
]);
