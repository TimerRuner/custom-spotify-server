import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "../role/role.model";
import {User} from "./user.model";
import {Token} from "../token/token.model";
import {Account} from "../account/account.model";
import {Albom} from "../albom/albom.model";
import {Track} from "../track/track.model";

@Module({
  imports: [
      SequelizeModule.forFeature([Role, User, Token, Account, Albom, Track])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
