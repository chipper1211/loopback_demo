import {
  /* inject, */
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import { RestBindings } from '@loopback/rest';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'logging'}})
export class LoggingInterceptor implements Provider<Interceptor> {
  /*
  constructor() {}
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      console.log('log: before-' + invocationCtx.targetName);
      const httpReq = await invocationCtx.get(RestBindings.Http.REQUEST, {optional: true,});
      if (httpReq) {
        console.log('Endpoint being called:', httpReq.path);
      }
      const result = await next();
      // Add post-invocation logic here
      console.log('log: after-' + invocationCtx.targetName);
      return result;
    } catch (err) {
      // Add error handling logic here
      console.error(err);
      throw err;
    }
  }
}
