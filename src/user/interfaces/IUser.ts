import { EUserRole } from "../enums/EUserRole";

export interface IUser {
  id: string;
  login: string;
  password: string;
  role: EUserRole;
  createdAt: number;
  updatedAt: number;
}