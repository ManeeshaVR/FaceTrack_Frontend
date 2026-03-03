import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Card, CardContent, Input, Button } from "../components/ui";
import { apiFetch } from "../utils/api";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { role } = useParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (role === 'guest') {
        const data = await apiFetch("/auth/guest", { method: "POST" });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Guest account created successfully!");
        navigate(`/guest`);
        return;
      }
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful!");
      navigate(`/${role}`);
    } catch (err: any) {
      const msg = err.message || "Failed to login";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleName = () => {
    return (role || '')?.charAt(0).toUpperCase() + (role || '')?.slice(1);
  };

  const showSignupLink = role === "teacher" || role === "student";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to role selection
        </button>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <GraduationCap className="w-10 h-10 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dream Institute</h1>
            </div>
            <p className="text-center text-gray-600 mb-8">
              {getRoleName()} Login
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {role !== 'guest' && (
                <>
                  <Input
                    label="Username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </>
              )}

              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>

              {showSignupLink && (
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to={`/signup/${role}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
