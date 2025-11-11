import { IsEmail, IsNotEmpty, MinLength, IsString, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsIn(['super_admin', 'admin', 'manager', 'inspector', 'viewer'])
  @IsNotEmpty()
  role: string;
}
