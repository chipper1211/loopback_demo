import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  FindRoute,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => Promise.resolve(true);

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) {}

  async handle(context: RequestContext): Promise<void> {
    try {
      const {request, response} = context;
      
      // Invoke middleware - must return a boolean
      const finished = await this.invokeMiddleware(context);
      if (finished) return;
      
      // Find the route
      const route = this.findRoute(request);

      // Authenticate the request
      try {
        // Call authenticateRequest and set the user profile in the context
        const userProfile = await this.authenticateRequest(request);
        if (userProfile) {
          // Only bind if userProfile is not undefined
          context.bind(SecurityBindings.USER).to(userProfile);
        }
      } catch (error) {
        if (
          error.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
          error.code === USER_PROFILE_NOT_FOUND
        ) {
          // The route might not require authentication
          // Let the controller handle it
        } else {
          throw error;
        }
      }

      // Parse the parameters
      const args = await this.parseParams(request, route);
      
      // Invoke the method - the authorize check happens at the controller level
      // via the @requireRoles decorator
      const result = await this.invoke(route, args);
      
      // Send the response
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }
}