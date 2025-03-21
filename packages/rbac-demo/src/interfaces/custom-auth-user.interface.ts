import { IAuthUser } from "loopback4-authentication";
import { UserPermission } from "../models/user-permission.model";

export interface CustomAuthUser extends IAuthUser {
    roleId: number;
    permissions: UserPermission[];
}