import { createContext } from "react";

export interface UserContextType {
  id: number;
  email: string;
  name: string;
  role: string;
}

export const UserContext = createContext<UserContextType | null>(null);
