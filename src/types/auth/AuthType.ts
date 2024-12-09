export interface AuthLogin {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLogin {
  user: User;
  token: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  role: string;
}
