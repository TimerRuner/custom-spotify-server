import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Account} from "./account.model";
import {User} from "../user/user.model";
import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigModule, ConfigService} from "@nestjs/config";
import * as path from "path";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports: [
      SequelizeModule.forFeature([Account, User]),
      MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          return {
            transport: {
              host: configService.get('SMTP_HOST'),
              port: configService.get("SMTP_PORT"),
              auth: {
                user: configService.get("MAIL_USERNAME"),
                pass: configService.get("MAIL_PASSWORD"),
              },
            },
            defaults: {
              from: '"No Reply" <noreply@example.com>',
            },
            template: {
              dir: path.join(__dirname, "..", 'templates'),
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }
        },
        inject: [ConfigService]
      })
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}
