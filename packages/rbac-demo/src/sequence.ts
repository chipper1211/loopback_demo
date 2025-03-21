import {inject} from '@loopback/context';
import { FindRoute, HttpErrors, InvokeMethod, ParseParams, Reject, RequestContext, RestBindings, Send, SequenceHandler, } from '@loopback/rest';
import { AuthenticateFn, AuthenticationBindings, IAuthUser, } from 'loopback4-authentication';
import { AuthorizationBindings, AuthorizeErrorKeys, AuthorizeFn, UserPermissionsFn, } from 'loopback4-authorization';
import {MemoryDataProvider} from './providers/memory-data.provider';
import { CustomAuthUser } from './interfaces/custom-auth-user.interface';
import { User } from './models/user.model';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
    constructor(
      @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
      @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
      @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
      @inject(SequenceActions.SEND) public send: Send,
      @inject(SequenceActions.REJECT) public reject: Reject,
      @inject(AuthenticationBindings.USER_AUTH_ACTION)
      protected authenticateRequest: AuthenticateFn<User>,
      @inject(AuthorizationBindings.AUTHORIZE_ACTION)
      protected checkAuthorization: AuthorizeFn,
      @inject(AuthorizationBindings.USER_PERMISSIONS)
      private readonly getUserPermissions: UserPermissionsFn<string>,
    ) {}
  
    async handle(context: RequestContext) {
      try {
        const {request, response} = context;
        const route = this.findRoute(request);
  
        // Skip authentication for login route
        const skipAuth = route.path === '/auth/login' || 
                         route.path === '/explorer' || 
                         route.path.startsWith('/explorer/');
  
        const args = await this.parseParams(request, route);
        request.body = args[args.length - 1];
  
        let authUser;
        if (!skipAuth) {
          authUser = await this.authenticateRequest(request);
          
          // Get role permissions
          const role = MemoryDataProvider.findRoleById(authUser.roleId);
          if (!role) {
            throw new HttpErrors.Forbidden('Role not found');
          }
  
          // Combine role permissions with user specific permissions
          const permissions = this.getUserPermissions(
            authUser.permissions ?? [],
            role.permissions,
          );
  
          // Check authorization
          const isAccessAllowed: boolean = await this.checkAuthorization(
            permissions,
            request,
          );
  
          if (!isAccessAllowed) {
            throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
          }
        }
  
        const result = await this.invoke(route, args);
        this.send(response, result);
      } catch (err) {
        this.reject(context, err);
      }
    }
  }