import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionInterfaceRepository } from '../../../Domain/Repository/TransactionRepository';
import { GetTransaction, UpdateTransaction } from '../../../Domain/Entitys';
import { AxiosResponse } from 'axios';

@Injectable()
export class TransactionRepository implements TransactionInterfaceRepository {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async getTransaction(idTransaction: string): Promise<GetTransaction> {
    const query = `
    query getTransaaction($idTransaction: String!){
      getTransaction(input:{
        idTransaction:$idTransaction
      }){
        transactionExternalId
        transactionType{
          name
        }
        transactionStatus{
          name
        }
        createdAt
        value
      }
    }
    `;
    const variables = { idTransaction };
    const body = {
      query,
      variables,
    };
    const resultApi: AxiosResponse<GetTransaction> =
      await this.httpService.axiosRef.post(
        this.configService.get<string>('API_TRANSACTIONS'),
        body,
        {
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        },
      );
    const { data } = resultApi;
    return data;
  }
  async updateTransaction(
    idTransaction: string,
    status: string,
  ): Promise<UpdateTransaction> {
    const query = `
    mutation($idTransaction: String!, $status: String!){
      updateTransaction(
          input:{
              idTransaction: $idTransaction,
              status: $status
          }
      ){
          transactionExternalId
      }
    }
    `;
    const variables = { idTransaction, status };
    const body = {
      query,
      variables,
    };
    const resultApi: AxiosResponse<UpdateTransaction> =
      await this.httpService.axiosRef.post(
        this.configService.get<string>('API_TRANSACTIONS'),
        body,
      );
    const { data } = resultApi;
    return data;
  }
}
