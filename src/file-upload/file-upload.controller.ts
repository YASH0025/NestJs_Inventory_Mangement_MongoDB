import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';

@Controller('file-upload')
export class FileUploadController {
  // files.controller.ts
  // import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
  // import { FileInterceptor } from '@nestjs/platform-express';
  // import { multerConfig } from './multer.config';
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(@UploadedFile() file) {
    return { originalname: file.originalname, filename: file.filename };
  }
}

