export type Admin = {
  id: number;
  email: string;
  name: string | null;
  password: string;
} | null;

export type adminPayload = {
  email: string;
  role: string;
};
