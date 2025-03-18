import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'notificationService',
  connector: 'rest',
  baseURL: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002',
  crud: false,
};

@lifeCycleObserver('datasource')
export class NotificationServiceDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'notificationService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.notificationService', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
