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
  private server: Server;

  handleConnection(client: Socket): void {
    console.log(`[+] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[+] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() msg: string): void {
    // broadcast message to all connected ws clients
    this.server.emit('message', msg);
    console.log(`[+] Message broadcasted: ${msg}`);
  }
}
