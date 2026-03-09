# FaceTrack — Frontend (React)

This is the primary user-facing frontend for the FaceTrack application. It connects to the Node.js backend to provide access to class information, teacher profiles, and extensive administration tools including enrollment handling and score assignment.

---

## 🎨 Tech Stack & Libraries

| Category       | Technology | Description |
| :---           | :--- | :--- |
| **Framework**  | `React 18` (via Vite) | Fast, modern UI development environment. |
| **Routing**    | `react-router` (v7) | Client-side routing with nested layout structures. |
| **Styling**    | `Tailwind CSS` (v4) | Utility-first CSS framework for rapid UI design. |
| **Components** | `Radix UI` & `MUI` | Accessible, unstyled UI primitives combined with Material icons. |
| **Charts**     | `Recharts` | Composable charting library built on React components. |
| **Forms**      | `react-hook-form` | Performant, flexible, and extensible forms with easy-to-use validation. |
| **Alerts**     | `sonner` & `sweetalert2` | Toast notifications and animated dialog alerts. |

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v18 or higher)
- Backend server running locally on `http://localhost:4000`

### 2. Local Environment
Open a terminal in the `frontend` directory and run:

```bash
# Install all dependencies
npm install

# Start the Vite development server
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### 3. Production Build
To generate optimized static assets for deployment:
```bash
npm run build
```
The output will be grouped in the `dist/` directory.

---

## 🧭 Navigation & Role Structure

The application architecture utilizes heavily partitioned, role-based layouts (refer to `src/app/routes.ts`).

### 1. Public Authentication Pages
- **`/`** — Role Selection (Choose between Admin, Teacher, Student, Guest).
- **`/login/:role`** — Login portal handling role-specific JWTs.
- **`/signup/:role`** — Allows user generation (requires system pre-registration by an Admin).

### 2. Administrator Portal (`/admin/*`)
The powerhouse of the application, protected behind `AdminLayout`:
- **Dashboard**: High-level system statistics (`/admin`).
- **User Management**: Add, Edit, Delete Students (`/admin/students`) and Teachers (`/admin/teachers`).
- **Academic Setup**: Manage Subjects (`/admin/subjects`) and Classes (`/admin/classes`).
- **Schedules & Enrollments**: Map classes to timeslots (`/admin/schedules`) and tie students to classes (`/admin/enrollments`).
- **Finance**: Submit and view student payments (`/admin/payments`).
- **Scores**: Assign historical term marks for students in Grades 9, 10, and 11 (`/admin/scores`).
- **Attendance**: Manual attendance controls and log tracking (`/admin/attendance-records`).

### 3. Teacher Portal (`/teacher/*`)
Protected behind `TeacherLayout`:
- **My Classes**: View classes specifically assigned to this teacher.
- **My Students**: View rosters and details of all students linked to the teacher's modules.

### 4. Student Portal (`/student/*`)
Protected behind `StudentLayout`:
- **Dashboard**: Quick overview of student status.
- **My Classes**: View enrolled classes, payment history, and attendance.
- **Schedule**: View personalized weekly timetables.

### 5. Guest Portal (`/guest/*`)
Publicly accessible portal without needing an account (`GuestLayout`):
- **Teachers**: Research academic staff profiles and experience.
- **Classes**: View available subjects, schedules, and tuition fees.

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── components/     # Reusable UI components (Modals, Tables, Inputs, Radix Primitives)
│   ├── pages/          # Full route blocks matching the layout routers
│   │   ├── admin/      # Admin modules (StudentModule.tsx, Dashboard.tsx, etc.)
│   │   ├── guest/      # Public pages
│   │   ├── student/    # Student specific pages
│   │   └── teacher/    # Teacher specific pages
│   ├── utils/          # Formatting tools, API configurations, shared constants
│   ├── App.tsx         # The main entrypoint providing contexts
│   └── routes.ts       # The centralized React Router DOM tree configuration
├── styles/             # Global CSS and Tailwind directives
└── main.tsx            # Vite DOM Mount point
```

---

## 🔌 API Connectivity

By default, the React frontend relies on `http://localhost:4000/api` for all standard operations.
*Note: Operations requiring camera face captures or ML predictions are primarily routed through the separate `ml` React portal mapping to Node.js and the Python backend.*