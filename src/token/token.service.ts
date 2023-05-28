import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {InjectModel} from "@nestjs/sequelize";
import {Token} from "./token.model";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(Token) private readonly tokenProvider: typeof Token
    ) {}
    async generateTokens(payload) {
        const accessToken = this.jwtService.sign(payload, {expiresIn: "15m"})
        const refreshToken = this.jwtService.sign(payload, {expiresIn: "30m"})
        return {
            accessToken,
            refreshToken
        }
    }

    async validateToken(token) {
        try {
            return this.jwtService.verify(token)
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        try {
            const record = await this.tokenProvider.findOne({where: {refreshToken}})
            if(record){
                record.refreshToken = refreshToken
                return await record.save()
            } else {
               return await this.tokenProvider.create({userId, refreshToken})
            }

        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    async deleteToken(refreshToken) {
        await this.tokenProvider.destroy({where: {refreshToken}})
    }

    async findToken(refreshToken) {
        const token = await this.tokenProvider.findOne({where: {refreshToken}})
        if(!token){
            throw new UnauthorizedException("User unauthorized")
        }
        return token
    }

}
