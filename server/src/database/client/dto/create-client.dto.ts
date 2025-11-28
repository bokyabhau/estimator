import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(\+91|0)?[6-9]\d{9}$/, {
    message: 'Phone number must be a valid Indian phone number',
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty()
  @IsString()
  logoUrl: string;

  @IsNotEmpty()
  @IsString()
  stampUrl: string;
}
