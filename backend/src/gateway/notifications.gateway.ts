import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private connectedUsers: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  notifyTaskUpdate(task: any) {
    this.server.emit('task-updated', task);
  }

  notifyTaskCreated(task: any) {
    this.server.emit('task-created', task);
  }

  notifyTaskDeleted(taskId: string) {
    this.server.emit('task-deleted', taskId);
  }

  notifyCommentAdded(comment: any) {
    this.server.emit('comment-added', comment);
  }
}
