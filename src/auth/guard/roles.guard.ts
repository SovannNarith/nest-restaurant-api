import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
@Injectable()
export class RolesGuard extends AuthGuard("jwt") implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info: Error, context: ExecutionContext) {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    const hasRole = () => user.roles.some((role) => roles.includes(role));

    if (!user) {
      throw new UnauthorizedException("Unauthorized User");
    }
    if (!(user.roles && hasRole())) {
      throw new ForbiddenException("User Can not access to this route");
    }
    return user && user.roles && hasRole();
  }
}
