import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./role.model";
import {User} from "../user/user.model";

@Module({
  imports: [
      SequelizeModule.forFeature([Role, User])
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule {}
