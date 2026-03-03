import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Card, CardContent, Input, Button } from "../components/ui";
import { apiFetch } from "../utils/api";
import { toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();
  const { role } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== retypePassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiFetch(`/auth/signup/${role}`, {
        method: "POST",
        body: JSON.stringify({ username: email, password }),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Account created successfully!");
      navigate(`/${role}`);
    } catch (err: any) {
      const msg = err.message || "Failed to sign up";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleName = () => {
    return (role || "")?.charAt(0).toUpperCase() + (role || "")?.slice(1);
  };

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
              {getRoleName()} Signup
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label="Retype Password"
                type="password"
                placeholder="Retype your password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Create Account
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to={`/login/${role}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
