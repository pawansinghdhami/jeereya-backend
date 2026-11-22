import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import type { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserSession } from '../../users/entities/user-session.entity';
import { UserStatus } from '../../users/enums/user-status.enum';

export type AuthenticatedRequest = Request & {
  authUser: User;
  authSession: UserSession;
};

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { authUser?: User; authSession?: UserSession }>();

    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token is required');
    }

    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    const tokenHash = createHash('sha256').update(token).digest('hex');

    const session = await this.userSessionRepository
      .createQueryBuilder('session')
      .innerJoinAndSelect('session.user', 'user')
      .where('session.token_hash = :tokenHash', { tokenHash })
      .andWhere('session.revoked_at_dtm is NULL')
      .andWhere('session.expires_at_dtm > :now', { now: new Date() })
      .andWhere('user.user_status = :activeStatus', {
        activeStatus: UserStatus.ACTIVE,
      })
      .getOne();

    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    request.authUser = session.user;
    request.authSession = session;
    return true;
  }
}
