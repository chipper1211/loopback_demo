import {inject} from '@loopback/core';
import {User} from '../models/user.model';
import {BaseCrudRepository} from './base-crud.repository';
import {DbDataSource} from '../datasources/db.datasource';

export class UserRepository extends BaseCrudRepository<User, typeof User.prototype.id> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(User, dataSource);
  }
}