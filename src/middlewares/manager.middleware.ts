import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { token } from '../entities/token.entity';

@Injectable()
export class ManagerMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(user)
    private usersRepository: Repository<user>,
    @InjectRepository(token)
    private tokensRepository: Repository<token>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const requestToken = req.body.token || req.query.token;
    const candidate = await this.tokensRepository.findOne({
      where: { token: requestToken },
      relations: ['user'],
    });
    if (!candidate || !requestToken) throw new UnauthorizedException();
    if (candidate.user.role !== 'manager') throw new ForbiddenException();

    next();
  }
}
