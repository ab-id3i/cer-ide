import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Subject } from 'rxjs';
import { bufferTime } from 'rxjs/operators';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class Gateway {
  @WebSocketServer()
  server: Server;

  // Ajout du buffer pour les changements de code
  private codeChange$ = new Subject<string>();

  constructor() {
    // Bufferiser les changements toutes les 100 ms
    this.codeChange$
      .pipe(bufferTime(500))
      .subscribe((messages) => {
        // Diffuser chaque message du buffer à tous les clients
        messages.forEach((data) => {
          this.server.emit('codeUpdate', data);
        });
      });
  }

  @SubscribeMessage('codeChange')
  handleCodeChange(@MessageBody() data: string): void {
    // Ajouter le message au buffer
    this.codeChange$.next(data);
  }

  @SubscribeMessage('cursorPositionChange')
  handleCursorPositionChange(@MessageBody() payload: any): void {
    this.server.emit('cursorPositionUpdate', payload);
  }
}
