import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Track} from "../track/track.model";
import {Comment} from "./comment.model";

@Module({
  imports: [
      SequelizeModule.forFeature([Track, Comment])
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}
