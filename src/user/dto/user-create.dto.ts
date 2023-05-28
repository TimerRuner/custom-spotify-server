export class UserCreateDto {
    readonly fullName: string
    readonly email: string
    readonly password: string
    role: ERole
}

export enum ERole {
    USER = "USER",
    CREATOR = "CREATOR"
}