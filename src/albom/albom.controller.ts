import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { CreateAlbomDto } from "./dto/create-albom.dto";
import { AuthGuard } from "../auth/auth.guard";
import { UpdateAlbomDto } from "./dto/update-albom.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { AlbomService } from "./albom.service";

@Controller('albom')
export class AlbomController {

  constructor(private readonly albomService: AlbomService) {}

  checkDtoFiles(file) {
    if(file) return file[0]
    return null
  }

  @UseGuards(AuthGuard)
  @Post("create")
  @UseInterceptors(FileFieldsInterceptor([
    {name: "picture", maxCount: 1},
  ]))
  async create(@Req() req, @UploadedFiles() files, @Body() dto: CreateAlbomDto) {
    const {picture} = files
    const {user} = req
    return await this.albomService.create(dto, this.checkDtoFiles(picture), user.id)
  }

  @Get("all")
  async getAll(
    @Query("limit") limit: number,
    @Query("offset") offset: number
  ){
    return await this.albomService.getAll(offset, limit)
  }

  @Get("/:id")
  async getAlboms(@Param("id") id: number) {
    return await this.albomService.getAlbom(id)
  }

  @Get("/search")
  async searchTrack(@Query("query") query: string) {
    return await this.albomService.searchAlboms(query)
  }

  @UseGuards(AuthGuard)
  @Patch("update/:id")
  @UseInterceptors(FileFieldsInterceptor([
    {name: "picture", maxCount: 1},
  ]))
  async updateAlboms(@Req() req, @UploadedFiles() files, @Param("id") id: number, @Body() dto: UpdateAlbomDto) {
    const {picture} = files
    const {user} = req
    return await this.albomService.updateAlbom(id, dto, this.checkDtoFiles(picture), user.id)
  }

  @UseGuards(AuthGuard)
  @Delete("delete/:id")
  async deleteAlbom(@Req() req, @Param("id") id: number) {
    const {user} = req
    return await this.albomService.deleteAlbom(id, user.id)
  }

}
