import {repository} from '@loopback/repository';
import {post, get, requestBody, param} from '@loopback/rest';
import {ChatMessage} from '../models';
import {ChatMessageRepository} from '../repositories';

export class ChatController {
  constructor(
    @repository(ChatMessageRepository)
    public chatRepository: ChatMessageRepository,
  ) {}

  @post('/send')
  async sendMessage(@requestBody() chat: ChatMessage) {
    return this.chatRepository.create(chat);
  }

  @get('/messages/{userId}')
  async getMessages(@param.path.number('userId') userId: number) {
    return this.chatRepository.find({where: {receiverId: userId}});
  }
}
