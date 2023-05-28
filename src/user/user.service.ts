import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {ERole, UserCreateDto} from "./dto/user-create.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./user.model";
import {RoleService} from "../role/role.service";
import {Role} from "../role/role.model";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User) private readonly userRepository: typeof User,
        private readonly roleService: RoleService,
    ) {}
    async create(dto: UserCreateDto) {
        let role
        try {
            role = await this.roleService.getRole(dto.role)
        } catch (e) {
            role = await this.roleService.getRole(ERole.USER)
        }
        if(dto.role) {
           delete dto.role
        }
        const user = await this.userRepository.create(dto)

        user.roleId = role.id

        return await user.save()
    }

    async getUserByEmail(email: string){
        const user = await this.userRepository.findOne({where: {email}, include: [Role]})
        if(!user) {
            throw new NotFoundException(`User with email - ${email} doesn't exist`)
        }
        return user
    }

    async getUserById(id: string){
        const user = await this.userRepository.findOne({where: {id}, include: [Role]})
        if(!user) {
            throw new NotFoundException(`User with id - ${id} doesn't exist`)
        }
        return user
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        if(dto?.email) {
            delete dto.email
        }
        const [rowsAffected, [updatedRecords]] = await this.userRepository.update(dto, {where: {id}, returning: true})
        if(!rowsAffected) {
            throw new NotFoundException(`User with id ${id} does not exist`)
        }
        return updatedRecords
    }

    async delete(id: string) {
        const deletedRecord = await this.userRepository.destroy({where: {id}})
        if(!deletedRecord) {
            throw new NotFoundException(`User with id ${id} does not exist`)
        }
        return `User with id ${id} was removed successfully`
    }

}
