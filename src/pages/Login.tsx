
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AuthService from "@/services/auth";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset any previous errors
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      await AuthService.login({ email, password });
      
      // Wait slightly for state to update before redirecting
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
      
    } catch (error: any) {
      // Extract error message from the error object
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Invalid email or password. Please try again.";

      setError(errorMessage);
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url('/lovable-uploads/eb75c491-9520-4ace-9a80-86a7a72a2739.png')",
      }}
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/lovable-uploads/41067270-5c65-44fb-8d3b-89fc90445214.png"
              alt="Logo"
              className="w-[400px] h-[200px]"
            />
          </div>
        </div>

        <Card className="bg-white/10 p-1 rounded-lg pixel-border overflow-hidden backdrop-blur-sm border-2 border-white/20">
          <div className="bg-[#1a1f2c]/80 p-6 rounded-lg h-full">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-semibold text-white pixel-font">
                Sign In
              </CardTitle>
              <CardDescription className="text-white/70">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleLogin}>
              <CardContent className="space-y-5">
                {error && (
                  <div className="p-3 text-sm bg-red-500/20 border border-red-500/30 text-red-400 rounded-md">
                    {error}
                  </div>
                )}

                <div className="relative">
                  <div className="absolute left-3 top-3 text-white/60">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-10 h-12 text-base bg-white/10 border border-white/20 text-white focus:border-[#5EF38C]"
                    placeholder="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-3 text-white/60">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-10 pr-10 h-12 text-base bg-white/10 border border-white/20 text-white focus:border-[#5EF38C]"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-white/60 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <Button
                  className="w-full py-6 text-base font-medium bg-[#5EF38C] text-[#1a1f2c] hover:bg-[#5EF38C]/80 pixel-border-sm"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-white/20"></div>
                  <div className="px-4 text-xs text-white/60">OR</div>
                  <div className="flex-1 border-t border-white/20"></div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border border-[#5EF38C] text-[#5EF38C] hover:bg-[#5EF38C]/20 py-6 pixel-border-sm"
                  type="button"
                  disabled={loading}
                  onClick={() => navigate("/register")}
                >
                  Create an account
                </Button>
              </CardContent>
            </form>

            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="text-center text-xs text-white/60">
                Secure access to patient cognitive assessment data
              </div>

              <Button
                variant="ghost"
                className="mt-2 text-white/60 hover:text-[#5EF38C] hover:bg-transparent"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Landing Page
              </Button>
            </CardFooter>
          </div>
        </Card>

        <div className="text-center mt-6 text-sm text-white drop-shadow-md">
          © 2025 Nura. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
