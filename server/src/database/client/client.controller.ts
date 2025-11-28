import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'stamp', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createClientDto: CreateClientDto,
    @UploadedFiles()
    files?: {
      logo?: Express.Multer.File[];
      stamp?: Express.Multer.File[];
    },
  ) {
    return await this.clientService.create(
      createClientDto,
      files?.logo?.[0],
      files?.stamp?.[0],
    );
  }

  @Get()
  async findAll() {
    return await this.clientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.clientService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'stamp', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @UploadedFiles()
    files?: {
      logo?: Express.Multer.File[];
      stamp?: Express.Multer.File[];
    },
  ) {
    return await this.clientService.update(
      id,
      updateClientDto,
      files?.logo?.[0],
      files?.stamp?.[0],
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.clientService.remove(id);
  }
}
