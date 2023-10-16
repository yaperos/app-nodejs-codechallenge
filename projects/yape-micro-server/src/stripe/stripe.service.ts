import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();
const _configService = new ConfigService();

@Injectable()
export class StripeService {
  public stripe;

  constructor() {
    this.stripe = new Stripe(_configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: _configService.get('STRIPE_VERSION'),
    });
  }

  async generateCharge(
    paymentMethod: string,
    stripeUserId: string,
    amount: number,
    currency: string,
    paymentMethodType: string,
  ): Promise<any> {
    try {
      return await this.stripe.paymentIntents.create({
        payment_method: paymentMethod,
        customer: stripeUserId,
        amount: amount * 100,
        currency: currency,
        confirm: true,
        payment_method_types: [paymentMethodType],
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
