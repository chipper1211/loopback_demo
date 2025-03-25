import {Entity, model, property} from '@loopback/repository';

@model()
export class UserModifiableEntity extends Entity {
  @property({
    type: 'number',
    name: 'created_by',
  })
  createdBy?: number;

  @property({
    type: 'number',
    name: 'modified_by',
  })
  modifiedBy?: number;


  constructor(data?: Partial<UserModifiableEntity>) {
    super(data);
  }
}

export interface UserModifiableEntityRelations {
  // describe navigational properties here
}

export type UserModifiableEntityWithRelations = UserModifiableEntity & UserModifiableEntityRelations;
