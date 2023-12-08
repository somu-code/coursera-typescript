export type Admin = {
  id: number;
  email: string;
  name: string | null;
  role: string;
  hashedPassword: string;
} | null;

export type adminPayload = {
  id: number;
  email: string;
  role: string;
};
