import { ArgumentsHost, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

import { Observable } from 'rxjs';

import { KafkaExceptionFilter } from './kafkaException.filter';

describe('KafkaExceptionFilter', () => {
  let kafkaExceptionFilter: KafkaExceptionFilter;

  let argumentsHost: ArgumentsHost;

  let rpcException: RpcException;

  beforeEach(() => {
    kafkaExceptionFilter = new KafkaExceptionFilter();

    argumentsHost = {
      switchToRpc: () => ({
        getContext: () => ({
          getHandler: () => ({
            name: 'getNewTransaction',
          }),
        }),
      }),
    } as ArgumentsHost;

    rpcException = new RpcException('test');
  });

  describe('catch', () => {
    it('should log the exception', () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'warn');

      kafkaExceptionFilter.catch(rpcException, argumentsHost);

      expect(loggerSpy).toHaveBeenCalledWith(rpcException);
    });

    it('should return an observable that throws the exception', () => {
      const observable = kafkaExceptionFilter.catch(
        rpcException,
        argumentsHost,
      );

      expect(observable).toBeInstanceOf(Observable);

      observable.subscribe({
        error: (error) => {
          expect(error).toBe(rpcException.getError());
        },
      });
    });
  });
});
