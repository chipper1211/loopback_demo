import {Component, ProviderMap} from '@loopback/core';
import {RoleAuthorizationActionProvider, AUTHORIZATION_ACTION} from '../decorators/role-authorization';

export class AuthorizationComponent implements Component {
  providers?: ProviderMap;

  constructor() {
    this.providers = {
      [AUTHORIZATION_ACTION]: RoleAuthorizationActionProvider,
    };
  }
}