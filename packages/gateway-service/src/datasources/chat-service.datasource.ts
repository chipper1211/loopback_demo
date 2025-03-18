import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'chatService',
  connector: 'rest',
  baseURL: process.env.CHAT_SERVICE_URL || 'http://localhost:3001',
  crud: false,
};

@lifeCycleObserver('datasource')
export class ChatServiceDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'chatService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.chatService', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
