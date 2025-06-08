import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Subject } from 'rxjs';
import { bufferTime, map } from 'rxjs/operators';

interface CodeChange {
  content: string;
  version: number;
  userId: string;
  timestamp: number;
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class Gateway {
  @WebSocketServer()
  server: Server;

  private codeChange$ = new Subject<CodeChange>();
  private currentVersion = 0;
  private lastUpdate: CodeChange | null = null;

  constructor() {
    console.log('Gateway initialized');
    
    // Bufferiser les changements toutes les 500ms
    this.codeChange$
      .pipe(
        bufferTime(500),
        map(changes => {
          console.log('Processing changes:', changes);
          if (changes.length === 0) return [];
          
          // Trier par timestamp
          changes.sort((a, b) => a.timestamp - b.timestamp);
          
          // Appliquer les changements dans l'ordre
          let latestChange = changes[0];
          for (const change of changes) {
            if (change.timestamp > latestChange.timestamp) {
              latestChange = change;
            }
          }
          
          return [latestChange];
        })
      )
      .subscribe((changes) => {
        if (changes.length > 0) {
          const latestChange = changes[0];
          this.currentVersion++;
          this.lastUpdate = {
            ...latestChange,
            version: this.currentVersion
          };
          console.log('Broadcasting update:', this.lastUpdate);
          this.server.emit('codeUpdate', this.lastUpdate);
        }
      });
  }

  @SubscribeMessage('codeChange')
  handleCodeChange(@MessageBody() data: { content: string; userId: string }): void {
    if(!data.userId) return;
    if(!data.content) return;
    console.log('Received codeChange:', data);
    const change: CodeChange = {
      content: data.content,
      version: this.currentVersion,
      userId: data.userId,
      timestamp: Date.now()
    };
    console.log('Pushing to buffer:', change);
    this.codeChange$.next(change);
  }

  @SubscribeMessage('cursorPositionChange')
  handleCursorPositionChange(@MessageBody() payload: any): void {
    console.log('Received cursorPositionChange:', payload);
    this.server.emit('cursorPositionUpdate', payload);
  }

  @SubscribeMessage('requestVersion')
  handleVersionRequest(): void {
    console.log('Received version request, current version:', this.currentVersion);
    if (this.lastUpdate) {
      const response = {
        version: this.currentVersion,
        content: this.lastUpdate.content
      };
      console.log('Sending version update:', response);
      this.server.emit('versionUpdate', response);
    }
  }

  @SubscribeMessage('*')
handleAnyMessage(@MessageBody() data: any, @ConnectedSocket() client: any) {
  console.log('Received ANY message:', data);
}
}
