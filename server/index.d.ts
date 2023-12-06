type decodedUser = {
  email: string;
  role: string;
  iat: number;
  exp: number;
};

type decodedAdmin = {
  email: string;
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
