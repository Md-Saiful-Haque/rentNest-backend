// import { Role } from "../../../prisma/generated/prisma/enums";

import { Role } from "../../../generated/prisma/enums";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
}

export interface IUserLogin {
  email: string;
  password: string;
}