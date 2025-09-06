import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthProps {
  mode: "login" | "signup";
  onNavigate: (page: string) => void;
  onAuth: (user: any) => void;
}

export const Auth = ({ mode, onNavigate, onAuth }: AuthProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (mode === "signup") {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Mock authentication
    const mockUser = {
      id: "1",
      name: formData.name || "John Doe",
      email: formData.email,
    };
    
    onAuth(mockUser);
    onNavigate("home");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">E</span>
            </div>
            <h1 className="text-2xl font-bold text-primary">EcoFinds</h1>
          </div>
          <p className="text-muted-foreground">
            {mode === "login" ? "Welcome back!" : "Join our eco-friendly community"}
          </p>
        </div>

        <Card className="card-eco">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {mode === "login" ? "Login" : "Sign Up"}
            </CardTitle>
            <CardDescription>
              {mode === "login" 
                ? "Enter your credentials to access your account"
                : "Create your account to start buying and selling"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`input-eco ${errors.name ? "border-destructive" : ""}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm">{errors.name}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`input-eco ${errors.email ? "border-destructive" : ""}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`input-eco ${errors.password ? "border-destructive" : ""}`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password}</p>
                )}
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`input-eco ${errors.confirmPassword ? "border-destructive" : ""}`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              <Button type="submit" className="btn-eco w-full">
                {mode === "login" ? "Login" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {mode === "login" 
                  ? "Don't have an account?" 
                  : "Already have an account?"
                }
                <button
                  type="button"
                  onClick={() => onNavigate(mode === "login" ? "signup" : "login")}
                  className="ml-2 text-primary hover:underline font-medium"
                >
                  {mode === "login" ? "Sign up" : "Login"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};