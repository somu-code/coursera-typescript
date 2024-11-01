import { ReactNode, useState } from "react";
import { UserContext, UserContextType } from "./UserContext";

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
