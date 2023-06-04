import { ERole } from "../../user/dto/user-create.dto";
import { IsEmail, IsEnum, IsString, Length } from "class-validator";

export class RegistrationAuthDto {
  @IsString({message: "Повинно бути строкою"})
  @IsEmail({}, {message: "Некоректний email"})
  readonly email: string

  @IsString({message: "Повинно бути строкою"})
  @Length(4, 16, {message: "Довжина паролю повинна бути від 4 до 16 символів"})
  readonly password: string

  @IsString({message: "Повинно бути строкою"})
  readonly fullName: string

  @IsEnum(ERole, { message: 'Invalid role' })
  readonly role: ERole
}