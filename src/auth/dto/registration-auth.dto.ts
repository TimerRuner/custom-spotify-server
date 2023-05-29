import { ERole } from "../../user/dto/user-create.dto";

export class RegistrationAuthDto {
  readonly email: string
  readonly password: string
  readonly fullName: string
  readonly role: ERole
}