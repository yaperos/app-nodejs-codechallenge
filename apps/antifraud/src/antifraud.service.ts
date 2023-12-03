import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AntifraudService {
  constructor(@Inject('ANTIFRAUD') private readonly antifraud: any) { }

  confirmed(id: string, value: number) {
    let status = 'pending';
    if (value <= 1000) {
      status = 'approved';
    } else {
      status = 'rejected';
    }

    console.log({ id, status });
    this.antifraud.emit('antifraud.confirmed', JSON.stringify({ id, status }));
  }
}
