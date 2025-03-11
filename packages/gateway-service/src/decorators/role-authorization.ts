import {
  AuthenticationBindings,
  AuthenticationMetadata,
} from '@loopback/authentication';
import {
  Constructor,
  Context,
  inject,
  MetadataInspector,
  MethodDecoratorFactory,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {HttpErrors} from '@loopback/rest';
import {RoleEnum} from '../enums/role.enum';

export interface RequiredRoles {
  required: RoleEnum[];
}

export const ROLES_KEY = 'roles';

export class RoleAuthorizationMetadata implements RequiredRoles {
  constructor(public required: RoleEnum[]) {}
}

/**
 * Mark a controller method with required roles
 * @param roles - Array of required roles
 */
export function requireRoles(roles: RoleEnum[]) {
  return MethodDecoratorFactory.createDecorator<RoleAuthorizationMetadata>(
    ROLES_KEY,
    new RoleAuthorizationMetadata(roles),
  );
}

export class RoleAuthorizationActionProvider implements Provider<RoleAuthorizationAction> {
  constructor(
    @inject.context()
    private context: Context,
  ) {}

  value(): RoleAuthorizationAction {
    return async (invocationContext, metadata) => {
      const user = await this.context.get<UserProfile>(
        SecurityBindings.USER,
        {optional: true},
      );

      if (!user) {
        throw new HttpErrors.Unauthorized('User not authenticated');
      }

      const roleMetadata = MetadataInspector.getMethodMetadata<RoleAuthorizationMetadata>(
        ROLES_KEY,
        invocationContext.target.constructor,
        invocationContext.methodName,
      );

      if (!roleMetadata) {
        // No role requirements, skip authorization
        return true;
      }

      // Get user role from userProfile
      const userRole = user.role;
      
      if (!userRole) {
        throw new HttpErrors.Forbidden('User role not found');
      }

      // Check if user has required role
      const requiredRoles = roleMetadata.required;
      if (!requiredRoles.includes(userRole as RoleEnum)) {
        throw new HttpErrors.Forbidden(
          `Access denied. Required roles: ${requiredRoles.join(', ')}`,
        );
      }

      return true;
    };
  }
}

/**
 * Interface for the role authorization action
 */
export interface RoleAuthorizationAction {
  (
    invocationContext: any,
    metadata?: any,
  ): ValueOrPromise<boolean>;
}

/**
 * The key used to bind the authorization action
 */
export const AUTHORIZATION_ACTION = 'authorization.action';