export type User = {
  id: number;
  email: string;
  name: string | null;
  role: string;
  hashedPassword: string;
} | null;

export type userPayload = {
  email: string;
  role: string;
};
