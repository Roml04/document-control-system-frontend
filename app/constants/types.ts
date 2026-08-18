import type { USERROLE } from "./enums";

export type UserType = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: USERROLE;
};
