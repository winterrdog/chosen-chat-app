import { Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private readonly server: Server;

  constructor() {
    this.logger.log('ChatGateway initialized');
  }

  handleConnection(client: Socket): void {
    // send all current chat history to new client
    if (chatHistory.length > 0) {
      client.emit('chat-history', { data: chatHistory });
      this.logger.log(`Chat history sent to client: ${client.id}`);
      this.logger.debug(`Chat history: ${chatHistory}`);
    }
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() wsData: Record<string, any>): void {
    this.logger.debug(`Received websocket data: ${JSON.stringify(wsData)}`);

    // update chat history
    const message: string = wsData.data;
    this.logger.debug(`Received message: ${message}`);

    chatHistory.push(message);
    this.logger.debug(`Updated chat history to: ${chatHistory}`);

    // broadcast message to all connected ws clients
    this.server.emit('message', wsData);

    this.logger.log(`Message broadcasted: ${message}`);
  }
}
