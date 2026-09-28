import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import type { Request } from 'express';

export type JwtPayload = { sub: number; email: string };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const token: string | undefined = req.cookies?.token;
    if (!token) throw new UnauthorizedException();
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'dev-secret-change-me') as unknown as JwtPayload;
      (req as Request & { user: { id: number; email: string } }).user = { id: payload.sub, email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
