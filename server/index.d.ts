type decodedUser = {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

type decodedAdmin = {
  id: number;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
};

declare namespace Express {
  interface Request {
    decodedUser: decodedUser;
    decodedAdmin: decodedAdmin;
  }
}
