import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Check if MongoDB URL is provided
  if (!configService.get('MONGODB_URL')) {
    console.error('ERROR: MONGODB_URL environment variable is not set in .env file');
    process.exit(1);
  }

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  const port = configService.get('PORT') ?? 3000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
