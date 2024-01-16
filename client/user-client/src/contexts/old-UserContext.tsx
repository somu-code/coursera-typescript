import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

export type User = {
  email: string;
  name: string;
};

export interface UserContextInterface {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const defaultState = {
  user: {
    name: "",
    email: "",
  },
  setUser: (user: User) => { },
} as UserContextInterface;

export const UserContext = createContext(defaultState);

type UserProvideProps = {
  children: ReactNode;
};

export default function UserProvider({ children }: UserProvideProps) {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
