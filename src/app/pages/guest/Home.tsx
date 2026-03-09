import { useState, useEffect } from "react";
import { Card, CardContent, Button } from "../../components/ui";
import { GraduationCap, Users, BookOpen, Award, Mail, Phone, MapPin } from "lucide-react";
import { apiFetch } from "../../utils/api";

export default function GuestHome() {
  const [sysStats, setSysStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeClasses: 0,
    years: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiFetch("/dashboard/public");
      setSysStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const stats = [
    { label: "Students", value: sysStats.totalStudents.toString(), icon: GraduationCap, color: "bg-blue-500" },
    { label: "Teachers", value: sysStats.totalTeachers.toString(), icon: Users, color: "bg-purple-500" },
    { label: "Classes", value: sysStats.activeClasses.toString(), icon: BookOpen, color: "bg-green-500" },
    { label: "Years of Excellence", value: sysStats.years.toString(), icon: Award, color: "bg-yellow-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <GraduationCap className="w-16 h-16 text-blue-600" />
          <h1 className="text-5xl font-bold text-gray-900">Dream Institute</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Empowering students to achieve their dreams through quality education and personalized learning
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className={`p-4 rounded-full ${stat.color} text-white w-fit mx-auto mb-4`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* About Section */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Dream Institute</h2>
          <p className="text-gray-600 mb-4">
            Dream Institute is a premier educational institution dedicated to providing high-quality education
            to students in grades 9-11. With state-of-the-art facilities and experienced faculty, we ensure
            that every student receives personalized attention and achieves academic excellence.
          </p>
          <p className="text-gray-600 mb-6">
            Our innovative teaching methods, combined with modern technology including face recognition
            attendance systems, create an environment that fosters learning and growth. We offer a wide range
            of subjects including Mathematics, Physics, Chemistry, Biology, and more.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Our Mission</h3>
              <p className="text-sm text-blue-700">
                To provide quality education that empowers students to reach their full potential
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Our Vision</h3>
              <p className="text-sm text-green-700">
                To be the leading educational institution known for excellence and innovation
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Our Values</h3>
              <p className="text-sm text-purple-700">
                Excellence, Integrity, Innovation, and Student-Centered Learning
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600">info@dreaminstitute.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                <p className="text-gray-600">123 Education Street, Knowledge City, KC 12345</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
        <CardContent className="p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
          <p className="text-lg mb-6 opacity-90">
            Become part of our learning community and start your journey to success
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Enroll Now
            </Button>
            <Button variant="ghost" size="lg" className="text-white border-white border hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
