import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../user/user.model";
import {Track} from "./track.model";
import {Albom} from "../albom/albom.model";
import {Comment} from "../comment/comment.model";
import { FilesModule } from "../files/files.module";
import { TokenModule } from "../token/token.module";

@Module({
  imports: [
      SequelizeModule.forFeature([User, Albom, Track, Comment]),
      FilesModule,
      TokenModule
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService]
})
export class TrackModule {}
