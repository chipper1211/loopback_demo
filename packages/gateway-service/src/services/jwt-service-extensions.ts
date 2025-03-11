import {TokenService} from '@loopback/authentication';
import { TokenServiceBindings, UserServiceBindings, User, UserRepository, } from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {promisify} from 'util';
import {RoleEnum} from '../enums/role.enum';
import {MyUserProfile} from '../decorators/user-profile-extensions';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
    @repository(UserRepository) 
    protected userRepository: UserRepository,
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token: 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decodedToken = await verifyAsync(token, this.jwtSecret);
      // don't copy over token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        {[securityId]: '', role: RoleEnum.SUBSCRIBER},
        {
          [securityId]: decodedToken.id,
          id: decodedToken.id,
          role: decodedToken.role,
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token: ${error.message}`,
      );
    }

    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token: userProfile is null',
      );
    }

    // Find the complete user record to get the role
    const userId = userProfile[securityId];
    const user = await this.userRepository.findById(userId);

    // Add role to the token payload
    const userInfoForToken = {
      id: userProfile[securityId],
      role: user.role || RoleEnum.SUBSCRIBER, // Default to SUBSCRIBER if no role is found
      email: user.email,
    };

    // Generate a JSON Web Token
    return signAsync(userInfoForToken, this.jwtSecret, {
      expiresIn: Number(this.jwtExpiresIn),
    });
  }
}