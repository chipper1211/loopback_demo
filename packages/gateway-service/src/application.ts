import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RestExplorerBindings, RestExplorerComponent, } from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import { RestBindings } from '@loopback/rest';
import { AuthorizationComponent } from './components/authorization.component';
import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {JWTAuthenticationComponent, SECURITY_SCHEME_SPEC, UserServiceBindings, } from '@loopback/authentication-jwt';
import {DbDataSource} from './datasources';
import {RoleAuthorizationActionProvider, AUTHORIZATION_ACTION} from './decorators/role-authorization';

export {ApplicationConfig};

export class GatewayServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.bind(RestBindings.PORT).to(3003);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    //Configure authentication and authorization
    this.configureAuth();

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
  }

  private configureAuth() {
    // Mount authentication system
    this.component(AuthenticationComponent);
    
    // Mount jwt component
    this.component(JWTAuthenticationComponent);

    // Mount authorization component
    this.component(AuthorizationComponent);
    
    // Bind the role authorizer
    this.bind(AUTHORIZATION_ACTION).toProvider(RoleAuthorizationActionProvider);
    
    // Add security spec
    this.addSecuritySpec();
  }

  private addSecuritySpec(): void {
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'Gateway Service API',
        version: '1.0.0',
      },
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      security: [
        {
          jwt: [],
        },
      ],
    });
  }
}
