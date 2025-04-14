import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  // other user fields
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const API_URL = 'http://localhost:8000/api'; // Update to your API URL

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for auth info when component mounts
    const loadUser = () => {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For real API calls - update the URL to point to the new endpoint
      try {
        const response = await fetch(`${API_URL}/api/auth/login.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        // Store user in localStorage and state
        if (data.user && data.user.id) {
          localStorage.setItem('user', JSON.stringify(data.user));
          // Add this line to maintain consistency with userService:
          localStorage.setItem('current_user_id', data.user.id.toString());
          setUser(data.user);
        }
        
      } catch (apiError) {
        console.error('API Error:', apiError);
        
        // Fallback for demo/development when API is unavailable
        console.warn('API unavailable, using fallback demo login');
        
        // Demo login logic - remove in production
        if (email === 'admin@example.com' && password === 'password123') {
          const adminUser: User = {
            id: 1,
            username: 'Admin User',
            email: email,
            role: 'admin',
            created_at: new Date().toISOString()
          };
          
          localStorage.setItem('user', JSON.stringify(adminUser));
          localStorage.setItem('current_user_id', adminUser.id.toString());
          setUser(adminUser);
          return;
        }
        
        if (email === 'user@example.com' && password === 'password123') {
          const regularUser: User = {
            id: 2,
            username: 'Regular User',
            email: email,
            role: 'user',
            created_at: new Date().toISOString()
          };
          
          localStorage.setItem('user', JSON.stringify(regularUser));
          localStorage.setItem('current_user_id', regularUser.id.toString());
          setUser(regularUser);
          return;
        }
        
        throw apiError;
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Failed to log in. Please check your credentials and try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { username: string; email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would call the API to register a user
      // For demo purposes, we'll simulate a response
      
      const newUser: User = {
        id: Math.floor(Math.random() * 1000),
        username: data.username,
        email: data.email,
        role: 'user', // New registrations are always regular users
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to register. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('current_user_id');
    setUser(null);
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
