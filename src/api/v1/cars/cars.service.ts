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
import { addCarDTO, AddCarValidator, updateCarDTO } from './cars.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(user)
    private usersRepository: Repository<user>,
    @InjectRepository(token)
    private tokensRepository: Repository<token>,
    @InjectRepository(car)
    private carRepository: Repository<car>,
  ) {}
  async carsList(token: string, userId: number): Promise<object> {
    const dataByToken = await this.tokensRepository
      .findOne({
        where: { token: token },
        relations: ['user'],
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    if (!dataByToken) throw new UnauthorizedException();

    switch (Number(userId)) {
      case 0: {
        if (dataByToken.user.role !== 'admin') throw new ForbiddenException();

        return await this.carRepository.find().catch(() => {
          throw new InternalServerErrorException();
        });
      }
      default: {
        if (dataByToken.user.role === 'admin') {
          return await this.carRepository
            .findOne({ where: { user: dataByToken.user } })
            .catch(() => {
              throw new InternalServerErrorException();
            });
        } else {
          if (dataByToken.user.id === Number(userId)) {
            return await this.carRepository
              .findOne({ where: { user: dataByToken.user } })
              .catch(() => {
                throw new InternalServerErrorException();
              });
          } else {
            throw new ForbiddenException();
          }
        }
      }
    }
  }

  async deleteCar(
    token: string,
    userId: number,
    carId: number,
  ): Promise<object> {
    const dataByToken = await this.tokensRepository
      .findOne({
        where: { token: token },
        relations: ['user'],
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    if (!dataByToken) throw new UnauthorizedException();

    if (
      dataByToken.user.role === 'admin' ||
      dataByToken.user.id === Number(userId)
    ) {
      const carOwner = await this.usersRepository
        .findOne({
          where: { id: userId },
        })
        .catch(() => {
          throw new InternalServerErrorException();
        });
      const car = await this.carRepository
        .findOne({ where: { id: carId } })
        .catch(() => {
          throw new InternalServerErrorException();
        });

      if (!car || !carOwner) throw new BadRequestException('Invalid params');
      await this.carRepository
        .delete({ id: carId, user: carOwner })
        .catch(() => {
          throw new InternalServerErrorException();
        });
      return {
        statusCode: HttpStatus.GONE,
        message: 'The car has been removed',
      };
    } else {
      throw new ForbiddenException();
    }
  }

  async addCar(data: addCarDTO): Promise<object> {
    const dataByToken = await this.tokensRepository
      .findOne({
        where: { token: data.token },
        relations: ['user'],
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    if (!dataByToken) throw new UnauthorizedException();

    if (
      dataByToken.user.role === 'admin' ||
      dataByToken.user.id === Number(data.userId)
    ) {
      const user = await this.usersRepository
        .findOne({
          where: { id: data.userId },
        })
        .catch(() => {
          throw new InternalServerErrorException();
        });

      if (!user) throw new InternalServerErrorException();

      const carInSystem = await this.carRepository
        .findOne({
          where: { registrationNumber: data.registrationNumber },
        })
        .catch(() => {
          throw new InternalServerErrorException();
        });

      if (carInSystem)
        throw new BadRequestException('The car is already registered');

      await this.carRepository
        .insert({
          user: user,
          color: data.color,
          brand: data.brand,
          registrationNumber: data.registrationNumber,
        })
        .catch(() => {
          throw new InternalServerErrorException();
        });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Car added',
      };
    } else {
      throw new ForbiddenException();
    }
  }

  async editCar(data: updateCarDTO): Promise<object> {
    const dataByToken = await this.tokensRepository
      .findOne({
        where: { token: data.token },
        relations: ['user'],
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    if (!dataByToken) throw new UnauthorizedException();

    if (
      dataByToken.user.role === 'admin' ||
      dataByToken.user.id === Number(data.userId)
    ) {
      const user = await this.usersRepository
        .findOne({
          where: { id: data.userId },
        })
        .catch(() => {
          throw new InternalServerErrorException();
        });

      if (!user) throw new InternalServerErrorException();

      const carInSystem = await this.carRepository
        .findOne({
          where: { id: data.carId },
        })
        .catch(() => {
          throw new InternalServerErrorException();
        });

      if (!carInSystem)
        throw new BadRequestException('The car is not registered');

      await this.carRepository
        .update(
          { id: carInSystem.id },
          {
            brand: data.brand,
            color: data.color,
            user: user,
          },
        )
        .catch(() => {
          throw new InternalServerErrorException();
        });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Car updated',
      };
    } else {
      throw new ForbiddenException();
    }
  }
}
