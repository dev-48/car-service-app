import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from '../../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as rndstring from 'randomstring';
import { token } from '../../../entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(user)
    private usersRepository: Repository<user>,
    @InjectRepository(token)
    private tokensRepository: Repository<token>,
  ) {}
  async login(data: LoginDTO): Promise<object> {
    const candidate = await this.usersRepository
      .findOne({
        where: { email: data.email },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    if (!candidate) throw new BadRequestException('The account does not exist');

    if (await bcrypt.compare(data.password, candidate.password)) {
      const token = await rndstring.generate(50);
      await this.tokensRepository
        .upsert({ user: candidate, token: token }, ['user'])
        .catch(() => {
          throw new InternalServerErrorException();
        });
      return {
        statusCode: HttpStatus.OK,
        token: token,
      };
    } else {
      throw new BadRequestException('Incorrect password');
    }
    return {};
  }

  async register(data: RegisterDTO): Promise<object> {
    const candidate = await this.usersRepository
      .findOne({
        where: { email: data.email },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    if (candidate) throw new BadRequestException('The user already exists');

    await this.usersRepository
      .insert({
        surname: data.surname,
        name: data.name,
        patronymic: data.patronymic,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Account is registered',
      email: data.email,
    };
  }
}
