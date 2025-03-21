import {get} from '@loopback/rest';
import { authenticate, } from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKeys} from '../enums/permission-keys.enum';

export class AdminController {
  constructor() {}

  @authenticate('bearer')
  @authorize({ permissions: [PermissionKeys.AccessAdminPanel]})
  @get('/admin/dashboard', {
    responses: {
      '200': {
        description: 'Admin dashboard data',
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
  async getDashboardData(): Promise<object> {
    // In a real application, this would fetch actual dashboard data
    return {
      message: 'Welcome to the admin dashboard',
      stats: {
        totalUsers: 3,
        totalRoles: 3,
        activeUsers: 2,
      },
    };
  }

  @authenticate('bearer')
  @authorize({ permissions: [PermissionKeys.ManageRoles]})
  @get('/admin/roles', {
    responses: {
      '200': {
        description: 'List of roles',
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
  async getRoles(): Promise<object> {
    return {
      roles: [
        {id: 1, name: 'Admin'},
        {id: 2, name: 'Manager'},
        {id: 3, name: 'User'},
      ],
    };
  }
}