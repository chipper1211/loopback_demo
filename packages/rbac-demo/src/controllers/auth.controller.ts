import {service} from '@loopback/core';
import {post, requestBody} from '@loopback/rest';
import {AuthService} from '../services/auth.service';

export class AuthController {
  constructor(
    @service(AuthService)
    public authService: AuthService,
  ) {}

  @post('/auth/login', {
    responses: {
      '200': {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: {
                type: 'string',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    credentials: {
      username: string;
      password: string;
    },
  ): Promise<{token: string}> {
    return this.authService.login(credentials.username, credentials.password);
  }
}