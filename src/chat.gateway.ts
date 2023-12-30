import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  private static server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() msg: string): void {
    // broadcast message to all connected ws clients
    ChatGateway.server.emit('message', msg);
  }
}
