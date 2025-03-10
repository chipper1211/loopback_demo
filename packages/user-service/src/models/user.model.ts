import {Entity, model, property} from '@loopback/repository';
import { RoleEnum } from '../enums/role.enum';
import { FormattedDate } from '../decorators/formatted-date.decorator';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'string',
  })
  role: RoleEnum;

  @FormattedDate()
  createdOn: string;

  @FormattedDate()
  modifiedOn: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;