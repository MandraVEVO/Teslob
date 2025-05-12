import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response, // manualmente emitir mi respuesta
    @Param('imageName') imageName: string
  ){

    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path); // envia el archivo al cliente
    
  }
  
  
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits:{fileSize: 1000}
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    if(!file) {
      throw new BadRequestException('make sure that the file is a valid image');
    }

    //servir archivos de manera controlada
    const secureUrl =`${file.filename}`;


    return {
      fileName: file.originalname
    }
  }

  
}
