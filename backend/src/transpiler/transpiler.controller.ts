import { Controller, Post, Body } from '@nestjs/common';
import { TranspilerService } from './transpiler.service';

@Controller('transpiler')
export class TranspilerController {
  constructor(private readonly transpilerService: TranspilerService) {}

  @Post()
  transpile(@Body('dsl') dslCode: string) {
    const transpiled = this.transpilerService.transpile(dslCode);
    return { transpiled };
  }
}
