import { Module } from '@nestjs/common';
import { AlbomController } from './albom.controller';
import { AlbomService } from './albom.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../user/user.model";
import {Track} from "../track/track.model";
import {Albom} from "./albom.model";

@Module({
  imports: [
      SequelizeModule.forFeature([User, Track, Albom])
  ],
  controllers: [AlbomController],
  providers: [AlbomService],
  exports: [AlbomService]
})
export class AlbomModule {}
