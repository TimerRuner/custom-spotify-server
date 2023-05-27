import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../user/user.model";
import {Track} from "./track.model";
import {Albom} from "../albom/albom.model";
import {Comment} from "../comment/comment.model";

@Module({
  imports: [
      SequelizeModule.forFeature([User, Track, Albom, Comment])
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService]
})
export class TrackModule {}
