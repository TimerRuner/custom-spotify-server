import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Account} from "./account.model";
import {ConfigService} from "@nestjs/config";
import {MailerService} from "@nestjs-modules/mailer";
import {CreateAccountDto} from "./dto/create-account.dto";
import * as uuid from "uuid"

@Injectable()
export class AccountService {
    constructor(
        @InjectModel(Account) private readonly accountProvider: typeof Account,
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService
    ) {}

    async create(dto: CreateAccountDto) {
        try {
            return await this.accountProvider.create(dto)
        } catch (e) {
            throw new BadRequestException("Uncorrect request")
        }
    }

    async generateActivationLink(userId: string, email: string) {
        const activationLink = `${this.configService.get<string>('API_URL')}/api/account/activate/${uuid.v4()}`
        const account = await this.create({userId, activationLink})
        await this.sendActivationLink(email, activationLink)
        return account
    }

    async activate(activationLink) {
        const account = await this.accountProvider.findOne({where: {activationLink}})
        if(!account) {
            throw new HttpException(`Uncorrect activation link`, HttpStatus.BAD_REQUEST)
        }
        account.isActivated = true
        return await account.save()
    }

    async getAccountStatusByUserId(userId: string) {
        const account = await this.accountProvider.findOne({where: {userId}})
        return account.isActivated
    }

    async sendActivationLink(email: string, link: string){
        await this.mailerService.sendMail({
            to: email,
            subject: `Activation account ${this.configService.get<string>('API_URL')}`,
            template: 'welcome',
            context: {
                link,
                email
            },
        })
    }


}
