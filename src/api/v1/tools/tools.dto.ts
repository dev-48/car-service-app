import { IsDefined } from 'class-validator';

export class ToolValidator {
  @IsDefined()
  token: string;

  @IsDefined()
  toolId: number;
}

export class ToolValidatorApplication {
  @IsDefined()
  token: string;

  @IsDefined()
  toolId: number;

  @IsDefined()
  applicationId: number;
}

export class AddToolValidator {
  @IsDefined()
  token: string;

  @IsDefined()
  title: string;
}

export class ApplicationToolsDTO {
  @IsDefined()
  token: string;

  @IsDefined()
  applicationId: number;
}
