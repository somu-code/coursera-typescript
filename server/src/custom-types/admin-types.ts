export type Admin = {
  id: number;
  email: string;
  name: string | null;
  role: string;
  hashedPassword: string;
} | null;

export type adminPayload = {
  email: string;
  role: string;
};
