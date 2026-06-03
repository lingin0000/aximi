import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @IsString()
  @MinLength(6, { message: '密码至少6个字符' })
  password: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: '用户名至少2个字符' })
  username: string;

  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @IsString()
  @MinLength(6, { message: '密码至少6个字符' })
  password: string;
}
