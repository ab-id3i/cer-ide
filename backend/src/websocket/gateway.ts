import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class Gateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('codeChange')
  handleCodeChange(@MessageBody() data: string): void {
    // Diffuser à tous les clients sauf l'expéditeur
    this.server.emit('codeUpdate', data);
  }

  @SubscribeMessage('cursorPositionChange')
  handleCursorPositionChange(@MessageBody() payload: any): void {
    this.server.emit('cursorPositionUpdate', payload);
  }
}
