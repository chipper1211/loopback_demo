import {User} from '../models/user.model';
import {Role} from '../models/role.model';
import {PermissionKeys} from '../enums/permission-keys.enum';
import { UserPermission } from '../models';

export class MemoryDataProvider {
  static users: User[] = [
    new User({
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      roleId: 1,
      permissions: [],
    }),
    new User({
      id: 2,
      username: 'manager',
      email: 'manager@example.com',
      password: 'manager123',
      firstName: 'Manager',
      lastName: 'User',
      roleId: 2,
      permissions: [],
    }),
    new User({
      id: 3,
      username: 'user',
      email: 'user@example.com',
      password: 'user123',
      firstName: 'Regular',
      lastName: 'User',
      roleId: 3,
      permissions: [
        new UserPermission({
          permission: PermissionKeys.ViewAnyUser,
          allowed: true,
        }),
      ],
    }),
  ];

  static roles: Role[] = [
    new Role({
      id: 1,
      name: 'Admin',
      permissions: [
        PermissionKeys.ViewOwnUser,
        PermissionKeys.ViewAnyUser,
        PermissionKeys.CreateUser,
        PermissionKeys.UpdateOwnUser,
        PermissionKeys.UpdateAnyUser,
        PermissionKeys.DeleteUser,
        PermissionKeys.AccessAdminPanel,
        PermissionKeys.ManageRoles,
      ],
    }),
    new Role({
      id: 2,
      name: 'Manager',
      permissions: [
        PermissionKeys.ViewOwnUser,
        PermissionKeys.ViewAnyUser,
        PermissionKeys.UpdateOwnUser,
      ],
    }),
    new Role({
      id: 3,
      name: 'User',
      permissions: [
        PermissionKeys.ViewOwnUser,
        PermissionKeys.UpdateOwnUser,
      ],
    }),
  ];

  static findUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  static findUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }

  static findRoleById(id: number): Role | undefined {
    return this.roles.find(role => role.id === id);
  }
}