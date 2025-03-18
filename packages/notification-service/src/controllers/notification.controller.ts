import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where, } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody, response, } from '@loopback/rest';
import {Notification} from '../models';
import {NotificationRepository} from '../repositories';

export class NotificationController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository : NotificationRepository,
  ) {}

  @get('/notifications')
  @response(200, {
    description: 'Array of Notification model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Notification, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Notification) filter?: Filter<Notification>,
  ): Promise<Notification[]> {
    return this.notificationRepository.find(filter);
  }

  @post('/send')
  async sendNotification(@requestBody() notification: Notification) {
    return this.notificationRepository.create(notification);
  }

  @get('/user/{userId}')
  async getUserNotifications(@param.path.number('userId') userId: number) {
    return this.notificationRepository.find({where: {userId}});
  }

  @patch('/mark-read/{id}')
  async markAsRead(@param.path.number('id') id: number) {
    return this.notificationRepository.updateById(id, {status: 'read'});
  }
}
