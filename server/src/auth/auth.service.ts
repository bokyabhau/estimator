import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { ClientService } from '../database/client/client.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private clientService: ClientService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  /**
   * Authenticate user with email and password
   * Returns JWT token if credentials are valid
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find client by email (includes password field)
    const client = await this.clientService.findByEmail(email);

    if (!client) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await client.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Create JWT payload
    const payload: JwtPayload = {
      sub: client._id.toString(),
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
    };

    // Generate and return JWT token
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: client._id,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
      },
    };
  }

  /**
   * Validate JWT payload
   */
  validatePayload(payload: JwtPayload) {
    return payload;
  }

  /**
   * Google OAuth login
   * Called after Google strategy validates the user
   */
  async googleLogin(client: any) {
    // Create JWT payload
    const payload: JwtPayload = {
      sub: client._id.toString(),
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
    };

    // Generate and return JWT token
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: client._id,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
      },
    };
  }

  /**
   * Verify Google token and authenticate user
   */
  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const googleId = payload.sub;
      const email = payload.email!;
      const firstName = payload.given_name || 'User';
      const lastName = payload.family_name || '';

      // Find or create user
      let client = await this.clientService.findByGoogleId(googleId);

      if (!client) {
        // Create new client from Google profile
        client = await this.clientService.createFromGoogle({
          googleId,
          firstName,
          lastName,
          email,
          phoneNumber: '9999999999', // Placeholder
          address: '', // Placeholder
        });
      }

      return this.googleLogin(client);
    } catch (error) {
      throw new UnauthorizedException('Google token verification failed');
    }
  }
}
