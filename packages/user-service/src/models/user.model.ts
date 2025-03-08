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
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  role: RoleEnum;

  @FormattedDate()
  createdon: string;

  @FormattedDate()
  modifiedon: string;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
