import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsIn,
  Length,
} from 'class-validator';

export class DeleteDataValidator {
  @IsDefined()
  id: number;
}

export class UpdateDataValidator {
  @IsDefined()
  id: number;

  @IsDefined()
  @IsIn(['admin', 'manager', 'mechanic', 'user'])
  role: string;
}

export class UpdateUserDataValidator {
  @IsDefined()
  id: number;

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
  @IsIn(['admin', 'manager', 'mechanic', 'user'])
  role: string;
}

export interface UpdateUserDTO {
  id: number;
  surname: string;
  name: string;
  patronymic: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  role: string;
}
