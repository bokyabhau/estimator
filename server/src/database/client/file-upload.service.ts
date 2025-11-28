import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
  private readonly uploadsDir = join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadsDir();
  }

  private ensureUploadsDir() {
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  saveFile(file: Express.Multer.File): string | null {
    if (!file) {
      return null;
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = join(this.uploadsDir, filename);
    
    fs.writeFileSync(filepath, file.buffer);
    
    return `/uploads/${filename}`;
  }

  deleteFile(filePath: string | undefined): void {
    if (!filePath) {
      return;
    }

    try {
      const filename = filePath.split('/').pop();
      const filepath = join(this.uploadsDir, filename!);
      
      if (existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}
