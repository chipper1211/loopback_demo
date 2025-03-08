import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';

export class BaseCrudRepository<
  T extends Entity,
  ID,
  Relations extends object = {}
> extends DefaultCrudRepository<T, ID, Relations> {
  
  constructor(entityClass: typeof Entity & {prototype: T}, dataSource: juggler.DataSource) {
    super(entityClass, dataSource);
  }
}
