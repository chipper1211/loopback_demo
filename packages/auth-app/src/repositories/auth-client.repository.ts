import {inject} from '@loopback/core';

import {DbDataSource} from '../datasources';
import {AuthClient} from '../models';
import {DefaultSoftCrudRepository} from './default-soft-crud.repository.base';

export class AuthClientRepository extends DefaultSoftCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(AuthClient, dataSource);
  }
}