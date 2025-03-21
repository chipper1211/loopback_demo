import {BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {sign} from 'jsonwebtoken';
import {MemoryDataProvider} from '../providers/memory-data.provider';
import {User} from '../models/user.model';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor() {}

  async login(username: string, password: string): Promise<{token: string}> {
    // Find user
    const user = MemoryDataProvider.findUserByUsername(username);

    if (!user || user.password !== password) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    // Generate token
    const token = sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
        issuer: process.env.JWT_ISSUER,
      },
    );

    return {token};
  }

  async getUserData(userId: number): Promise<User> {
    const user = MemoryDataProvider.findUserById(userId);
    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }
    
    // Remove password for security
    const {password, ...userData} = user;
    return userData as User;
  }
}