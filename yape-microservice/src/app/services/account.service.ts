import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountEntity, CreateAccountRequest, UpdateAccountRequest } from '../models/account.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

  create(request: CreateAccountRequest): Observable<AccountEntity> {
    return this.http.post<AccountEntity>(this.baseUrl, request);
  }

  getAll(): Observable<AccountEntity[]> {
    return this.http.get<AccountEntity[]>(this.baseUrl);
  }

  getByExternalId(externalId: string): Observable<AccountEntity> {
    return this.http.get<AccountEntity>(`${this.baseUrl}/${externalId}`);
  }

  update(
    externalId: string,
    request: UpdateAccountRequest
  ): Observable<AccountEntity> {
    return this.http.put<AccountEntity>(
      `${this.baseUrl}/${externalId}`,
      request
    );
  }
}