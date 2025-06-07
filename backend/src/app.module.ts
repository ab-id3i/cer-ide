import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Gateway } from './websocket/gateway';
import { TranspilerController } from './transpiler/transpiler.controller';
import { TranspilerService } from './transpiler/transpiler.service';

@Module({
  imports: [],
  controllers: [AppController, TranspilerController],
  providers: [AppService, Gateway, TranspilerService],
})
export class AppModule {}
