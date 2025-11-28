
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientModule } from './client/client.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    ClientModule,
  ],
  exports: [ClientModule],
})
export class DatabaseModule {}
