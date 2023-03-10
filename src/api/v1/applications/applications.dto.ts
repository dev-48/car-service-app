import { IsDefined, IsIn, Length } from 'class-validator';

export class UserTokenValidation {
  @IsDefined()
  token: string;

  @IsDefined()
  user: number;
}

export class ApplicationValidation {
  @IsDefined()
  @IsIn(['Ремонт', 'Тех. обслуживание'])
  type: string;

  @IsDefined()
  @Length(2, 50)
  description: string;

  @IsDefined()
  customerId: number;

  @IsDefined()
  carId: number;

  @IsDefined()
  token: string;
}

export interface ApplicationDTO {
  type: string;
  description: string;
  carId: number;
  token: string;
  customerId: number;
}

export class EditApplicationValidation {
  @IsDefined()
  @IsIn(['Ремонт', 'Тех. обслуживание'])
  type: string;

  @IsDefined()
  @Length(2, 50)
  description: string;

  @IsDefined()
  applicationId: number;

  @IsDefined()
  token: string;
}

export interface ApplicationEditDTO {
  type: string;
  description: string;
  applicationId: number;
  token: string;
}

export class ApplicationDeleteValidator {
  @IsDefined()
  applicationId: number;

  @IsDefined()
  token: string;
}

export class ChangeStatusValidator {
  @IsDefined()
  token: string;

  @IsDefined()
  applicationId: number;

  @IsDefined()
  @IsIn(['Не в работе', 'В работе', 'Выполнено'])
  status: string;
}

export class ChangeWorkerValidator {
  @IsDefined()
  token: string;

  @IsDefined()
  applicationId: number;

  @IsDefined()
  workerId: number;
}
