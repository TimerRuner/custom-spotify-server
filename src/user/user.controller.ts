import {Body, Controller, Get, Post, Patch, Delete, Param} from '@nestjs/common';
import {UserCreateDto} from "./dto/user-create.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UserService} from "./user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Post("create")
    async create(@Body() dto: UserCreateDto) {
        return this.userService.create(dto)
    }

    @Get("get")
    async getUserByEmail(@Body("email") email: string){
        return this.userService.getUserByEmail(email)
    }

    @Get("get/:id")
    async getUserById(@Param("id") id: string){
        return this.userService.getUserById(id)
    }

    @Patch("update/:id")
    async updateUser(@Param("id") id: string, @Body() dto: UpdateUserDto) {
        return this.userService.updateUser(id, dto)
    }

    @Delete("delete/:id")
    async delete(@Param("id") id: string) {
        return this.userService.delete(id)
    }


}
