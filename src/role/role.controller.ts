import {Body, Controller, Delete, Get, Param, Patch, Post, Put} from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role.dto";
import {RoleService} from "./role.service";

@Controller('role')
export class RoleController {

    constructor(private readonly roleService: RoleService) {}
    @Post("create")
    async create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto)
    }

    @Get("getAll")
    async getAll() {
        return this.roleService.getAllRoles()
    }

    @Get("get/:value")
    async getRole(@Param("value") value: string) {
        return this.roleService.getRole(value)
    }

    @Patch("update/:value")
    async updateRole(@Param("value") value: string, @Body() dto: CreateRoleDto) {
        return this.roleService.updateRole(value, dto)
    }

    @Delete("delete/:value")
    async deleteRole(@Param("value") value: string){
        return this.roleService.delete(value)
    }

}
