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

interface CursorUpdate {
  userId: string;
  userPseudo: string;
  position: {
    lineNumber: number;
    column: number;
  };
  timestamp: number;
}

// Fonction de log conditionnelle
const log = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

@WebSocketGateway({
  cors: { origin: '*' },
})
export class Gateway {
  @WebSocketServer()
  server: Server;

  private codeChange$ = new Subject<CodeChange>();
  private cursorUpdate$ = new Subject<CursorUpdate>();
  private currentVersion = 0;
  private lastUpdate: CodeChange | null = null;

  constructor() {
    log('Gateway initialized');
    
    // Bufferiser les changements toutes les 500ms
    this.codeChange$
      .pipe(
        bufferTime(500),
        map(changes => {
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
          log('Broadcasting update:', this.lastUpdate);
          this.server.emit('codeUpdate', this.lastUpdate);
        }
      });

    // Bufferiser les mises à jour de curseur toutes les 100ms
    this.cursorUpdate$
      .pipe(
        bufferTime(100),
        map(updates => {
          if (updates.length === 0) return [];
          
          // Garder uniquement la dernière mise à jour par utilisateur
          const latestUpdates = new Map<string, CursorUpdate>();
          for (const update of updates) {
            const existing = latestUpdates.get(update.userId);
            if (!existing || update.timestamp > existing.timestamp) {
              latestUpdates.set(update.userId, update);
            }
          }
          
          return Array.from(latestUpdates.values());
        })
      )
      .subscribe((updates) => {
        if (updates.length > 0) {
          for (const update of updates) {
            this.server.emit('cursorPositionUpdate', update);
          }
        }
      });
  }

  @SubscribeMessage('codeChange')
  handleCodeChange(@MessageBody() data: { content: string; userId: string }): void {
    log('Received codeChange:', data);

    if(!data.userId) return;
    if(!data.content) return;
    const change: CodeChange = {
      content: data.content,
      version: this.currentVersion,
      userId: data.userId,
      timestamp: Date.now()
    };
    log('Pushing to buffer:', change);
    this.codeChange$.next(change);
  }

  @SubscribeMessage('cursorPositionChange')
  handleCursorPositionChange(@MessageBody() payload: any): void {
    log('Received cursorPositionChange:', payload);

    if(!payload.userId) return;
    if(!payload.position) return;
    if(!payload.userPseudo) return;

    const update: CursorUpdate = {
      ...payload,
      timestamp: Date.now()
    };
    
    this.cursorUpdate$.next(update);
  }

  @SubscribeMessage('requestVersion')
  handleVersionRequest(): void {
    log('Received version request, current version:', this.currentVersion);
    if (this.lastUpdate) {
      const response = {
        version: this.currentVersion,
        content: this.lastUpdate.content
      };
      log('Sending version update:', response);
      this.server.emit('versionUpdate', response);
    }
  }
}
