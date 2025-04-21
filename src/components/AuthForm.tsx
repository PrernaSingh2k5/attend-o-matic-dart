
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserRole } from "@/types";
import { useToast } from "@/components/ui/use-toast";

type AuthMode = "login" | "register";

export function AuthForm() {
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim inputs to prevent whitespace issues
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (mode === "login") {
      if (!trimmedEmail || !trimmedPassword) {
        toast({
          title: "Login Failed",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
        return;
      }
      
      const success = await login(trimmedEmail, trimmedPassword);
      if (!success) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        console.log("Login attempt failed for:", trimmedEmail);
      } else {
        console.log("Login successful for:", trimmedEmail);
      }
    } else {
      if (!name.trim()) {
        toast({
          title: "Registration Failed",
          description: "Please enter your name.",
          variant: "destructive",
        });
        return;
      }
      
      if (!trimmedEmail || !trimmedPassword) {
        toast({
          title: "Registration Failed",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
        return;
      }
      
      const success = await register(name.trim(), trimmedEmail, trimmedPassword, role);
      if (!success) {
        toast({
          title: "Registration Failed",
          description: "This email is already registered or there was an error.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    // Reset fields when toggling modes
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader className="bg-dart-blue rounded-t-lg">
        <CardTitle className="text-white text-center">
          {mode === "login" ? "Login to Attend-O-Matic Dart" : "Create An Account"}
        </CardTitle>
        <CardDescription className="text-gray-200 text-center">
          {mode === "login"
            ? "Sign in to your account"
            : "Register to track your attendance"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {mode === "register" && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {mode === "register" && (
              <div className="grid gap-2">
                <Label>Role</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as UserRole)}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher">Teacher</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-dart-blue to-dart-purple"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={toggleMode}>
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </Button>
      </CardFooter>
    </Card>
  );
}
