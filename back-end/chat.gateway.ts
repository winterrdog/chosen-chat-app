import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  private static server: Server;

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
    client.handshake.headers.origin = '*'; // endeavor to limit the domains that can connect to your server
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() msg: string): void {
    // broadcast message to all connected ws clients
    ChatGateway.server.emit('message', msg);
  }
}
