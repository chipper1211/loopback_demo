import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
    get,
    HttpErrors,
    param,
    post,
    Request,
    requestBody,
    Response,
    RestBindings,
} from '@loopback/rest';
import {
    authenticate,
    authenticateClient,
    AuthenticationBindings,
    AuthErrorKeys,
    ClientAuthCode,
    STRATEGY,
} from 'loopback4-authentication';
import { User, AuthClient } from '../../models';
import { AuthUser } from './models/auth-user.model';
import { LoginRequest } from './models/login-request.dto';
import * as jwt from 'jsonwebtoken';
import {AuthClientRepository, UserRepository, UserTenantRepository, UserTenantPermissionRepository} from '../../repositories';

export class LoginController {
    constructor(
        @inject(AuthenticationBindings.CURRENT_CLIENT)
        private readonly client: AuthClient | undefined,
        @inject(AuthenticationBindings.CURRENT_USER)
        private readonly user: AuthUser | undefined,
    ) {}

    @authenticateClient(STRATEGY.CLIENT_PASSWORD)
    @authenticate(STRATEGY.LOCAL)
    @post('/auth/login', {
        responses: {
          [STATUS_CODE.OK]: {
            description: 'Auth Code',
            content: {
              [CONTENT_TYPE.JSON]: Object,
            },
          },
        },
      })
      async login(
        @requestBody()
        req: LoginRequest,
      ): Promise<{
        code: string;
      }> {
        if (!this.client || !this.user) {
            throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
          } else if (!req.client_secret) {
            throw new HttpErrors.BadRequest(AuthErrorKeys.ClientSecretMissing);
          }
          try {
            const codePayload: ClientAuthCode<User> = {
              clientId: req.client_id,
              userId: this.user.id,
            };
            const token = jwt.sign(codePayload, this.client.secret, {
              expiresIn: this.client.authCodeExpiration,
              audience: req.client_id,
              subject: req.username,
              issuer: process.env.JWT_ISSUER,
            });
            return {
              code: token,
            };
          } catch (error) {
            throw new HttpErrors.InternalServerError(
              AuthErrorKeys.InvalidCredentials,
            );
          }
      }
}