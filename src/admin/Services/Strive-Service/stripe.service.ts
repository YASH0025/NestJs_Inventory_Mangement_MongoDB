import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe = new Stripe(
    'sk_test_51OU30tSJk5tk9lfiQHzd17fx48sliJNLVnK27KwyGKBnO9yrQ2a2apn5s2pzrnOdUSiFpFz5nnDReARK4Yvzuocn00uNbSSCXZ',
    {},
  );
  async createCustomer(email: string): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      email,
    });

    return customer;
  }

  async createPaymentIntent(
    amount: number,

    currency: string,
    customerId,
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
    });

    return paymentIntent;
  }
}
