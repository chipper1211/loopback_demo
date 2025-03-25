import {Entity, model, property, hasOne} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';
import { UserCredentials, UserCredentialsWithRelations } from './user-credentials.model';
import { UserModifiableEntity } from './user-modifiable-entity.model';

@model()
export class User extends UserModifiableEntity implements IAuthUser{
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @hasOne(() => UserCredentials, {keyTo: 'userId'})
  credentials: UserCredentials;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
