import { createContext, useContext, useState, type ReactNode } from 'react';

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  stampUrl?: string | null;
  logoUrl?: string | null;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  updateUser: (updates: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  const updateUser = (updates: Partial<UserData>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updates } : null));
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
