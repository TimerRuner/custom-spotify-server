import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Account} from "./account.model";
import {User} from "../user/user.model";
import {Track} from "../track/track.model";

@Module({
  imports: [
      SequelizeModule.forFeature([Account, User])
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}
