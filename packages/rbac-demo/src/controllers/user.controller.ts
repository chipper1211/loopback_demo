import {inject} from '@loopback/core';
import { get, HttpErrors, param, } from '@loopback/rest';
import { AuthenticationBindings, authenticate, } from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKeys} from '../enums/permission-keys.enum';
import {User} from '../models/user.model';
import {MemoryDataProvider} from '../providers/memory-data.provider';

export class UserController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER)
    private currentUser: User,
  ) {}

  @authenticate('bearer')
  @authorize({permissions: [PermissionKeys.ViewOwnUser]})
  @get('/users/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async findMe(): Promise<User> {
    const {password, ...result} = this.currentUser;
    return result as User;
  }

  @authenticate('bearer')
  @authorize({ permissions: [PermissionKeys.ViewAnyUser]})
  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User details by ID',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<User> {
    const user = MemoryDataProvider.findUserById(id);
    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }
    
    const {password, ...result} = user;
    return result as User;
  }

  @authenticate('bearer')
  @authorize({ permissions: [PermissionKeys.ViewAnyUser]})
  @get('/users', {
    responses: {
      '200': {
        description: 'List of all users',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    },
  })
  async find(): Promise<Array<Omit<User, 'password'>>> {
    return MemoryDataProvider.users.map(user => {
      const {password, ...result} = user;
      return result as User;
    });
  }
}