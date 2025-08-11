import { Types } from "mongoose";

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isBlocked?: "BLOCKED" | "UNBLOCKED";
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  createdAt?: Date;
  updatedAt?: Date;
  isAvailable?: boolean;
  approvalStatus?: "pending" | "approved" | "suspended";
  vehicleInfo?: string;
}
