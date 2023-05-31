import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_CONST } from "./role.decorator";
import { TokenService } from "../token/token.service";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private tokenService: TokenService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<string[]>(ROLE_CONST, context.getHandler());
    if(!role){
      return true
    }

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
      return userData.role = role.some(specialRole => specialRole.includes(userData.role))
    } catch (e) {
      throw new UnauthorizedException("User unauthorized")
    }
  }
}
