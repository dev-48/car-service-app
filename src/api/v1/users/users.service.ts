import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from '../../../entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(user)
    private usersRepository: Repository<user>,
  ) {}
  async getClients(): Promise<object> {
    return this.usersRepository
      .createQueryBuilder('users')
      .select([
        'users.id',
        'users.surname',
        'users.name',
        'users.patronymic',
        'users.gender',
        'users.dateOfBirth',
        'users.email',
        'users.role',
      ])
      .where('users.role = :role', { role: 'user' })
      .getMany()
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }

  async getWorkers(): Promise<object> {
    return this.usersRepository
      .createQueryBuilder('users')
      .select([
        'users.id',
        'users.surname',
        'users.name',
        'users.patronymic',
        'users.gender',
        'users.dateOfBirth',
        'users.email',
        'users.role',
      ])
      .where('users.role != :role', { role: 'user' })
      .getMany()
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }

  async deleteUser(id: number): Promise<object> {
    const candidate = await this.usersRepository
      .findOne({
        where: { id: id },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    if (!candidate) throw new BadRequestException('Invalid id');

    await this.usersRepository.delete({ id: id }).catch(() => {
      throw new InternalServerErrorException();
    });

    return {
      statusCode: HttpStatus.GONE,
      message: 'Account successfully deleted',
    };
  }

  async updateRole(id: number, role: string): Promise<object> {
    const candidate = await this.usersRepository.findOne({ where: { id: id } });

    if (!candidate) throw new BadRequestException('Invalid id');

    await this.usersRepository.update({ id }, { role: role }).catch(() => {
      throw new InternalServerErrorException();
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'User role updated',
    };
  }

  async updateUser(data: UpdateUserDTO): Promise<object> {
    const candidate: user = await this.usersRepository.findOne({
      where: { id: data.id },
    });

    if (!candidate) throw new BadRequestException('Invalid id');

    await this.usersRepository
      .update(
        { id: data.id },
        {
          surname: data.surname,
          name: data.name,
          patronymic: data.patronymic,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          email: data.email,
          role: data.role,
        },
      )
      .catch((e) => {
        console.log(e);
        throw new InternalServerErrorException();
      });
    return {
      statusCode: HttpStatus.OK,
      message: 'Data updated',
    };
  }
}
