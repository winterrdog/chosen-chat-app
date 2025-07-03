import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// Store chat history as an object mapping room names to message arrays
const chatHistory: Record<string, { message: string; id: string }[]> = {};

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private readonly server: Server;

  constructor() {
    this.logger.log('ChatGateway initialized');
  }

  handleConnection(@ConnectedSocket() client: Socket): void {
    const room = (client.handshake.query.room as string) || 'general';
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);

    // Send room-specific chat history to the new client
    if (chatHistory[room] && chatHistory[room].length > 0) {
      client.emit('chat-history', { data: chatHistory[room], room: room });
      this.logger.log(
        `Chat history for room ${room} sent to client: ${client.id}`,
      );
      this.logger.debug(
        `Chat history for room ${room}: ${JSON.stringify(chatHistory[room])}`,
      );
    }
    this.logger.log(
      `Client connected: ${client.id} to room ${room}`,
    );
  }

  handleDisconnect(@ConnectedSocket() client: Socket): void {
    // For logging purposes, find out which rooms the client was in.
    // client.rooms is a Set that includes the client's own ID as a room.
    const rooms = Array.from(client.rooms).filter((r) => r !== client.id);
    this.logger.log(
      `Client disconnected: ${client.id}. Was in rooms: ${rooms.join(', ')}`,
    );
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() wsData: { data: string; room: string },
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.debug(
      `Received websocket data from ${client.id}: ${JSON.stringify(wsData)}`,
    );

    const messageContent: string = wsData.data;
    const room: string = wsData.room;

    if (!room) {
      this.logger.warn(`Message received without room from client ${client.id}`);
      return;
    }

    this.logger.debug(
      `Received message for room ${room} from ${client.id}: ${messageContent}`,
    );

    // Initialize history for the room if it doesn't exist
    if (!chatHistory[room]) {
      chatHistory[room] = [];
    }

    const messageObject = { message: messageContent, id: client.id };
    chatHistory[room].push(messageObject);
    this.logger.debug(
      `Updated chat history for room ${room} to: ${JSON.stringify(
        chatHistory[room],
      )}`,
    );

    // Broadcast message to all connected ws clients in the specific room
    this.server
      .to(room)
      .emit('message', { data: messageContent, id: client.id, room: room });

    this.logger.log(
      `Message broadcasted to room ${room}: ${messageContent}`,
    );
  }
}
