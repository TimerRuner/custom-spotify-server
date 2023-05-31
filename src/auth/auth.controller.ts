import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { RegistrationAuthDto } from "./dto/registration-auth.dto";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { CustomPipeValidation } from "../pipes/validation.pipe";
import { AuthGuard } from "@nestjs/passport";

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

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleLogin() {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req, @Res() res) {
   const {user} = req
    const userExist = !!Object.keys(user).length
    if(userExist) {
      res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 60 * 1000, httpOnly: true })
      res.cookie('user', JSON.stringify(user), {maxAge: 30 * 60 * 1000})
      return res.redirect("http://localhost:3000")
    } else {
      return res.redirect("http://localhost:3000/signIn")
    }
  }
}
