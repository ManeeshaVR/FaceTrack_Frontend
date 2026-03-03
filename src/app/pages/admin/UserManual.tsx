import {
    BookOpen,
    Users,
    GraduationCap,
    Calendar,
    CheckSquare,
    DollarSign,
    Settings,
    HelpCircle,
    ChevronRight,
    Info,
    ShieldCheck,
    Zap
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../components/ui";

export default function UserManual() {
    const sections = [
        {
            title: "Getting Started",
            icon: Zap,
            description: "Quick overview of the Dream Institute Management System.",
            color: "text-amber-500",
            bgColor: "bg-amber-50",
            content: (
                <div className="space-y-4">
                    <p>Welcome to the Dream Institute Admin Portal! This system is designed to streamline your institute's daily operations.</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>Access all modules from the sidebar on the left.</li>
                        <li>Monitor institute performance from the Dashboard.</li>
                        <li>Ensure all required information is filled correctly when creating records.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Student Management",
            icon: GraduationCap,
            description: "Manage student profiles and academic history.",
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            content: (
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Key Features:</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li><strong>Registration:</strong> Add new students with complete details.</li>
                        <li><strong>Search & Filter:</strong> Find students by name, ID, or grade.</li>
                        <li><strong>Profile Management:</strong> Update student information and status.</li>
                        <li><strong>Emails:</strong> Students automatically receive a welcome email upon registration.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Academic Operations",
            icon: BookOpen,
            color: "text-purple-500",
            bgColor: "bg-purple-50",
            description: "Manage subjects, classes, and schedules.",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-100 rounded-lg">
                            <h5 className="font-medium mb-2 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-purple-500" /> Subjects
                            </h5>
                            <p className="text-sm text-gray-500 text-left">Define the subjects offered at the institute.</p>
                        </div>
                        <div className="p-4 border border-gray-100 rounded-lg">
                            <h5 className="font-medium mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-500" /> Schedules
                            </h5>
                            <p className="text-sm text-gray-500 text-left">Set up weekly class times and locations.</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">Pro Tip: Always create the Subject and Teacher before creating a new Class.</p>
                </div>
            )
        },
        {
            title: "Financials & Payments",
            icon: DollarSign,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
            description: "Track student fees and institutional income.",
            content: (
                <div className="space-y-4">
                    <p className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100">
                        When a payment is recorded, an automatic confirmation email is sent to the student's registered email address.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>Record monthly tuition fees.</li>
                        <li>Generate payment history for each student.</li>
                        <li>Track pending payments and overdue collections.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Attendance & Performance",
            icon: CheckSquare,
            color: "text-rose-500",
            bgColor: "bg-rose-50",
            description: "Monitor student presence and academic results.",
            content: (
                <div className="space-y-4">
                    <p>Our dual tracking system ensures you always know how your students are performing:</p>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">1</div>
                            <div>
                                <p className="font-medium text-gray-900">Attendance</p>
                                <p className="text-sm text-gray-500 text-left">Mark daily attendance for each class. Records help in analyzing student engagement.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">2</div>
                            <div>
                                <p className="font-medium text-gray-900">Scores</p>
                                <p className="text-sm text-gray-500 text-left">Enter exam and assignment marks. The system automatically calculates averages for reports.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Security & Role Access",
            icon: ShieldCheck,
            color: "text-cyan-500",
            bgColor: "bg-cyan-50",
            description: "Understanding system permissions.",
            content: (
                <div className="space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-2">Admins</p>
                            <p className="text-xs text-gray-600">Full management authority over all modules and settings.</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-left">
                            <p className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-2">Teachers</p>
                            <p className="text-xs text-gray-600">Access to their own schedules and assigned students.</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-left">
                            <p className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-2">Students</p>
                            <p className="text-xs text-gray-600">Access to their own schedules and enrolled classes.</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-left">
                            <p className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-2">Guests</p>
                            <p className="text-xs text-gray-600">Access to view classes and teachers (no access to sensitive information).</p>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Manual & System Guidance</h1>
                    <p className="text-gray-500">Helpful tips and instructions for institute administrators.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-100">
                    <Info className="w-4 h-4" />
                    Version 1.0.0 Stable
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sections.map((section, idx) => (
                    <Card key={idx} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className={`p-6 border-b-0 ${section.bgColor}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-white shadow-sm ${section.color}`}>
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                                    <p className="text-sm text-gray-600 font-medium opacity-80">{section.description}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 bg-white min-h-[160px]">
                            {section.content}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-xl">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-bold">Need more assistance?</h2>
                            <p className="text-blue-100 opacity-90 max-w-md">Our technical support team is available 24/7 to help you with any issues or custom feature requests.</p>
                        </div>
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                            Contact Support
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center py-4">
                <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Last updated: March 2026
                </p>
            </div>
        </div>
    );
}
