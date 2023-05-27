import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Token} from "./token.model";
import {User} from "../user/user.model";

@Module({
  imports: [SequelizeModule.forFeature([Token, User])],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
