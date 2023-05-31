import {Controller, Get, Param, Res} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {AccountService} from "./account.service";
import {Response} from "express";

@Controller('account')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly configService: ConfigService
    ) {}

    @Get("activate/:link")
    async activate(@Param("link") link: string, @Res() res: Response) {
        await this.accountService.activate(link)
        return res.redirect(this.configService.get<string>("UI_ORIGIN"))
    }
}
