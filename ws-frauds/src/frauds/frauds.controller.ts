import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FraudsService } from './frauds.service';
import { EvaluateFraudDto } from './dto/evaluate-fraud.dto';
import axios from 'axios';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { response } from 'express';

@Controller('frauds')
export class FraudsController {
  constructor(private readonly fraudsService: FraudsService) {
    dotenv.config()
  }

  @Post('evaluate')
  evaluate(@Body() evaluateFraudDto: EvaluateFraudDto) {
    var status = "APPROVED";
    if(evaluateFraudDto.value > 1000){
      status = "REJECTED";
    }

    return axios.patch(process.env.WEBSERVICE_TRANSACTIONS+'/transactions/'+evaluateFraudDto.transactionId, {transactionStatus:status}).then(function(axiosResponse) {
      return {status:'Ok'};
    }).catch(function (error) {
      var message = "It's not possible to connect to Transactions API.";
      var code = 500;
      if (error.response) {
        message = error.response.data;
        code = error.response.status;
      }
      throw new HttpException(message, code);
    });
  }

}
