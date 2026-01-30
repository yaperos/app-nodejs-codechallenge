import { Injectable } from '@angular/core';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private client!: Client;
  private messages = new Subject<string>();
  public messages$ = this.messages.asObservable();

  connect(): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws/notifications'),
      reconnectDelay: 5000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket conectado');

      this.client.subscribe('/topic/transactions', (msg: IMessage) => {
        this.messages.next(msg.body);
      });
    };

    this.client.activate();
  }

  disconnect(): void {
    if (this.client) this.client.deactivate();
  }
}
