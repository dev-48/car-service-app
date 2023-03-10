import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from '../../../entities/user.entity';
import { Repository } from 'typeorm';
import { token } from '../../../entities/token.entity';
import { car } from '../../../entities/car.entity';
import { application } from '../../../entities/application.entity';
import { ApplicationDTO, ApplicationEditDTO } from './applications.dto';
import * as moment from 'moment';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(user)
    private usersRepository: Repository<user>,
    @InjectRepository(token)
    private tokensRepository: Repository<token>,
    @InjectRepository(car)
    private carRepository: Repository<car>,
    @InjectRepository(application)
    private applicationRepository: Repository<application>,
  ) {}
  async getApplications(token: string, user: number): Promise<object> {
    const dataByToken = await this.tokensRepository.findOne({
      where: { token: token },
      relations: ['user'],
    });

    if (!dataByToken) throw new UnauthorizedException();

    switch (Number(user)) {
      case 0: {
        if (
          dataByToken.user.role === 'admin' ||
          dataByToken.user.role === 'manager' ||
          dataByToken.user.role === 'mechanic'
        ) {
          return await this.applicationRepository
            .createQueryBuilder('application')
            .leftJoinAndSelect('application.customer', 'customer')
            .leftJoinAndSelect('application.executor', 'executor')
            .leftJoinAndSelect('application.car', 'car')
            .select([
              'application.id',
              'application.registrationDate',
              'application.type',
              'application.description',
              'application.status',
              'customer.id',
              'customer.surname',
              'customer.name',
              'customer.patronymic',
              'customer.email',
              'executor.id',
              'executor.surname',
              'executor.name',
              'executor.patronymic',
              'car.id',
              'car.color',
              'car.brand',
              'car.registrationNumber',
            ])
            .getMany()
            .catch(() => {
              throw new InternalServerErrorException();
            });
        } else {
          throw new ForbiddenException();
        }
      }

      default: {
        if (
          dataByToken.user.role === 'admin' ||
          dataByToken.user.role === 'manager' ||
          dataByToken.user.role === 'mechanic' ||
          dataByToken.user.id == user
        ) {
          return await this.applicationRepository
            .createQueryBuilder('application')
            .leftJoinAndSelect('application.customer', 'customer')
            .leftJoinAndSelect('application.executor', 'executor')
            .leftJoinAndSelect('application.car', 'car')
            .select([
              'application.id',
              'application.registrationDate',
              'application.type',
              'application.description',
              'application.status',
              'customer.id',
              'customer.surname',
              'customer.name',
              'customer.patronymic',
              'customer.email',
              'executor.id',
              'executor.surname',
              'executor.name',
              'executor.patronymic',
              'car.id',
              'car.color',
              'car.brand',
              'car.registrationNumber',
            ])
            .where('customer.id = :customerId', { customerId: user })
            .getMany()
            .catch((e) => {
              console.log(e);
              throw new InternalServerErrorException();
            });
        } else {
          throw new ForbiddenException();
        }
      }
    }
  }

  async create(data: ApplicationDTO): Promise<object> {
    const dataByToken = await this.tokensRepository.findOne({
      where: { token: data.token },
      relations: ['user'],
    });

    if (!dataByToken) throw new UnauthorizedException();

    if (
      dataByToken.user.role === 'admin' ||
      dataByToken.user.id === Number(data.customerId)
    ) {
      const customer = await this.usersRepository.findOne({
        where: { id: data.customerId },
      });
      const customerCar = await this.carRepository.findOne({
        where: { id: data.carId },
      });

      if (!customerCar || !customer)
        throw new BadRequestException('Invalid params');

      await this.applicationRepository
        .insert({
          registrationDate: moment().format('YYYY-MM-DD'),
          type: data.type,
          description: data.description,
          customer: customer,
          car: customerCar,
        })
        .catch(() => {
          throw new InternalServerErrorException();
        });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'The application has been created',
      };
    } else {
      throw new ForbiddenException();
    }
  }

  async edit(data: ApplicationEditDTO): Promise<object> {
    const application = await this.applicationRepository
      .findOne({
        where: { id: data.applicationId },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    if (!application) throw new BadRequestException('Invalid data');

    await this.applicationRepository
      .update(
        { id: application.id },
        {
          type: data.type,
          description: data.description,
        },
      )
      .catch(() => {
        throw new InternalServerErrorException();
      });
    return {
      statusCode: HttpStatus.OK,
      message: 'The application has been updated',
    };
  }

  async delete(applicationId: number): Promise<object> {
    const application = await this.applicationRepository
      .findOne({
        where: { id: applicationId },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    if (!application) throw new BadRequestException('Invalid data');

    await this.applicationRepository.delete(application.id).catch(() => {
      throw new InternalServerErrorException();
    });
    return {
      statusCode: HttpStatus.GONE,
      message: 'The application has been deleted',
    };
  }

  async changeStatus(status: string, applicationId: number): Promise<object> {
    const application = await this.applicationRepository
      .findOne({ where: { id: applicationId } })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    if (!application) throw new BadRequestException('Invalid data');

    await this.applicationRepository
      .update({ id: application.id }, { status: status })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    return {
      statusCode: HttpStatus.OK,
      message: 'Status updated',
    };
  }

  async changeWorker(workerId: number, applicationId: number): Promise<object> {
    const worker = await this.usersRepository
      .findOne({ where: { id: workerId, role: 'mechanic' } })
      .catch(() => {
        throw new InternalServerErrorException();
      });
    const application = await this.applicationRepository
      .findOne({
        where: { id: applicationId },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    if (!application || !worker) throw new BadRequestException('Invalid data');

    await this.applicationRepository
      .update({ id: application.id }, { executor: worker })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    return {
      statusCode: HttpStatus.OK,
      message: 'The performer of the work has been updated',
    };
  }

  async listOfMechanics(): Promise<object> {
    return await this.usersRepository
      .createQueryBuilder('mechanic')
      .select([
        'mechanic.id',
        'mechanic.surname',
        'mechanic.name',
        'mechanic.patronymic',
        'mechanic.role',
      ])
      .where('mechanic.role = :role', { role: 'mechanic' })
      .getMany()
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }
}
