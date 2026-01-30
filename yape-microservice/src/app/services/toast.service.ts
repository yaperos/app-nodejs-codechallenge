import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _messages = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this._messages.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
    const current = this._messages.getValue();
    const toast: ToastMessage = { text: message, type };
    this._messages.next([...current, toast]);

    setTimeout(() => {
      this._messages.next(this._messages.getValue().filter(t => t !== toast));
    }, duration);
  }
}
