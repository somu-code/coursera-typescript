export type Admin = {
  id: number;
  email: string;
  hashedPassword: string;
  name: string | null;
  role: string;
};

export type adminPayload = {
  id: number;
  email: string;
  role: string;
};
