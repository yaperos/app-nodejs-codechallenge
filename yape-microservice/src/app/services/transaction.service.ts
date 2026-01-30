import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTransactionRequest, TransactionResponse } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<TransactionResponse[]>(this.baseUrl);
  }

  create(
    request: CreateTransactionRequest
  ): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(this.baseUrl, request);
  }

  getByExternalId(
    externalId: string
  ): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(
      `${this.baseUrl}/${externalId}`
    );
  }
}
