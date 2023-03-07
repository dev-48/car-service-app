import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsIn,
  Length,
} from 'class-validator';

export class RegisterDataValidation {
  @IsDefined()
  @Length(2, 20)
  surname: string;

  @IsDefined()
  @Length(2, 20)
  name: string;

  @IsDefined()
  @Length(2, 20)
  patronymic: string;

  @IsDefined()
  @IsIn(['мужской', 'женский'])
  gender: string;

  @IsDefined()
  @IsDateString()
  dateOfBirth: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @Length(1, 30)
  password: string;
}

export class LoginDataValidation {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @Length(1, 30)
  password: string;
}

export interface RegisterDTO {
  surname: string;
  name: string;
  patronymic: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
