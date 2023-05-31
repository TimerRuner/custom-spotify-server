import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from "../user/user.module";
import { AccountModule } from "../account/account.module";
import { TokenModule } from "../token/token.module";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  imports: [
    UserModule,
    AccountModule,
    TokenModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [AuthService]
})
export class AuthModule {}
