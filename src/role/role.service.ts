import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./role.model";

@Injectable()
export class RoleService {

    constructor(@InjectModel(Role) private readonly roleRepository: typeof Role) {}
    async createRole(dto: CreateRoleDto) {
        return await this.roleRepository.create(dto)
    }

    async getAllRoles() {
        return await this.roleRepository.findAll()
    }

    async getRole(value: string) {
        const role = await this.roleRepository.findOne({where: {value}})
        if(!role){
            throw new NotFoundException(`Role ${value} was not found`)
        }
        return role
    }

    async updateRole(value: string, dto: CreateRoleDto) {
        const [rowsAffected, [updatedRecords]] = await this.roleRepository.update(dto, {where: {value}, returning: true})
        if(!rowsAffected) {
            throw new NotFoundException(`Role ${value} was not found`)
        }
        return updatedRecords
    }

    async delete(value: string) {
        const deleteRow = await this.roleRepository.destroy({where: {value}})
        if(!deleteRow) {
            throw new NotFoundException(`Role ${value} was not found`)
        }
        return `Role ${value} was deleted successfully`
    }
}
