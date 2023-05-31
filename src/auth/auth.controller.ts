import { Body, Controller, Get, Post, Req, Res, UsePipes } from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { RegistrationAuthDto } from "./dto/registration-auth.dto";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { CustomPipeValidation } from "../pipes/validation.pipe";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @UsePipes(CustomPipeValidation)
  @Post("login")
  async login(@Body() dto: LoginAuthDto, @Res() res: Response) {
    const loginData = await this.authService.login(dto)
    res.cookie("refreshToken", loginData.refreshToken, {maxAge: 30 * 60 * 1000, httpOnly: true})
    res.json(loginData)
  }

  @UsePipes(CustomPipeValidation)
  @Post("registration")
  async registration(@Body() dto: RegistrationAuthDto, @Res() res: Response) {
    const registrationData = await this.authService.registration(dto)
    res.cookie("refreshToken", registrationData.refreshToken, {maxAge: 30 * 60 * 1000, httpOnly: true})
    res.json(registrationData)
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies["refreshToken"]
    await this.authService.logout(refreshToken)
    res.clearCookie("refreshToken", {httpOnly: true})
    res.json({})
  }

  @Get("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies["refreshToken"]
    const authData = await this.authService.refresh(refreshToken)
    res.cookie("refreshToken", authData.refreshToken, {maxAge: 30 * 60 * 1000, httpOnly: true})
    res.json(authData)
  }
}
