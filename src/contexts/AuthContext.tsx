import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const mockUser: User = {
  id: 'usr_1',
  name: 'Alex Rivera',
  role: 'Store Manager',
  email: 'admin@minimart.pro',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0ABdzvIhjWGcc48kMT_9nMtqNkWEJJODqTI6o7Mvq9xAF4zXnNwqryDQxQVB3eUgQw9HKBl89Sb3oRTwMO9BwtNL7ybL1IoPcHAj6QF7IPIGvHnxOUHkJ7qs342Cs_Ucdq40KDXXgaN27d8Gg4Gw8TD5MsdRPGU0LyNGTDVXhJyOoYMIce1B2n3GaAO-UfRnBmmWo2Y7bKWomIDO36Aa8iH4fJC3DGLKk2P027esBxqCd7Gfz0kMt8Phz_0KPZPSfsSXFgkxHPok'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // We can default this to mockUser initially, or null. Let's start as null so Login appears first.
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password?: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In a real app we'd validate credentials. Here we just mock a success state.
    if (email) {
      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
