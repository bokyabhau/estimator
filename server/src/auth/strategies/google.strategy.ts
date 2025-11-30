import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ClientService } from '../../database/client/client.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private clientService: ClientService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails } = profile;

    let client = await this.clientService.findByGoogleId(id);

    if (!client) {
      // Create new client from Google profile
      client = await this.clientService.createFromGoogle({
        googleId: id,
        firstName: name.givenName || name.familyName?.substring(0, 1) || 'User',
        lastName: name.familyName || '',
        email: emails[0].value,
        phoneNumber: '9999999999', // Placeholder for required field
        address: '', // Placeholder for required field
      });
    }

    done(null, client);
  }
}
