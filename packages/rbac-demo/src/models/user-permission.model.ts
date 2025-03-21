import {Entity, Model, model, property} from '@loopback/repository';

@model()
export class UserPermission extends Model {
  @property({
    type: 'string',
    required: true,
  })
  permission: string;

  @property({
    type: 'boolean',
    required: true,
  })
  allowed: boolean;


  constructor(data?: Partial<UserPermission>) {
    super(data);
  }
}

export interface UserPermissionRelations {
  // describe navigational properties here
}

export type UserPermissionWithRelations = UserPermission & UserPermissionRelations;
