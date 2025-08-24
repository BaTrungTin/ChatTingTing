import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    await signup(formData);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-32 bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200">
      <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-sm border border-white/30">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/20 transition">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-700/70 mt-1 text-sm">
              Start your journey with us!
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="form-control relative">
            <label className="label text-black">
              <span className="label-text font-semibold text-sm">
                Full Name
              </span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-gray-400" />
              </span>
              <input
                type="text"
                className="input input-bordered w-full pl-9 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white/20 text-black placeholder-gray-500 backdrop-blur-sm text-sm"
                placeholder="Full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            {errors.fullName && (
              <span className="text-red-500 text-xs mt-1">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text font-semibold text-black text-sm">
                Email
              </span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-400" />
              </span>
              <input
                type="email"
                className="input input-bordered w-full pl-9 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white/20 text-black placeholder-gray-500 backdrop-blur-sm text-sm"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text font-semibold text-black text-sm">
                Password
              </span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-9 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white/20 text-black placeholder-gray-500 backdrop-blur-sm text-sm"
                placeholder="••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs mt-1">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full flex items-center justify-center gap-2 text-white font-semibold py-2 rounded-lg hover:bg-primary/90 transition text-sm"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-gray-700/70 mt-4 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
