export type User = {
  id: number;
  email: string;
  hashedPassword: string;
  name: string | null;
  role: string;
} | null;

export type userPayload = {
  id: number;
  email: string;
  role: string;
};
