import { Injectable } from '@nestjs/common';

@Injectable()
export class TranspilerService {
  transpile(dslCode: string): string {
    // 🔹 Pour le POC, on se contente de renvoyer un console.log avec le DSL brut
    return `console.log("Transpiled DSL:", ${JSON.stringify(dslCode)});`;
  }
}
