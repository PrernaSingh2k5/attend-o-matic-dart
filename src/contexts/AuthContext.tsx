
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const USERS: User[] = [
  {
    id: "t1",
    name: "John Smith",
    email: "teacher@example.com",
    role: "teacher",
  },
  {
    id: "t2",
    name: "Jane Doe",
    email: "teacher2@example.com",
    role: "teacher",
  },
  {
    id: "s1",
    name: "Alex Johnson",
    email: "student@example.com",
    role: "student",
  },
  {
    id: "s2",
    name: "Sam Wilson",
    email: "student2@example.com",
    role: "student",
  },
];

// Mock passwords (in a real app, these would be hashed and stored securely)
const PASSWORDS: Record<string, string> = {
  "teacher@example.com": "password123",
  "teacher2@example.com": "password123",
  "student@example.com": "password123",
  "student2@example.com": "password123",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find user with case-insensitive email comparison
        const foundUser = USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        
        // If user exists, check if the password matches for the user's actual email
        const isValid = foundUser && PASSWORDS[foundUser.email] === password;
        
        if (isValid && foundUser) {
          setUser(foundUser);
          // Store in session storage
          sessionStorage.setItem('user', JSON.stringify(foundUser));
          resolve(true);
        } else {
          console.log("Login failed", { email, foundUser, isValid });
          resolve(false);
        }
        setIsLoading(false);
      }, 800);
    });
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call for registration
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if email already exists (case-insensitive)
        const emailExists = USERS.some((u) => u.email.toLowerCase() === email.toLowerCase());
        
        if (emailExists) {
          resolve(false);
        } else {
          // In a real app, we would make an API call to register the user
          // For this example, we'll just simulate a successful registration
          const newUser: User = {
            id: `${role.charAt(0)}${USERS.length + 1}`,
            name,
            email,
            role,
          };
          
          // In a real implementation, this would update the database
          USERS.push(newUser);
          PASSWORDS[email] = password;
          
          // Auto-login after registration
          setUser(newUser);
          sessionStorage.setItem('user', JSON.stringify(newUser));
          resolve(true);
        }
        setIsLoading(false);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  // Check for existing user session on component mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        sessionStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
