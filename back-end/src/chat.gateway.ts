import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// add small chat history db
const chatHistory: string[] = [];

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket): void {
    // send all current chat history to new client
    if (chatHistory.length > 0)
      client.emit('chat-history', { data: chatHistory });

    console.log(`[+] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[+] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() wsData: Record<string, any>): void {
    // update chat history
    const message: string = wsData.data;
    chatHistory.push(message);

    // broadcast message to all connected ws clients
    this.server.emit('message', wsData);

    console.log(`[+] Message broadcasted: ${message}`);
  }
}
