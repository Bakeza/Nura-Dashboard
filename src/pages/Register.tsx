
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthService from "@/services/auth";
import {
  ArrowLeft,
  Building,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Stethoscope,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (!specialty || !licenseNumber) {
      setError("Please provide your specialty and license number");
      return false;
    }

    return true;
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await AuthService.registerAsClinician({
        name,
        email,
        password,
        specialty,
        licenseNumber,
        clinicName,
      });
      
      // Wait slightly for state to update before redirecting
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
      
    } catch (error: any) {
      // Extract error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage:
          "url('/lovable-uploads/eb75c491-9520-4ace-9a80-86a7a72a2739.png')",
      }}
    >
      <div className="w-full max-w-md mt-20">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/lovable-uploads/41067270-5c65-44fb-8d3b-89fc90445214.png"
              alt="Logo"
              className="w-[400px] h-[200px]"
            />
          </div>
        </div>

        <div className="bg-white/10 p-1 rounded-lg pixel-border overflow-hidden backdrop-blur-sm border-2 border-white/20">
          <div className="bg-[#1a1f2c]/80 p-8 rounded-lg h-full">
            <div className="space-y-1 text-center mb-6">
              <h2 className="text-2xl font-semibold text-white pixel-font">
                Clinician Registration
              </h2>
              <p className="text-white/70">
                Register to access the cognitive assessment platform
              </p>
            </div>

            <form onSubmit={handleRegistration} className="space-y-5">
              {error && (
                <div className="p-3 text-sm bg-red-500/20 border border-red-500/30 text-red-400 rounded-md">
                  {error}
                </div>
              )}

              <div className="relative">
                <div className="absolute left-3 top-3 text-white/60">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-white/10 border border-white/20 text-white focus:border-[#5EF38C]"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-3 text-white/60">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-white/10 border border-white/20 text-white focus:border-[#5EF38C]"
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
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 pr-10 bg-white/10 border border-white/20 text-white focus:border-[#5EF38C]"
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
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-3 text-white/60">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-white/10 border border-white/20 text-white focus:border-[#5EF38C]"
                  placeholder="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-3 text-white/60">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-white/10 border border-white/20 text-white focus:border-[#5EF38C]"
                  placeholder="Medical Specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-3 text-white/60">
                  <CreditCard className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-white/10 border border-white/20 text-white focus:border-[#5EF38C]"
                  placeholder="License Number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-3 text-white/60">
                  <Building className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-white/10 border border-white/20 text-white focus:border-[#5EF38C]"
                  placeholder="Clinic Name (Optional)"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button
                className="w-full font-medium mt-4 bg-[#5EF38C] text-[#1a1f2c] hover:bg-[#5EF38C]/80 py-6 pixel-border-sm"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Clinician Account"}
              </Button>

              <div className="text-center text-sm pt-2">
                <span className="text-white/70">Already have an account?</span>{" "}
                <Link
                  to="/login"
                  className="text-[#5EF38C] font-medium hover:underline"
                >
                  Sign In
                </Link>
              </div>
              <div className="text-center text-xs text-white/50">
                By registering, you agree to our Terms of Service and Privacy
                Policy.
              </div>

              <div className="pt-2 flex justify-center">
                <Button
                  variant="ghost"
                  className="text-white/60 hover:text-[#5EF38C] hover:bg-transparent"
                  onClick={() => navigate("/")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Landing Page
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-white drop-shadow-md">
          © 2025 Nura. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Register;
