import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {MemoryDataProvider} from '../providers/memory-data.provider';

export class BearerTokenVerifyProvider implements Provider<VerifyFunction.BearerFn>
{
  constructor() {}

  value(): VerifyFunction.BearerFn {
    return async token => {
      try {
        // Verify token
        const decoded = verify(token, process.env.JWT_SECRET as string, {
          issuer: process.env.JWT_ISSUER,
        }) as {id: number};

        // Find user by ID
        const user = MemoryDataProvider.findUserById(decoded.id);
        if (!user) {
          throw new HttpErrors.Unauthorized('User not found');
        }

        return user;
      } catch (error) {
        throw new HttpErrors.Unauthorized(
          'Invalid token or token has expired',
        );
      }
    };
  }
}