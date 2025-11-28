import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientService } from '../database/client/client.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private clientService: ClientService,
  ) {}

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
}
