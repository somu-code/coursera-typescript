export type Admin = {
  id: number;
  email: string;
  name: string | null;
  role: string;
  password: string;
} | null;

export type adminPayload = {
  email: string;
  role: string;
};
