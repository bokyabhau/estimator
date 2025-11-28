import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from '../schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FileUploadService } from './file-upload.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private fileUploadService: FileUploadService,
  ) {}

  async create(
    createClientDto: CreateClientDto,
    logoFile?: Express.Multer.File,
    stampFile?: Express.Multer.File,
  ): Promise<Client> {
    try {
      let logoUrl: string | undefined;
      let stampUrl: string | undefined;

      if (logoFile) {
        const savedLogoUrl = this.fileUploadService.saveFile(logoFile);
        logoUrl = savedLogoUrl || undefined;
      }

      if (stampFile) {
        const savedStampUrl = this.fileUploadService.saveFile(stampFile);
        stampUrl = savedStampUrl || undefined;
      }

      const clientData = {
        ...createClientDto,
        ...(logoUrl && { logoUrl }),
        ...(stampUrl && { stampUrl }),
      };

      const createdClient = new this.clientModel(clientData);
      return await createdClient.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Client[]> {
    return await this.clientModel.find().exec();
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id).exec();
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async findByEmail(email: string): Promise<ClientDocument | null> {
    // Include password for authentication purposes
    return await this.clientModel.findOne({ email }).select('+password').exec();
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    logoFile?: Express.Multer.File,
    stampFile?: Express.Multer.File,
  ): Promise<Client> {
    const existingClient = await this.clientModel.findById(id);
    if (!existingClient) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    const updateData = { ...updateClientDto };

    // Handle logo file update
    if (logoFile) {
      if (existingClient.logoUrl) {
        this.fileUploadService.deleteFile(existingClient.logoUrl);
      }
      const logoUrl = this.fileUploadService.saveFile(logoFile);
      if (logoUrl) {
        updateData.logoUrl = logoUrl;
      }
    }

    // Handle stamp file update
    if (stampFile) {
      if (existingClient.stampUrl) {
        this.fileUploadService.deleteFile(existingClient.stampUrl);
      }
      const stampUrl = this.fileUploadService.saveFile(stampFile);
      if (stampUrl) {
        updateData.stampUrl = stampUrl;
      }
    }

    const client = await this.clientModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async remove(id: string): Promise<Client> {
    const client = await this.clientModel.findByIdAndDelete(id);

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    // Delete associated files if they exist
    if (client.logoUrl) {
      this.fileUploadService.deleteFile(client.logoUrl);
    }
    if (client.stampUrl) {
      this.fileUploadService.deleteFile(client.stampUrl);
    }

    return client;
  }
}
