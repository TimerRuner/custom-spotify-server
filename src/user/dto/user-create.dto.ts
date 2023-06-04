import { IsEmail, IsEnum, IsString, Length } from "class-validator";

export enum ERole {
    USER = "USER",
    CREATOR = "CREATOR"
}
export class UserCreateDto {
    @IsString({message: "Повинно бути строкою"})
    readonly fullName: string

    @IsString({message: "Повинно бути строкою"})
    @IsEmail({}, {message: "Некоректний email"})
    readonly email: string

    @IsString({message: "Повинно бути строкою"})
    @Length(4, 16, {message: "Довжина паролю повинна бути від 4 до 16 символів"})
    readonly password: string

    @IsEnum(ERole, { message: 'Невалідна роль' })
    role: ERole
}