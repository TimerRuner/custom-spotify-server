import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Track} from "../track/track.model";
import {Comment} from "./comment.model";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [
      SequelizeModule.forFeature([Track, Comment]),
      TokenModule
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}
