import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TokenService } from "../token/token.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const authorizationHeader = request.headers.authorization
      if(!authorizationHeader) {
        throw new UnauthorizedException("User unauthorized")
      }

      const accessToken = authorizationHeader.split(" ")[1]
      if(!accessToken) {
        throw new UnauthorizedException("User unauthorized")
      }

      const userData = await this.tokenService.validateToken(accessToken)
      if(!userData) {
        throw new UnauthorizedException("User unauthorized")
      }

      request.user = userData
      return true
    } catch (e) {
      throw new UnauthorizedException("User unauthorized")
    }
  }
}
