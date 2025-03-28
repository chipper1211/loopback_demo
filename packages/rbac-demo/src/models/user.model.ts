import {Entity, model, property} from '@loopback/repository';
import {EntityWithIdentifier, IAuthUser} from 'loopback4-authentication';
import {UserPermission} from './user-permission.model';
import { UserPermissionsOverride } from 'loopback4-authorization';

@model({
  name: 'users',
})
export class User extends Entity implements IAuthUser, UserPermissionsOverride<string>{
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName?: string;

  @property({
    type: 'number',
    required: true,
    name: 'role_id',
  })
  roleId: number;

  @property({
    type: 'array',
    itemType: 'object',
  })
  permissions: UserPermission[];

  getIdentifier(): string | undefined {
    return this.id.toString() ??  0;
  }

  getIdObject(): object {
    return {id: this.id};
  }

  getUserId(): string | number {
    return this.id ?? 0;
  }

  constructor(data?: Partial<User>) {
    super(data);
  }
}