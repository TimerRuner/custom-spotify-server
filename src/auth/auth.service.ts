import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { RegistrationAuthDto } from "./dto/registration-auth.dto";
import { UserService } from "../user/user.service";
import { TokenService } from "../token/token.service";
import { AccountService } from "../account/account.service";
import * as bcrypt from "bcryptjs"
import { filterDto } from "./filter-dto/filter-dto";

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly accountService: AccountService
  ) {}

  async generateToken(user, account) {
    const filteredObject = filterDto({...user.dataValues, role: user.dataValues.role.value, isActivated: account.isActivated}, ["password", "id", "fullName", "roleId", "createdAt", "updatedAt"])
    const {refreshToken, accessToken} = await this.tokenService.generateTokens(filteredObject)
    await this.tokenService.saveToken(user.id, refreshToken)

    return {
      user: {
        id: user.dataValues.id,
        fullName: user.dataValues.fullName,
        email: user.dataValues.email,
        isActivated: account.isActivated
      },
      refreshToken,
      accessToken
    }
  }

  async login(dto: LoginAuthDto) {
    const user = await this.userService.getUserByEmail(dto.email)
    if(!user) {
      throw new HttpException(`User with email - ${dto.email} doesn't exist`, HttpStatus.BAD_REQUEST)
    }
    const isCorrectPassword = await bcrypt.compare(dto.password, user.password)
    if(!isCorrectPassword) {
      throw new HttpException(`Wrong password`, HttpStatus.BAD_REQUEST)
    }
    const accountStatus = await this.accountService.getAccountStatusByUserId(user.id)
    return await this.generateToken(user, {isActivated: accountStatus})
  }

  async registration(dto: RegistrationAuthDto) {
    const existingUser = await this.userService.getUserByEmail(dto.email)
    if(existingUser) {
      throw new HttpException(`User with email - ${dto.email} already exist`, HttpStatus.BAD_REQUEST)
    }
    const hasPassword = await bcrypt.hash(dto.password, 7)

    const user = await this.userService.create({...dto, password: hasPassword})
    const account = await this.accountService.generateActivationLink(user.id, dto.email)

    return await this.generateToken(user, account)
  }

  async logout(refreshToken) {
    await this.tokenService.deleteToken(refreshToken)
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw new UnauthorizedException("User unauthorized")
    }
    const isValidToken = await this.tokenService.validateToken(refreshToken)
    const tokenData = await this.tokenService.findToken(refreshToken)
    if(!isValidToken && !tokenData) {
      throw new UnauthorizedException("User unauthorized")
    }
    const user = await this.userService.getUserById(tokenData.userId)
    const accountStatus = await this.accountService.getAccountStatusByUserId(user.id)

    return await this.generateToken(user, {isActivated: accountStatus})
  }
}
