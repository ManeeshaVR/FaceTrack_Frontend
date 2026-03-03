# Dream Institute — Main Portal (Frontend React)

This is the primary user-facing frontend for students and guests of the Dream Institute. It provides access to class information, teacher profiles, and admin/teacher management features.

---

## Tech Stack

| Layer          | Technology                    |
|----------------|-------------------------------|
| **Framework**  | React 18+ (Vite)              |
| **Styling**    | Tailwind CSS                  |
| **Icons**      | Lucide React                  |
| **Navigation** | React Router v6               |
| **Validation** | Zod (for forms)               |
| **HTTP client**| Fetch API / Axios            |

---

## 1) Running locally

### Prerequisites
- Node.js (v18 or higher)
- Backend server running on `http://localhost:4000`

### Setup
1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

---

## 2) Main Features

### Guest View
Users don't need to log in to:
- View all **Class Schedules** (Subject, Day, Time).
- Research **Teacher Profiles** (Education, Experience, Subjects).

### Student Portal
- **Login/Signup**: Students can create an account using the email registered by the administration.
- **My Classes**: View enrolled classes and payment history.
- **Attendance**: View individual attendance logs.

### Admin/Teacher Portal
- **Management Tools**: Access-restricted pages for managing Students, Teachers, Classes, and Enrollments.
- **Score Module**: Record term marks for Grades 9, 10, and 11.
- **Attendance Records**: View and delete attendance logs.

---

## 3) Project Structure

- `src/components/`: Common UI components (Buttons, Input, Modals).
- `src/pages/`: Individual route implementations (Dashboard, Students, Teacher, etc.).
- `src/hooks/`: Custom React hooks for API interaction and state.
- `src/lib/`: Utility functions and shared constants.
- `src/App.tsx`: Routing and higher-level layout.

---

## 4) Known Configurations

- **Backend API URL**: Currently set to `http://localhost:4000/api` in code/proxy. Change `vite.config.ts` or API utility files if the backend port changes.
- **Node Environment**: Use `npm run build` to generate the production bundle in the `dist/` folder.