type decodedUser = {
  email: string;
  role: string;
  iat: number;
  exp: number;
};

declare namespace Express {
  interface Request {
    decodedUser?: decodedUser;
  }
}
