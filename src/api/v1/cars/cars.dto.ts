import { IsDefined, Length, Matches } from 'class-validator';

export class UserTokenValidation {
  @IsDefined()
  token: string;

  @IsDefined()
  user: number;
}

export class DeleteCarValidation {
  @IsDefined()
  token: string;

  @IsDefined()
  userId: number;

  @IsDefined()
  carId: number;
}

export class AddCarValidator {
  @IsDefined()
  token: string;

  @IsDefined()
  userId: number;

  @IsDefined()
  @Length(3, 20)
  brand: string;

  @IsDefined()
  @Length(3, 20)
  color: string;

  @IsDefined()
  @Length(3, 20)
  @Matches(/^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/iu)
  registrationNumber: string;
}

export interface addCarDTO {
  token: string;
  userId: number;
  brand: string;
  color: string;
  registrationNumber: string;
}

export class UpdateCarValidator {
  @IsDefined()
  token: string;

  @IsDefined()
  userId: number;

  @IsDefined()
  @Length(3, 20)
  brand: string;

  @IsDefined()
  @Length(3, 20)
  color: string;

  @IsDefined()
  carId: number;
}

export interface updateCarDTO {
  token: string;
  userId: number;
  brand: string;
  color: string;
  carId: number;
}
