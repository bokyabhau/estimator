import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from '../schemas/client.schema';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }])],
  controllers: [ClientController],
  providers: [ClientService, FileUploadService],
  exports: [ClientService],
})
export class ClientModule {}
