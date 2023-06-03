import { Injectable } from '@nestjs/common';
import { S3 } from "aws-sdk";
import { ConfigService } from "@nestjs/config";

import * as uuid from "uuid"

@Injectable()
export class FilesService {
  private readonly S3Client = new S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  })
  constructor(private readonly configService: ConfigService) {}

  generateUniqueFileName (filename: string) {
    const uniqueName = uuid.v4()
    const fileType = filename.split(".")[1]
    return `${uniqueName}.${fileType}`
  }

  selectFileKey(filename: string) {
    return  filename.slice(filename.lastIndexOf("/") + 1)
  }

  async uploadFile(file, bucketName: string): Promise<string> {
    if(!file) return ""
    const params = {
      Bucket: bucketName,
      Key: this.generateUniqueFileName(file.originalname),
      Body: file.buffer,
    };

    const { Location } = await this.S3Client.upload(params).promise();
    return Location;
  }

  async getFile(bucketName: string, key: string): Promise<Buffer> {
    const params = {
      Bucket: bucketName,
      Key: this.selectFileKey(key),
    };

    const data = await this.S3Client.getObject(params).promise();
    return data.Body as Buffer;
  }

  async deleteFile(bucketName: string, key: string) {
    if(!key) return
    const params = {
      Bucket: bucketName,
      Key: this.selectFileKey(key),
    };

    await this.S3Client.deleteObject(params).promise();
  }

}
