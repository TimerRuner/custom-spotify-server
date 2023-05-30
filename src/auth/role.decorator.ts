import { SetMetadata } from '@nestjs/common';

export const ROLE_CONST = "roles"

export const Roles = (...roles: string[]) => SetMetadata(ROLE_CONST, roles);