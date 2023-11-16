import { Injectable } from '@nestjs/common';

const message = 'I have a meeting at 10:00 on the 31st of december with Dillon to discus plans, can you make an event for me';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
