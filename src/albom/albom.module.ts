import { Module } from '@nestjs/common';
import { AlbomController } from './albom.controller';
import { AlbomService } from './albom.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../user/user.model";
import {Track} from "../track/track.model";
import {Albom} from "./albom.model";
import { CommentModule } from "../comment/comment.module";
import { FilesModule } from "../files/files.module";
import { TokenModule } from "../token/token.module";
import { TrackModule } from "../track/track.module";

@Module({
  imports: [
      SequelizeModule.forFeature([User, Track, Albom]),
      CommentModule,
      FilesModule,
      TokenModule,
      TrackModule
  ],
  controllers: [AlbomController],
  providers: [AlbomService],
  exports: [AlbomService]
})
export class AlbomModule {}
