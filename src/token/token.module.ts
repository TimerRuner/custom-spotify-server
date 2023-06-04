import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Token} from "./token.model";
import {User} from "../user/user.model";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
      SequelizeModule.forFeature([Token, User]),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          global: true,
          secret: configService.get("JWT_SECRET")
        }),
        inject: [ConfigService]
      })
  ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
