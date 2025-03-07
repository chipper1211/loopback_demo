import {inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory} from '@loopback/repository';
import {Product} from '../models';
import {DbDataSource} from '../datasources';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Product, dataSource);
  }
}
