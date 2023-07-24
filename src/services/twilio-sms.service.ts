import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioSmsService {
  private client: Twilio.Twilio;

  constructor() {
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    this.client = Twilio(accountSid, authToken);
  }

  async sendSms(to: string, message: string) {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: '+13186977403',
        to,
      });

      return result;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS');
    }
  }
}
